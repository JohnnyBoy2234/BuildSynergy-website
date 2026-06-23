import { t as private_env } from "./shared-server.js";
import { n as chatbotLeadEmail, t as sendLeadEmail } from "./email.js";
import { ChatGroq } from "@langchain/groq";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import pg from "pg";
import { Annotation, END, START, StateGraph, messagesStateReducer } from "@langchain/langgraph";
import { AIMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
//#region src/lib/server/agent/llm.ts
var MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
var EMBED_MODEL = "gemini-embedding-001";
function makeLlm() {
	return new ChatGroq({
		model: MODEL,
		apiKey: private_env.GROQ_API_KEY,
		temperature: 0
	});
}
function makeEmbeddings() {
	return new GoogleGenerativeAIEmbeddings({
		model: EMBED_MODEL,
		apiKey: private_env.GOOGLE_API_KEY,
		taskType: TaskType.RETRIEVAL_QUERY
	});
}
//#endregion
//#region src/lib/server/agent/retriever.ts
var dataPromise = null;
function loadData() {
	if (!dataPromise) dataPromise = Promise.resolve().then(() => {
		const path = join(process.cwd(), "static", "rag-vectors.json");
		return JSON.parse(readFileSync(path, "utf-8"));
	});
	return dataPromise;
}
function cosine(a, b) {
	let dot = 0;
	let na = 0;
	let nb = 0;
	for (let i = 0; i < a.length; i++) {
		dot += a[i] * b[i];
		na += a[i] * a[i];
		nb += b[i] * b[i];
	}
	return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}
/**
* Returns a query fn: (query, k) => top-k chunk strings, ranked by cosine
* similarity against the build-time-embedded corpus. Only the query is embedded
* at runtime; corpus vectors come from static/rag-vectors.json.
*/
async function loadRetriever() {
	const data = await loadData();
	const embeddings = makeEmbeddings();
	return async (query, k = 3) => {
		const q = await embeddings.embedQuery(query);
		return data.vectors.map((v, i) => ({
			i,
			score: cosine(q, v)
		})).sort((x, y) => y.score - x.score).slice(0, k).map(({ i }) => data.chunks[i]);
	};
}
//#endregion
//#region src/lib/server/agent/persistence.ts
var checkpointerPromise = null;
function getCheckpointer() {
	if (!checkpointerPromise) checkpointerPromise = (async () => {
		const saver = PostgresSaver.fromConnString(private_env.DATABASE_URL);
		await saver.setup();
		return saver;
	})();
	return checkpointerPromise;
}
var pool = new pg.Pool({ connectionString: private_env.DATABASE_URL });
var leadsReady = null;
function ensureLeadsTable() {
	if (!leadsReady) leadsReady = pool.query(`CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        score REAL NOT NULL,
        action TEXT NOT NULL,
        profile JSONB NOT NULL,
        signals JSONB NOT NULL,
        notes JSONB NOT NULL
      )`).then(() => void 0);
	return leadsReady;
}
async function writeLead(profile, score, action, questionsAsked, messages) {
	await ensureLeadsTable();
	const filledFields = [
		"project_type",
		"goal",
		"urgency",
		"email"
	].filter((f) => profile[f]);
	const allText = messages.filter((m) => m.type === "human").map((m) => m.content.toLowerCase()).join(" ");
	const signals = {
		filled_fields: filledFields,
		asked_pricing: questionsAsked.some((q) => [
			"how much",
			"pricing",
			"cost",
			"price",
			"rate"
		].some((kw) => q.toLowerCase().includes(kw))),
		urgency_detected: [
			"asap",
			"deadline",
			"urgent",
			"as soon as",
			"need it"
		].some((kw) => allText.includes(kw)),
		turns_engaged: messages.length
	};
	await pool.query(`INSERT INTO leads (score, action, profile, signals, notes) VALUES ($1, $2, $3, $4, $5)`, [
		score,
		action,
		JSON.stringify(profile),
		JSON.stringify(signals),
		JSON.stringify(profile.notes ?? [])
	]);
}
//#endregion
//#region src/lib/server/agent/state.ts
var AgentState = Annotation.Root({
	messages: Annotation({
		reducer: messagesStateReducer,
		default: () => []
	}),
	profile: Annotation,
	alert_human: Annotation,
	rewritten_query: Annotation,
	retrieved_docs: Annotation,
	pending_message: Annotation,
	retry_counts: Annotation({
		reducer: (_a, b) => b,
		default: () => ({})
	}),
	lead_score: Annotation,
	intents: Annotation({
		reducer: (_a, b) => b,
		default: () => []
	}),
	questions_asked: Annotation({
		reducer: (_a, b) => b,
		default: () => []
	}),
	browsing: Annotation,
	doc_relevance: Annotation,
	answer_grade: Annotation,
	question_grade: Annotation,
	recommendation_action: Annotation
});
var FIELD_POINTS = {
	email: 2,
	project_type: 3,
	goal: 3,
	urgency: 2
};
var MAX_POINTS = Object.values(FIELD_POINTS).reduce((a, b) => a + b, 0);
var PRICING_KEYWORDS = [
	"how much",
	"pricing",
	"cost",
	"do you do",
	"can you build",
	"price",
	"rate",
	"charge"
];
var URGENCY_KEYWORDS = [
	"asap",
	"deadline",
	"urgent",
	"as soon as",
	"need it",
	"by "
];
var BUDGET_KEYWORDS = [
	"budget",
	"how much",
	"pricing",
	"cost",
	" r ",
	"afford"
];
var round4$1 = (n) => Math.round(n * 1e4) / 1e4;
function fieldCompleteness(profile) {
	return Object.entries(FIELD_POINTS).reduce((sum, [field, pts]) => profile[field] ? sum + pts : sum, 0) / MAX_POINTS;
}
function engagementScore(questionsAsked) {
	const turnDepth = Math.min(questionsAsked.length / 8, 1);
	const qs = questionsAsked.map((q) => q.toLowerCase());
	const pricingHit = qs.some((q) => PRICING_KEYWORDS.some((kw) => q.includes(kw))) ? .4 : 0;
	const otherQs = qs.filter((q) => !PRICING_KEYWORDS.some((kw) => q.includes(kw)));
	const otherScore = Math.min(otherQs.length * .15, .6);
	return Math.min(turnDepth + pricingHit + otherScore, 1);
}
function intentSignalScore(messages) {
	const allText = messages.filter((m) => m.type === "human" && typeof m.content === "string").map((m) => m.content.toLowerCase()).join(" ");
	const urgency = URGENCY_KEYWORDS.some((kw) => allText.includes(kw)) ? .6 : 0;
	const budget = BUDGET_KEYWORDS.some((kw) => allText.includes(kw)) ? .4 : 0;
	return Math.min(urgency + budget, 1);
}
function computeLeadScore(profile, messages, questionsAsked, behavioral = 0) {
	const completeness = fieldCompleteness(profile);
	const engagement = engagementScore(questionsAsked);
	const intent = intentSignalScore(messages);
	return round4$1(completeness * .45 + engagement * .25 + intent * .15 + behavioral * .15);
}
//#endregion
//#region src/lib/server/agent/browsing.ts
var INFERENCE_CONF = .5;
var hasPath = (s, prefix) => s.page_views.some((pv) => pv.path.startsWith(prefix));
var visitsTo = (s, prefix) => s.page_views.filter((pv) => pv.path.startsWith(prefix)).reduce((sum, pv) => sum + pv.visits, 0);
var round4 = (n) => Math.round(n * 1e4) / 1e4;
function behavioralScore(s) {
	let score = 0;
	if (hasPath(s, "/contact")) score += .35;
	const pricingVisits = visitsTo(s, "/pricing");
	if (pricingVisits) score += Math.min(.15 + .1 * (pricingVisits - 1), .35);
	score += Math.min(((s.session_count ?? 1) - 1) * .1, .2);
	score += Math.min((s.total_time_seconds ?? 0) / 600 * .1, .1);
	return round4(Math.min(score, 1));
}
function browsingToSeed(s) {
	const notes = [];
	const inferred = {};
	for (const pv of s.page_views) {
		const { path } = pv;
		const visits = pv.visits ?? 1;
		if (path.startsWith("/pricing")) {
			const suffix = visits > 1 ? ` ${visits}×` : "";
			notes.push(`Viewed /pricing${suffix} before chatting — price-sensitive / evaluating cost`);
		} else if (path.startsWith("/contact")) notes.push("Visited /contact — high intent, near conversion");
		else if (path.startsWith("/portfolio/") || path.startsWith("/services/")) {
			inferred.project_type = {
				claim: `Interested in a ${path.replace(/\/$/, "").split("/").pop() ?? ""} project`,
				confidence: INFERENCE_CONF,
				reasoning: `Browsed ${path} before chatting`
			};
			notes.push(`Browsed ${path}`);
		}
	}
	return {
		notes,
		inferred
	};
}
//#endregion
//#region src/lib/server/agent/schemas.ts
var InferenceSchema = z.object({
	claim: z.string(),
	confidence: z.number().gt(0).lte(1),
	reasoning: z.string()
});
var TurnAnalysisSchema = z.object({
	name: z.string().nullable().default(null),
	email: z.string().nullable().default(null),
	project_type: z.string().nullable().default(null),
	goal: z.string().nullable().default(null),
	urgency: z.string().nullable().default(null),
	extraction_quality: z.enum(["good", "poor"]).default("good"),
	inferred_project_type: InferenceSchema.nullable().default(null),
	inferred_goal: InferenceSchema.nullable().default(null),
	inferred_urgency: InferenceSchema.nullable().default(null),
	inferred_notes: z.array(InferenceSchema).default([]),
	intents: z.array(z.enum(["question", "intake"])).default([])
});
var GradeSchema = z.object({ score: z.enum(["good", "poor"]) });
var DocGradeSchema = z.object({ score: z.enum(["relevant", "irrelevant"]) });
var AnswerGradeSchema = z.object({ score: z.enum(["grounded", "hallucination"]) });
var RecommendationSchema = z.object({
	action: z.enum([
		"portfolio",
		"contact",
		"newsletter"
	]),
	message: z.string()
});
//#endregion
//#region src/lib/server/agent/graph.ts
var conversation = (messages) => messages.map((m) => `${m.getType() === "human" ? "User" : "Assistant"}: ${m.content}`).join("\n");
function mergeProfile(current, a) {
	const merged = {
		...current,
		notes: [...current.notes ?? []]
	};
	for (const f of [
		"name",
		"email",
		"project_type",
		"goal",
		"urgency"
	]) if (a[f] != null) merged[f] = a[f];
	for (const f of [
		"project_type",
		"goal",
		"urgency"
	]) {
		if (merged[f]) continue;
		const inferred = a[`inferred_${f}`];
		if (!inferred) continue;
		if (inferred.confidence >= .6) {
			merged[f] = inferred.claim;
			merged.notes.push(`Assumed ${f}: ${inferred.reasoning}`);
		} else merged.notes.push(`${inferred.claim} — ${inferred.reasoning}`);
	}
	for (const note of a.inferred_notes ?? []) merged.notes.push(`${note.claim} — ${note.reasoning}`);
	return merged;
}
async function generateIntakeQuestion(state, llm) {
	const profile = state.profile ?? {};
	const score = state.lead_score ?? 0;
	const notes = profile.notes ?? [];
	let target;
	if (score >= .65 && !profile.email) target = "email";
	else target = [
		"project_type",
		"goal",
		"urgency",
		"email"
	].find((f) => !profile[f]) ?? null;
	if (target === null) return "Is there anything else I can help you with before we continue?";
	return ChatPromptTemplate.fromMessages([["system", `You are a warm, conversational assistant helping understand a potential client's needs.

Current profile: {profile}
Inferred notes (soft signals — not confirmed): {notes}
Conversation so far: {conversation}

Your task:
1. In one sentence, naturally acknowledge what the user just said.
2. Ask ONE question to find out: {target_instruction}
3. If there is an inferred note related to this field, phrase it as a soft confirmation instead of a direct question.
   Example: "It sounds like you might need this fairly soon — is that right?"
4. Never ask multiple questions. Never sound like a form.

Be warm. Show you have been listening.`], ["human", "Generate the next message."]]).pipe(llm).pipe(new StringOutputParser()).invoke({
		profile: JSON.stringify(profile),
		notes: JSON.stringify(notes),
		conversation: conversation(state.messages),
		target_instruction: {
			project_type: "Ask what kind of project or website they want to build.",
			goal: "Ask what outcome or result they want to achieve with this project.",
			urgency: "Ask about their timeline — when do they need this done?",
			email: "Ask for the best email address to reach them, framing it as wanting to follow up personally."
		}[target]
	});
}
function makeProcessTurn(llm) {
	const structured = llm.withStructuredOutput(TurnAnalysisSchema, {
		method: "jsonMode",
		name: "TurnAnalysis"
	});
	return async (state) => {
		const profile = state.profile ?? {};
		const questionsAsked = [...state.questions_asked ?? []];
		const analysis = await ChatPromptTemplate.fromMessages([["system", `Analyse the latest user message in the context of the full conversation.

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

Respond with JSON only.`], ["human", "Full conversation:\n{conversation}\n\nLatest message: {latest}\n\nCurrent profile: {profile}"]]).pipe(structured).invoke({
			conversation: conversation(state.messages),
			latest: state.messages.at(-1).content,
			profile: JSON.stringify(profile)
		});
		const merged = mergeProfile(profile, analysis);
		if (analysis.intents.includes("question")) questionsAsked.push(String(state.messages.at(-1).content));
		const behavioral = state.browsing ? behavioralScore(state.browsing) : 0;
		const score = computeLeadScore(merged, state.messages.map((m) => ({
			type: m.getType(),
			content: String(m.content)
		})), questionsAsked, behavioral);
		return {
			profile: merged,
			intents: analysis.intents,
			questions_asked: questionsAsked,
			lead_score: score,
			retrieved_docs: "",
			retry_counts: {}
		};
	};
}
function makeAsk(llm) {
	return async (state) => {
		const counts = { ...state.retry_counts ?? {} };
		counts.ask = (counts.ask ?? 0) + 1;
		return {
			pending_message: await generateIntakeQuestion(state, llm),
			retry_counts: counts
		};
	};
}
function makeValidateQuestion(llm) {
	const structured = llm.withStructuredOutput(GradeSchema, {
		method: "jsonMode",
		name: "Grade"
	});
	return async (state) => {
		const question = state.pending_message ?? "";
		if (((state.retry_counts ?? {}).ask ?? 0) >= 2) return {
			question_grade: "good",
			messages: [new AIMessage(question)]
		};
		if ((await ChatPromptTemplate.fromMessages([["system", `Grade this question about to be sent to a user.

Question: "{question}"
Conversation so far: {conversation}
Current profile: {profile}

Grade "good" if: sounds natural, targets a real profile gap, not already answered.
Grade "poor" if: information is already in the profile, very similar to a previous question, or sounds robotic.
Respond with JSON only: {{"score": "good"}} or {{"score": "poor"}}`], ["human", "Grade this question."]]).pipe(structured).invoke({
			question,
			conversation: conversation(state.messages),
			profile: JSON.stringify(state.profile ?? {})
		})).score === "good") return {
			question_grade: "good",
			messages: [new AIMessage(question)]
		};
		return { question_grade: "poor" };
	};
}
function makeRewriteQuery(llm) {
	return async (state) => {
		const counts = { ...state.retry_counts ?? {} };
		counts.rewrite_query = (counts.rewrite_query ?? 0) + 1;
		return {
			rewritten_query: await ChatPromptTemplate.fromMessages([["system", "Rewrite the user's question for document retrieval. Strip conversational elements. Focus on the core information need. User context: {profile}"], ["human", "{question}"]]).pipe(llm).pipe(new StringOutputParser()).invoke({
				question: state.messages.at(-1).content,
				profile: JSON.stringify(state.profile ?? {})
			}),
			retry_counts: counts
		};
	};
}
function makeFetchDocs(retrieve) {
	return async (state) => {
		return { retrieved_docs: (await retrieve(state.rewritten_query || String(state.messages.at(-1).content), 3)).join("\n\n") };
	};
}
function makeGradeDocs(llm) {
	const structured = llm.withStructuredOutput(DocGradeSchema, {
		method: "jsonMode",
		name: "DocGrade"
	});
	return async (state) => {
		const query = state.rewritten_query || String(state.messages.at(-1).content);
		return { doc_relevance: (await ChatPromptTemplate.fromMessages([["system", `Are these documents relevant to answering the query?
Query: {query}
Documents: {docs}
Grade 'relevant' if the documents contain useful information. Grade 'irrelevant' if they do not.
Respond with JSON only: {{"score": "relevant"}} or {{"score": "irrelevant"}}`], ["human", "Grade the documents."]]).pipe(structured).invoke({
			query,
			docs: state.retrieved_docs ?? ""
		})).score };
	};
}
var NO_DOCS_FALLBACK = "I don't have enough information in my documents to answer that accurately.";
function makeAnswer(llm) {
	return async (state) => {
		const counts = { ...state.retry_counts ?? {} };
		counts.answer = (counts.answer ?? 0) + 1;
		const docs = state.retrieved_docs ?? "";
		if (!docs) return {
			pending_message: NO_DOCS_FALLBACK,
			retry_counts: counts
		};
		return {
			pending_message: await ChatPromptTemplate.fromMessages([["system", "Answer the question using ONLY the provided documents. If the answer is not present, say you don't know. User context: {profile}\n\nDocuments:\n{docs}"], ["human", "{question}"]]).pipe(llm).pipe(new StringOutputParser()).invoke({
				question: state.messages.at(-1).content,
				docs,
				profile: JSON.stringify(state.profile ?? {})
			}),
			retry_counts: counts
		};
	};
}
function makeVerifyAnswer(llm) {
	const structured = llm.withStructuredOutput(AnswerGradeSchema, {
		method: "jsonMode",
		name: "AnswerGrade"
	});
	return async (state) => {
		const answer = state.pending_message ?? "";
		const counts = state.retry_counts ?? {};
		const docs = state.retrieved_docs ?? "";
		if (!docs) return {
			answer_grade: "grounded",
			pending_message: NO_DOCS_FALLBACK,
			messages: [new AIMessage(NO_DOCS_FALLBACK)]
		};
		if ((await ChatPromptTemplate.fromMessages([["system", `Is this answer grounded in the provided documents?
Documents: {docs}
Answer: {answer}
Grade "grounded" if every claim is supported. Grade "hallucination" if the answer makes claims not in the documents.
Respond with JSON only: {{"score": "grounded"}} or {{"score": "hallucination"}}`], ["human", "Grade the answer."]]).pipe(structured).invoke({
			docs,
			answer
		})).score === "grounded") return {
			answer_grade: "grounded",
			messages: [new AIMessage(answer)]
		};
		if ((counts.answer ?? 0) >= 2) return {
			answer_grade: "grounded",
			pending_message: NO_DOCS_FALLBACK,
			messages: [new AIMessage(NO_DOCS_FALLBACK)]
		};
		return { answer_grade: "hallucination" };
	};
}
function makeComposeResponse(llm) {
	return async (state) => {
		return { messages: [new AIMessage(`${state.pending_message ?? ""}\n\n${await generateIntakeQuestion(state, llm)}`)] };
	};
}
function makeRecommend(llm) {
	const structured = llm.withStructuredOutput(RecommendationSchema, {
		method: "jsonMode",
		name: "Recommendation"
	});
	return async (state) => {
		const profile = state.profile ?? {};
		const score = state.lead_score ?? 0;
		const questionsAsked = state.questions_asked ?? [];
		const result = await ChatPromptTemplate.fromMessages([["system", `Based on this client profile, recommend the best next step.
Profile: {profile}

Options:
- portfolio: they want to explore examples of work (curious, early stage, no clear project)
- contact: they have a clear project and want to discuss (ready to start, high urgency)
- newsletter: they are early in research with no clear direction yet

Choose one and write a warm, natural message recommending it with a brief reason why.
Respond with JSON only: {{"action": "portfolio"|"contact"|"newsletter", "message": "..."}}`], ["human", "Generate the recommendation."]]).pipe(structured).invoke({ profile: JSON.stringify(profile) });
		const msgs = state.messages.map((m) => ({
			type: m.getType(),
			content: String(m.content)
		}));
		await writeLead(profile, score, result.action, questionsAsked, msgs);
		try {
			await sendLeadEmail(chatbotLeadEmail(profile, score, result.action, conversation(state.messages)));
		} catch (e) {
			console.error("chatbot lead email failed:", e.message);
		}
		return {
			alert_human: true,
			recommendation_action: result.action,
			messages: [new AIMessage(result.message)]
		};
	};
}
function routeAfterProcessTurn(state) {
	const profile = state.profile ?? {};
	const score = state.lead_score ?? 0;
	const intents = state.intents ?? [];
	if (score >= .65) return profile.email ? "recommend" : "ask";
	if (intents.includes("question") && intents.includes("intake")) return "compose_fetch";
	if (intents.includes("question")) return "fetch_docs";
	return "ask";
}
function routeAfterValidate(state) {
	const counts = state.retry_counts ?? {};
	if (state.question_grade === "good") return "__end__";
	if ((counts.ask ?? 0) >= 2) return "__end__";
	return "ask";
}
function routeAfterGradeDocs(state) {
	const counts = state.retry_counts ?? {};
	if (state.doc_relevance === "irrelevant" && (counts.rewrite_query ?? 0) < 2) return "rewrite_query";
	return "answer";
}
function routeAfterVerify(state) {
	if (state.answer_grade === "hallucination") return "answer";
	if ((state.intents ?? []).includes("intake")) return "compose_response";
	return "__end__";
}
function buildGraph({ llm, retrieve }, checkpointer) {
	return new StateGraph(AgentState).addNode("process_turn", makeProcessTurn(llm)).addNode("ask", makeAsk(llm)).addNode("validate_question", makeValidateQuestion(llm)).addNode("rewrite_query", makeRewriteQuery(llm)).addNode("fetch_docs", makeFetchDocs(retrieve)).addNode("grade_docs", makeGradeDocs(llm)).addNode("answer", makeAnswer(llm)).addNode("verify_answer", makeVerifyAnswer(llm)).addNode("compose_response", makeComposeResponse(llm)).addNode("recommend", makeRecommend(llm)).addEdge(START, "process_turn").addConditionalEdges("process_turn", routeAfterProcessTurn, {
		recommend: "recommend",
		ask: "ask",
		fetch_docs: "fetch_docs",
		compose_fetch: "fetch_docs"
	}).addEdge("ask", "validate_question").addConditionalEdges("validate_question", routeAfterValidate, {
		ask: "ask",
		__end__: END
	}).addEdge("rewrite_query", "fetch_docs").addEdge("fetch_docs", "grade_docs").addConditionalEdges("grade_docs", routeAfterGradeDocs, {
		answer: "answer",
		rewrite_query: "rewrite_query"
	}).addEdge("answer", "verify_answer").addConditionalEdges("verify_answer", routeAfterVerify, {
		answer: "answer",
		compose_response: "compose_response",
		__end__: END
	}).addEdge("compose_response", END).addEdge("recommend", END).compile({ checkpointer });
}
//#endregion
//#region src/lib/server/agent/index.ts
var agentPromise = null;
async function build() {
	const [retrieve, checkpointer] = await Promise.all([loadRetriever(), getCheckpointer()]);
	const llm = makeLlm();
	return {
		graph: buildGraph({
			llm,
			retrieve
		}, checkpointer),
		llm
	};
}
function getAgent() {
	if (!agentPromise) agentPromise = build();
	return agentPromise;
}
//#endregion
export { browsingToSeed as n, getAgent as t };
