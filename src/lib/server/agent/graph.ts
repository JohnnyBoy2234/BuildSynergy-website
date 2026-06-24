import { StateGraph, START, END } from '@langchain/langgraph';
import { AIMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import type { ChatGroq } from '@langchain/groq';
import { AgentState, type AgentStateType } from './state';
import { SCORE_THRESHOLD, computeLeadScore } from './scoring';
import { behavioralScore } from './browsing';
import { writeLead } from './persistence';
import { sendLeadEmail, chatbotLeadEmail } from '../leads/email';
import {
  TurnAnalysisSchema, AnswerGradeSchema, RecommendationSchema,
  type TurnAnalysis, type Profile,
} from './schemas';

type Deps = { llm: ChatGroq; retrieve: (q: string, k?: number) => Promise<string[]> };

const conversation = (messages: AgentStateType['messages']) =>
  messages.map((m) => `${m.getType() === 'human' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

function mergeProfile(current: Profile, a: TurnAnalysis): Profile {
  const merged: Profile = { ...current, notes: [...(current.notes ?? [])] };
  for (const f of ['name', 'email', 'project_type', 'goal', 'urgency'] as const) {
    if (a[f] != null) merged[f] = a[f];
  }
  for (const f of ['project_type', 'goal', 'urgency'] as const) {
    if (merged[f]) continue;
    const inferred = a[`inferred_${f}` as const];
    if (!inferred) continue;
    if (inferred.confidence >= 0.6) {
      merged[f] = inferred.claim;
      merged.notes.push(`Assumed ${f}: ${inferred.reasoning}`);
    } else {
      merged.notes.push(`${inferred.claim} — ${inferred.reasoning}`);
    }
  }
  for (const note of a.inferred_notes ?? []) merged.notes.push(`${note.claim} — ${note.reasoning}`);
  return merged;
}

async function generateIntakeQuestion(state: AgentStateType, llm: ChatGroq): Promise<string> {
  const profile = state.profile ?? ({} as Profile);
  const score = state.lead_score ?? 0.0;
  const notes = profile.notes ?? [];

  let target: string | null;
  if (score >= SCORE_THRESHOLD && !profile.email) {
    target = 'email';
  } else {
    target = (['project_type', 'goal', 'urgency', 'email'] as const).find((f) => !profile[f]) ?? null;
  }
  if (target === null) return 'Is there anything else I can help you with before we continue?';

  const targetInstructions: Record<string, string> = {
    project_type: 'Ask what kind of project or website they want to build.',
    goal: 'Ask what outcome or result they want to achieve with this project.',
    urgency: 'Ask about their timeline — when do they need this done?',
    email: 'Ask for the best email address to reach them, framing it as wanting to follow up personally.',
  };

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a warm, conversational assistant helping understand a potential client's needs.

Current profile: {profile}
Inferred notes (soft signals — not confirmed): {notes}
Conversation so far: {conversation}

Your task:
1. In one sentence, naturally acknowledge what the user just said.
2. Ask ONE question to find out: {target_instruction}
3. If there is an inferred note related to this field, phrase it as a soft confirmation instead of a direct question.
   Example: "It sounds like you might need this fairly soon — is that right?"
4. Never ask multiple questions. Never sound like a form.

Be warm. Show you have been listening.`,
    ],
    ['human', 'Generate the next message.'],
  ]);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser()).withConfig({ tags: ['final_answer'] });
  return chain.invoke({
    profile: JSON.stringify(profile), notes: JSON.stringify(notes),
    conversation: conversation(state.messages), target_instruction: targetInstructions[target],
  });
}

function makeProcessTurn(llm: ChatGroq) {
  const structured = llm.withStructuredOutput(TurnAnalysisSchema, { method: 'jsonMode', name: 'TurnAnalysis' });
  return async (state: AgentStateType) => {
    const profile = state.profile ?? ({} as Profile);
    const questionsAsked = [...(state.questions_asked ?? [])];
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `Analyse the latest user message in the context of the full conversation.

Current profile: {profile}

Return a single JSON object with these fields:

Explicit extraction (only what is DIRECTLY stated — never infer):
- name: string or null
- email: string or null
- project_type: string or null
- goal: string or null
- urgency: string or null
- extraction_quality: "good" if extraction faithfully captured what was stated, "poor" if relevant info was missed

Soft inferences (only for fields that are currently null AND the conversation STRONGLY implies a value):
- inferred_project_type: {{"claim": "...", "confidence": 0.0-1.0, "reasoning": "..."}} or null
- inferred_goal: same or null
- inferred_urgency: same or null
- inferred_notes: list of 1-3 objects, each with the same structure: {{"claim": "...", "confidence": 0.0-1.0, "reasoning": "..."}}
  Use this for soft observations about the user's situation or mindset that don't fit the above fields.

Intent classification (list — both may apply to the same message):
- intents: list containing "question" and/or "intake"
  - "question": user is asking about services, pricing, policies, or technical details
  - "intake": user is sharing information about themselves or their project

Respond with JSON only.`,
      ],
      ['human', 'Full conversation:\n{conversation}\n\nLatest message: {latest}\n\nCurrent profile: {profile}'],
    ]);
    const analysis = (await prompt.pipe(structured).invoke({
      conversation: conversation(state.messages),
      latest: state.messages.at(-1)!.content,
      profile: JSON.stringify(profile),
    })) as TurnAnalysis;

    const merged = mergeProfile(profile, analysis);
    if (analysis.intents.includes('question')) {
      questionsAsked.push(String(state.messages.at(-1)!.content));
    }
    const behavioral = state.browsing ? behavioralScore(state.browsing) : 0.0;
    const msgs = state.messages.map((m) => ({ type: m.getType(), content: String(m.content) }));
    const score = computeLeadScore(merged, msgs, questionsAsked, behavioral);

    return {
      profile: merged, intents: analysis.intents, questions_asked: questionsAsked,
      lead_score: score, retrieved_docs: '', retry_counts: {},
    };
  };
}

function makeAsk(llm: ChatGroq) {
  return async (state: AgentStateType) => {
    const question = await generateIntakeQuestion(state, llm);
    return { pending_message: question, messages: [new AIMessage(question)] };
  };
}

function makeFetchDocs(retrieve: Deps['retrieve']) {
  return async (state: AgentStateType) => {
    const docs = await retrieve(String(state.messages.at(-1)!.content), 3);
    return { retrieved_docs: docs.join('\n\n') };
  };
}

const NO_DOCS_FALLBACK = "I don't have enough information in my documents to answer that accurately.";

function makeAnswer(llm: ChatGroq) {
  return async (state: AgentStateType) => {
    const counts = { ...(state.retry_counts ?? {}) };
    counts.answer = (counts.answer ?? 0) + 1;
    const docs = state.retrieved_docs ?? '';
    if (!docs) return { pending_message: NO_DOCS_FALLBACK, retry_counts: counts };
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        "Answer the question using ONLY the provided documents. If the answer is not present, say you don't know. User context: {profile}\n\nDocuments:\n{docs}",
      ],
      ['human', '{question}'],
    ]);
    const response = await prompt.pipe(llm).pipe(new StringOutputParser())
      .withConfig({ tags: ['final_answer'] }).invoke({
        question: state.messages.at(-1)!.content, docs, profile: JSON.stringify(state.profile ?? {}),
      });
    return { pending_message: response, retry_counts: counts };
  };
}

function makeVerifyAnswer(llm: ChatGroq) {
  const structured = llm.withStructuredOutput(AnswerGradeSchema, { method: 'jsonMode', name: 'AnswerGrade' });
  return async (state: AgentStateType) => {
    const answer = state.pending_message ?? '';
    const counts = state.retry_counts ?? {};
    const docs = state.retrieved_docs ?? '';
    // compose_response will append the intake question and commit the final message;
    // when it runs, verify must not also commit one (would duplicate in the saved thread).
    const willCompose = (state.intents ?? []).includes('intake')
      || ((state.lead_score ?? 0) >= SCORE_THRESHOLD && !state.profile?.email);
    const commit = (text: string) => (willCompose ? {} : { messages: [new AIMessage(text)] });

    if (!docs) {
      return { answer_grade: 'grounded', pending_message: NO_DOCS_FALLBACK, ...commit(NO_DOCS_FALLBACK) };
    }
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `Is this answer grounded in the provided documents?
Documents: {docs}
Answer: {answer}
Grade "grounded" if every claim is supported. Grade "hallucination" if the answer makes claims not in the documents.
Respond with JSON only: {{"score": "grounded"}} or {{"score": "hallucination"}}`,
      ],
      ['human', 'Grade the answer.'],
    ]);
    const result = await prompt.pipe(structured).invoke({ docs, answer });
    if (result.score === 'grounded') return { answer_grade: 'grounded', ...commit(answer) };
    if ((counts.answer ?? 0) >= 2) {
      return { answer_grade: 'grounded', pending_message: NO_DOCS_FALLBACK, ...commit(NO_DOCS_FALLBACK) };
    }
    return { answer_grade: 'hallucination' };
  };
}

function makeComposeResponse(llm: ChatGroq) {
  return async (state: AgentStateType) => {
    const ragAnswer = state.pending_message ?? '';
    const question = await generateIntakeQuestion(state, llm);
    return { messages: [new AIMessage(`${ragAnswer}\n\n${question}`)] };
  };
}

function makeRecommend(llm: ChatGroq) {
  const structured = llm.withStructuredOutput(RecommendationSchema, { method: 'jsonMode', name: 'Recommendation' });
  return async (state: AgentStateType) => {
    const profile = state.profile ?? ({} as Profile);
    const score = state.lead_score ?? 0.0;
    const questionsAsked = state.questions_asked ?? [];
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `Based on this client profile, recommend the best next step.
Profile: {profile}

Options:
- portfolio: they want to explore examples of work (curious, early stage, no clear project)
- contact: they have a clear project and want to discuss (ready to start, high urgency)
- newsletter: they are early in research with no clear direction yet

Choose one and write a warm, natural message recommending it with a brief reason why.
Respond with JSON only: {{"action": "portfolio"|"contact"|"newsletter", "message": "..."}}`,
      ],
      ['human', 'Generate the recommendation.'],
    ]);
    const result = await prompt.pipe(structured).invoke({ profile: JSON.stringify(profile) });
    const msgs = state.messages.map((m) => ({ type: m.getType(), content: String(m.content) }));
    await writeLead(profile, score, result.action, questionsAsked, msgs);
    // Email delivery is best-effort: the lead is already persisted in Neon, so a
    // mail failure must not break the conversation.
    try {
      await sendLeadEmail(chatbotLeadEmail(profile, score, result.action, conversation(state.messages)));
    } catch (e) {
      console.error('chatbot lead email failed:', (e as Error).message);
    }
    return { alert_human: true, recommendation_action: result.action, messages: [new AIMessage(result.message)] };
  };
}

export function routeAfterProcessTurn(state: AgentStateType): 'recommend' | 'ask' | 'fetch_docs' | 'compose_fetch' {
  const profile = state.profile ?? ({} as Profile);
  const score = state.lead_score ?? 0.0;
  const intents = state.intents ?? [];
  if (score >= SCORE_THRESHOLD) {
    // A hot lead asking a real question must be answered, not nagged for email:
    // compose (answer + email ask) when we still owe an email, else just answer.
    if (intents.includes('question')) return profile.email ? 'fetch_docs' : 'compose_fetch';
    return profile.email ? 'recommend' : 'ask';
  }
  if (intents.includes('question') && intents.includes('intake')) return 'compose_fetch';
  if (intents.includes('question')) return 'fetch_docs';
  return 'ask';
}

export function routeAfterVerify(state: AgentStateType): 'answer' | 'compose_response' | '__end__' {
  if (state.answer_grade === 'hallucination') return 'answer';
  // Append the intake question after the answer when the user shared info, OR
  // when a hot lead still owes us an email — so we capture without nagging.
  const hotNoEmail = (state.lead_score ?? 0) >= SCORE_THRESHOLD && !state.profile?.email;
  if ((state.intents ?? []).includes('intake') || hotNoEmail) return 'compose_response';
  return '__end__';
}

export function buildGraph({ llm, retrieve }: Deps) {
  const builder = new StateGraph(AgentState)
    .addNode('process_turn', makeProcessTurn(llm))
    .addNode('ask', makeAsk(llm))
    .addNode('fetch_docs', makeFetchDocs(retrieve))
    .addNode('answer', makeAnswer(llm))
    .addNode('verify_answer', makeVerifyAnswer(llm))
    .addNode('compose_response', makeComposeResponse(llm))
    .addNode('recommend', makeRecommend(llm))
    .addEdge(START, 'process_turn')
    .addConditionalEdges('process_turn', routeAfterProcessTurn, {
      recommend: 'recommend', ask: 'ask', fetch_docs: 'fetch_docs', compose_fetch: 'fetch_docs',
    })
    .addEdge('ask', END)
    .addEdge('fetch_docs', 'answer')
    .addEdge('answer', 'verify_answer')
    .addConditionalEdges('verify_answer', routeAfterVerify, { answer: 'answer', compose_response: 'compose_response', __end__: END })
    .addEdge('compose_response', END)
    .addEdge('recommend', END);

  return builder.compile();
}
