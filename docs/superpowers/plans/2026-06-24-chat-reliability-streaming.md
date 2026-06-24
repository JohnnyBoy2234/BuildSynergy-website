# Chat Reliability + Streaming Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the chat agent survive concurrent users (no 502s), cut per-turn latency, and stream replies — by dropping the per-node Postgres checkpointer for one-row-per-turn state, trimming the graph, and streaming the final answer.

**Architecture:** Compile the LangGraph graph with no checkpointer. Persist between-turn state ourselves in a `chat_sessions` JSONB row (one read + one write per turn) via the existing `pg.Pool`. Stream the final-answer tokens to the client over a `ReadableStream`. Conversation resume becomes server-authoritative (localStorage is an instant cache).

**Tech Stack:** SvelteKit (Node/Vercel adapter), LangGraph JS, ChatGroq, pg, Vitest.

## Global Constraints

- Reuse the existing `pg.Pool` in `persistence.ts`; no new dependency, no new managed service.
- Lazy table creation with `CREATE TABLE IF NOT EXISTS` (match `ensureLeadsTable`), no Drizzle migration files.
- `verify_answer` stays; `grade_docs`, `rewrite_query`, `validate_question` are removed.
- Gate = `npm test` + `npm run build` (`npm run check` has known false $lib errors).
- Vercel function `maxDuration: 60` stays.

---

### Task 1: Session persistence (`chat_sessions` row)

**Files:**
- Modify: `src/lib/server/agent/persistence.ts`
- Test: `src/lib/server/agent/persistence.test.ts` (create)

**Interfaces:**
- Produces:
  - `type PersistedMsg = { type: 'human' | 'ai'; content: string }`
  - `type PersistedState = { messages: PersistedMsg[]; profile: Profile | null; lead_score: number; questions_asked: string[]; browsing: BrowsingSession | null; alert_human: boolean; recommendation_action: string | null }`
  - `blankState(): PersistedState`
  - `loadSession(id: string): Promise<PersistedState>`
  - `saveSession(id: string, state: PersistedState): Promise<void>`
  - `slim(finalState): PersistedState` — picks persisted channels, serializes messages
  - `rehydrate(msgs: PersistedMsg[]): BaseMessage[]`

- [ ] **Step 1: Add the helpers to `persistence.ts`** (append; keep existing `getCheckpointer`/`writeLead` for now — removed in Task 2's route rewrite)

```ts
import { HumanMessage, AIMessage, type BaseMessage } from '@langchain/core/messages';
import type { BrowsingSession } from './browsing';

export type PersistedMsg = { type: 'human' | 'ai'; content: string };
export type PersistedState = {
  messages: PersistedMsg[];
  profile: Profile | null;
  lead_score: number;
  questions_asked: string[];
  browsing: BrowsingSession | null;
  alert_human: boolean;
  recommendation_action: string | null;
};

export function blankState(): PersistedState {
  return {
    messages: [], profile: null, lead_score: 0, questions_asked: [],
    browsing: null, alert_human: false, recommendation_action: null,
  };
}

let sessionsReady: Promise<void> | null = null;
function ensureSessionsTable(): Promise<void> {
  if (!sessionsReady) {
    sessionsReady = pool
      .query(`CREATE TABLE IF NOT EXISTS chat_sessions (
        session_id TEXT PRIMARY KEY,
        state JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`)
      .then(() => undefined);
  }
  return sessionsReady;
}

export async function loadSession(id: string): Promise<PersistedState> {
  await ensureSessionsTable();
  const { rows } = await pool.query('SELECT state FROM chat_sessions WHERE session_id = $1', [id]);
  return rows[0]?.state ?? blankState();
}

export async function saveSession(id: string, state: PersistedState): Promise<void> {
  await ensureSessionsTable();
  await pool.query(
    `INSERT INTO chat_sessions (session_id, state) VALUES ($1, $2)
     ON CONFLICT (session_id) DO UPDATE SET state = $2, updated_at = now()`,
    [id, JSON.stringify(state)],
  );
}

export function rehydrate(msgs: PersistedMsg[]): BaseMessage[] {
  return msgs.map((m) => (m.type === 'human' ? new HumanMessage(m.content) : new AIMessage(m.content)));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function slim(s: any): PersistedState {
  return {
    messages: (s.messages ?? []).map((m: BaseMessage) => ({
      type: m.getType() === 'human' ? 'human' : 'ai', content: String(m.content),
    })),
    profile: s.profile ?? null,
    lead_score: s.lead_score ?? 0,
    questions_asked: s.questions_asked ?? [],
    browsing: s.browsing ?? null,
    alert_human: Boolean(s.alert_human),
    recommendation_action: s.recommendation_action ?? null,
  };
}
```

- [ ] **Step 2: Write the round-trip test** `persistence.test.ts`

```ts
import { describe, it, expect, vi } from 'vitest';
vi.mock('$env/dynamic/private', () => ({ env: {} }));
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { slim, rehydrate, blankState } from './persistence';

describe('slim/rehydrate round-trip', () => {
  it('preserves message roles and content', () => {
    const final = { messages: [new HumanMessage('hi'), new AIMessage('hello')], profile: { email: 'a@b.c' }, lead_score: 0.7 };
    const s = slim(final);
    expect(s.messages).toEqual([{ type: 'human', content: 'hi' }, { type: 'ai', content: 'hello' }]);
    expect(s.profile).toEqual({ email: 'a@b.c' });
    expect(s.lead_score).toBe(0.7);
    const re = rehydrate(s.messages);
    expect(re[0].getType()).toBe('human');
    expect(re[1].getType()).toBe('ai');
    expect(String(re[1].content)).toBe('hello');
  });

  it('blankState is empty', () => {
    expect(blankState().messages).toEqual([]);
    expect(blankState().profile).toBeNull();
  });
});
```

- [ ] **Step 3: Run** `npm test -- persistence` → PASS. Then `npm run build` → clean.
- [ ] **Step 4: Commit** `feat(agent): add chat_sessions row persistence (slim/rehydrate/load/save)`

---

### Task 2: Trim the graph + drop the checkpointer

**Files:**
- Modify: `src/lib/server/agent/graph.ts`
- Modify: `src/lib/server/agent/state.ts`
- Modify: `src/lib/server/agent/index.ts`
- Test: `src/lib/server/agent/graph.test.ts` (exists — must still pass)

**Interfaces:**
- Produces: `buildGraph({ llm, retrieve })` — no `checkpointer` param; returns a compiled graph. `getAgent()` returns `{ graph, llm }` with no checkpointer.

- [ ] **Step 1: Remove nodes/edges in `graph.ts` `buildGraph`** — delete `validate_question`, `rewrite_query`, `grade_docs` nodes and their edges; `fetch_docs → answer`; `ask → END`; compile with no checkpointer.

```ts
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
```

- [ ] **Step 2: Make `ask` commit its own message** — `makeAsk` returns the AIMessage (was committed by the deleted `validate_question`).

```ts
function makeAsk(llm: ChatGroq) {
  return async (state: AgentStateType) => {
    const question = await generateIntakeQuestion(state, llm);
    return { pending_message: question, messages: [new AIMessage(question)] };
  };
}
```

- [ ] **Step 3: Delete dead code in `graph.ts`** — remove `makeValidateQuestion`, `makeRewriteQuery`, `makeGradeDocs`, `routeAfterValidate`, `routeAfterGradeDocs`, and the now-unused imports `GradeSchema`, `DocGradeSchema`. Keep `AnswerGradeSchema` (verify), `TurnAnalysisSchema`, `RecommendationSchema`. `makeFetchDocs` no longer references `rewritten_query`:

```ts
function makeFetchDocs(retrieve: Deps['retrieve']) {
  return async (state: AgentStateType) => {
    const docs = await retrieve(String(state.messages.at(-1)!.content), 3);
    return { retrieved_docs: docs.join('\n\n') };
  };
}
```

- [ ] **Step 4: Tag final-answer chains for streaming** — add `.withConfig({ tags: ['final_answer'] })` to the two user-facing token-producing chains:
  - in `generateIntakeQuestion`: `const chain = prompt.pipe(llm).pipe(new StringOutputParser()).withConfig({ tags: ['final_answer'] });`
  - in `makeAnswer`: `prompt.pipe(llm).pipe(new StringOutputParser()).withConfig({ tags: ['final_answer'] }).invoke(...)`

- [ ] **Step 5: Trim `state.ts`** — remove `rewritten_query`, `doc_relevance`, `question_grade` channels (now unused).

- [ ] **Step 6: Update `index.ts`** — drop the checkpointer:

```ts
async function build() {
  const retrieve = await loadRetriever();
  const llm = makeLlm();
  return { graph: buildGraph({ llm, retrieve }), llm };
}
```

- [ ] **Step 7: Run** `npm test` (graph.test routing must still pass) → PASS. `npm run build` → clean.
- [ ] **Step 8: Commit** `refactor(agent): drop checkpointer + grade_docs/rewrite/validate nodes, tag final answer`

---

### Task 3: Stream the chat route

**Files:**
- Modify: `src/routes/api/chat/+server.ts`

**Interfaces:**
- Consumes: `loadSession`, `saveSession`, `rehydrate`, `slim` (Task 1); `getAgent` (Task 2).
- Produces: a `text/event-stream`-style `ReadableStream` of newline-delimited JSON frames: `{t:'token',v}`, `{t:'reset'}`, `{t:'done',session_id,escalate}`, `{t:'error',name}`.

- [ ] **Step 1: Rewrite the route to stream**

```ts
import { error } from '@sveltejs/kit';
import { HumanMessage } from '@langchain/core/messages';
import { randomUUID } from 'node:crypto';
import { getAgent } from '$lib/server/agent';
import { loadSession, saveSession, rehydrate, slim, type PersistedState } from '$lib/server/agent/persistence';
import type { RequestHandler } from './$types';

export const config = { maxDuration: 60 };

const enc = new TextEncoder();
const frame = (o: unknown) => enc.encode(JSON.stringify(o) + '\n');

export const POST: RequestHandler = async ({ request }) => {
  const { message, session_id } = await request.json();
  const sessionId = session_id || randomUUID();
  const prior = await loadSession(sessionId);
  const { graph } = await getAgent();

  const input = {
    ...prior,
    messages: [...rehydrate(prior.messages), new HumanMessage(message)],
  };

  const stream = new ReadableStream({
    async start(controller) {
      let streamed = '';
      let started = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let finalState: any = null;
      try {
        for await (const [mode, chunk] of await graph.stream(input, { streamMode: ['messages', 'values'] }) as any) {
          if (mode === 'messages') {
            const [msg, meta] = chunk;
            if (meta?.tags?.includes('final_answer') && msg?.content) {
              if (started && streamed === '') controller.enqueue(frame({ t: 'reset' }));
              streamed += String(msg.content);
              started = true;
              controller.enqueue(frame({ t: 'token', v: String(msg.content) }));
            }
          } else if (mode === 'values') {
            finalState = chunk;
          }
        }
        const slimmed: PersistedState = slim(finalState ?? {});
        const lastAi = [...slimmed.messages].reverse().find((m) => m.type === 'ai');
        const authoritative = lastAi?.content ?? '';
        // Safety net: token stream is best-effort; the committed message is truth.
        if (authoritative && authoritative !== streamed) {
          controller.enqueue(frame({ t: 'reset' }));
          controller.enqueue(frame({ t: 'token', v: authoritative }));
        }
        try { await saveSession(sessionId, slimmed); } catch (e) {
          console.error('saveSession failed:', (e as Error).message); // reply already delivered
        }
        controller.enqueue(frame({ t: 'done', session_id: sessionId, escalate: slimmed.alert_human }));
      } catch (e) {
        console.error('chat agent error:', e);
        controller.enqueue(frame({ t: 'error', name: (e as Error).name }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache' },
  });
};
```

- [ ] **Step 2: Run** `npm run build` → clean. (Runtime verified manually after Task 4.)
- [ ] **Step 3: Commit** `feat(api): stream chat replies, persist session per turn`

---

### Task 4: Client streaming consumption

**Files:**
- Modify: `src/lib/chat/api.ts`
- Modify: `src/lib/components/ChatWidget.svelte`

**Interfaces:**
- Produces: `chatStream(sessionId, message, handlers): Promise<void>` where `handlers = { onToken(v), onReset(), onDone(session_id, escalate), onError() }`.

- [ ] **Step 1: Add `chatStream` to `api.ts`** (keep `chat()` removed — replaced)

```ts
export async function chatStream(
  sessionId: string,
  message: string,
  h: { onToken: (v: string) => void; onReset: () => void; onDone: (sid: string, escalate: boolean) => void; onError: () => void },
): Promise<void> {
  const res = await fetch('/api/chat', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, message }),
  });
  if (!res.ok || !res.body) { h.onError(); return; }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.trim()) continue;
      const f = JSON.parse(line);
      if (f.t === 'token') h.onToken(f.v);
      else if (f.t === 'reset') h.onReset();
      else if (f.t === 'done') h.onDone(f.session_id, f.escalate);
      else if (f.t === 'error') h.onError();
    }
  }
}
```

Also change `analytics()`'s return type to include the resumable thread:
```ts
export function analytics(sessionId: string, browsing: BrowsingSession): Promise<{ session_id: string; messages: { type: 'human' | 'ai'; content: string }[] }> {
  return postJson('/api/analytics', { session_id: sessionId, browsing });
}
```

- [ ] **Step 2: Update `ChatWidget.svelte` `handleSend`** to stream

```ts
import { analytics, chatStream } from '$lib/chat/api';

async function handleSend(text: string) {
  messages = [...messages, { role: 'user', content: text }];
  userSentSinceOpen = true;
  persist();
  sending = true;
  messages = [...messages, { role: 'assistant', content: '' }];
  const idx = messages.length - 1;
  try {
    await chatStream(sessionId, text, {
      onToken: (v) => { messages[idx] = { ...messages[idx], content: messages[idx].content + v }; messages = [...messages]; },
      onReset: () => { messages[idx] = { ...messages[idx], content: '' }; messages = [...messages]; },
      onDone: (_sid, escalate) => {
        if (escalate && !escalated) { escalated = true; messages = [...messages, { role: 'assistant', content: ESCALATION_NOTE }]; }
      },
      onError: () => { messages[idx] = { role: 'error', content: 'Something went wrong — please try again.' }; messages = [...messages]; },
    });
  } finally {
    sending = false;
    persist();
  }
}
```

- [ ] **Step 3: Run** `npm run build` → clean.
- [ ] **Step 4: Commit** `feat(chat): consume streamed replies in the widget`

---

### Task 5: Server-authoritative resume + analytics migration + delete greeting

**Files:**
- Modify: `src/routes/api/analytics/+server.ts`
- Delete: `src/routes/api/greeting/+server.ts`
- Modify: `src/lib/chat/api.ts` (remove `greeting()`)
- Modify: `src/lib/components/ChatWidget.svelte`

**Interfaces:**
- Consumes: `loadSession`, `saveSession` (Task 1); `analytics()` returning `{ session_id, messages }` (Task 4).

- [ ] **Step 1: Rewrite `analytics/+server.ts`** off the checkpointer

```ts
import { json } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { browsingToSeed } from '$lib/server/agent/browsing';
import { loadSession, saveSession } from '$lib/server/agent/persistence';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { browsing, session_id } = await request.json();
  const sessionId = session_id || randomUUID();
  const prior = await loadSession(sessionId);
  const seed = browsingToSeed(browsing);
  const profile = prior.profile ?? {
    name: null, email: null, project_type: null, goal: null, urgency: null, notes: [...seed.notes],
  };
  await saveSession(sessionId, { ...prior, browsing, profile });
  return json({ session_id: sessionId, messages: prior.messages });
};
```

- [ ] **Step 2: Delete** `src/routes/api/greeting/+server.ts` and remove the `greeting()` export from `api.ts`.

- [ ] **Step 3: Add resume to `ChatWidget.svelte`** — declare `let userSentSinceOpen = false;`, and in `toggle()` reconcile from the server thread:

```ts
function toggle() {
  open = !open;
  if (open && !analyticsSent) {
    analyticsSent = true;
    userSentSinceOpen = false;
    void analytics(sessionId, getBrowsing()).then((r) => {
      if (userSentSinceOpen || !r.messages?.length) return; // don't clobber an in-flight turn
      const mapped = r.messages.map((m) => ({ role: m.type === 'human' ? 'user' : 'assistant', content: m.content } as ChatMessage));
      messages = [{ role: 'assistant', content: GREETING }, ...mapped];
      persist();
    }).catch(() => {});
  }
}
```

- [ ] **Step 4: Run** `npm test` + `npm run build` → clean (no remaining import of the deleted route/fn).
- [ ] **Step 5: Commit** `feat(chat): server-authoritative resume; drop greeting endpoint`

---

### Task 6: Manual runtime verification

- [ ] Start dev (`npm run dev`), open the widget, send a message → reply streams token-by-token.
- [ ] Ask a question → answer streams; a hot lead's question gets answered + email ask (not nagged).
- [ ] Reload mid-conversation → transcript resumes (from localStorage instantly).
- [ ] Clear `bs_transcript` in localStorage (keep `bs_session_id`), reopen → conversation restored from the server row.
- [ ] Fire two concurrent chat requests → both succeed, no 502.
- [ ] Note any rough edges (e.g. compose-path reset flash) for the iteration pass.

## Notes / known iteration points

- **Streaming tags:** `streamMode: ['messages','values']` + `tags:['final_answer']` filtering is the highest-risk piece; if tags don't propagate through the piped chain, fall back to filtering by `meta.langgraph_node` ∈ {`ask`,`answer`,`compose_response`}.
- **Compose-path flash:** when `compose_response` concatenates `answer\n\nquestion`, the safety-net reconcile may `reset`+resend. Acceptable for v1; polish in iteration.
- **`recommend`** (structured output) emits no tokens; the safety net sends its message whole. Expected.
