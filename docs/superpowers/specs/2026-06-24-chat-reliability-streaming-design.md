# Chat reliability + streaming

**Date:** 2026-06-24
**Goal:** Make the chat agent hold up under concurrent users (no 502s), cut per-turn latency, and stream the reply token-by-token.

## Problem

The graph is compiled with a `PostgresSaver` checkpointer (`graph.ts:384`, `persistence.ts:8`). LangGraph writes state to Neon **after every super-step**, so one question-turn does ~6 Postgres round-trips. Under concurrency (users × serverless instances) this exhausts Neon connections → the 502 thrown at `+server.ts:20`. The per-node writes also add latency, and the route is blocking (`graph.invoke` + `json()`), so nothing reaches the user until the whole chain finishes.

The checkpointer is also read/written by two other routes:
- `analytics/+server.ts` — `graph.updateState()` seeds `browsing` + `profile`.
- `greeting/+server.ts` — `graph.getState()` reads `profile.project_type`.

## Decision

**Solution A + streaming + graph trim.** Drop the LangGraph checkpointer. Own the between-turn state in a single Neon row, one read + one write per turn, through the `pg.Pool` that already exists. Stream the final answer to the client.

**Graders:** keep `verify_answer` only — it gates the one real trust boundary, claims sent to a prospect. Drop `grade_docs` + the `rewrite_query` loop (expensive, low-value retrieval grading) and `validate_question` (question-quality grading).

DB round-trips per question-turn: **~12 → 2.** LLM calls per question-turn: **5 → 3** (`process_turn` + `answer` + `verify_answer`); per intake-turn: **3 → 2** (`process_turn` + `ask`). The graph touches Postgres zero times mid-run.

## State persistence

New table, created lazily with `CREATE TABLE IF NOT EXISTS` (same pattern as `ensureLeadsTable`):

```sql
chat_sessions (
  session_id TEXT PRIMARY KEY,
  state      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)
```

**Persisted channels** (survive between turns): `messages`, `profile`, `lead_score`, `questions_asked`, `browsing`, `alert_human`, `recommendation_action`.

**Not persisted** (ephemeral, reset each turn): `retrieved_docs`, `pending_message`, `retry_counts`, `intents`, `answer_grade`.

The `rewritten_query`, `doc_relevance`, and `question_grade` channels become unused once their nodes are removed (below) and are deleted from `state.ts`.

Two helpers in `persistence.ts` replace the checkpointer:

```ts
loadSession(id): Promise<PersistedState>   // SELECT state; default blank state if absent
saveSession(id, state): Promise<void>      // INSERT ... ON CONFLICT DO UPDATE
```

`messages` are stored as `{ type, content }[]` and rehydrated to `HumanMessage`/`AIMessage` on load (`type === 'human'` → human, else AI). `slim(finalState)` picks the persisted channels and serializes messages before write.

The graph compiles with **no checkpointer** (`builder.compile()`). Each turn is a fresh `invoke`/`stream` whose input is the rehydrated prior state plus the new `HumanMessage`; the `messagesStateReducer` appends, so `input.messages = [...priorMessages, newHuman]` reconstructs full history with no checkpointer.

## Graph simplification

Remove three nodes and their routing in `graph.ts`:

- **`grade_docs` + `rewrite_query`** — delete both nodes, `routeAfterGradeDocs`, and `makeRewriteQuery`/`makeGradeDocs`. `fetch_docs` now edges straight to `answer`. `makeFetchDocs` always retrieves on the raw last message (the `state.rewritten_query` fallback is gone). Irrelevant retrieval degrades gracefully: `answer` already says "I don't know" when the docs lack the answer, and `verify_answer` still catches anything ungrounded.
- **`validate_question`** — delete the node, `routeAfterValidate`, and `makeValidateQuestion`. `ask` now commits its own message (`messages: [new AIMessage(question)]`) and edges straight to `END`. The `ask` retry counter is no longer read; drop it.

`verify_answer` is unchanged: `answer → verify_answer → answer` on hallucination (≤2), else `compose_response` or `END`. `process_turn`, `ask`, `fetch_docs`, `answer`, `compose_response`, `recommend` remain.

## Route changes

- **`api/chat`** — `loadSession` → stream the graph → `saveSession(slim(finalState))`. Returns a stream (below) instead of `json()`. The 502 becomes an `error` stream frame.
- **`api/analytics`** (the single open-call) — replace `graph.updateState()` with: `loadSession`, refresh `browsing`, seed the profile **without clobbering an existing one** (`profile = prior.profile ?? seededProfile`, so a known `project_type`/`email` survives a reopen), `saveSession`. Return `{ session_id, messages: prior.messages }` so the client can resume server-authoritatively.
- **`api/greeting`** — **deleted.** The route, the `greeting()` client fn, and `DEFAULT_GREETING` are removed. The static widget greeting + server-authoritative resume replace it.

## Greeting & resume

No greeting endpoint. The widget keeps its static opener (`ChatWidget.svelte:13`), rendered instantly as `messages[0]` — zero latency, no LLM call, matching how production widgets (Intercom/Drift/Fin) handle openers. Audience-targeted/behavioural greetings, if ever wanted, belong as templated rules, not a per-open LLM call.

Conversation history becomes **server-authoritative**, with localStorage as an instant-render cache (the Intercom/Drift pattern):

- **Mount:** render the localStorage cache immediately (unchanged) so resume is instant — no flash of empty state.
- **Open:** the `analytics` open-call returns the persisted thread (`prior.messages`). Map server messages to `ChatMessage` (`human → user`, `ai → assistant`) and prepend the static greeting: `messages = [greeting, ...mapped]`. Persist back to localStorage.
- **Guard:** reconcile only if the user hasn't sent a message since opening (don't clobber an in-flight turn). If the server thread is empty (new visitor), keep the static greeting alone.

The client-only `ESCALATION_NOTE` is ephemeral UI, not part of the server thread, and is not restored on resume (re-derivable from `alert_human` if ever needed). Server-authoritative resume survives a localStorage clear and keeps client + server consistent.

## Streaming

**Server.** Route returns a `ReadableStream` (newline-delimited JSON frames). Consume `graph.stream(input, { streamMode: 'messages' })`. The user-facing answer-generating LLM chains — `generateIntakeQuestion`, the `answer` chain, and the `compose_response` question chain — are tagged `runName: 'final_answer'` via `.withConfig(...)`. Forward only tokens from `final_answer` runs; the graders, `process_turn`, and `rewrite_query` stream nothing to the client.

**Frames:**
- `{"t":"token","v":"..."}` — incremental final-answer text.
- `{"t":"reset"}` — clear the in-progress assistant bubble. Emitted when a second `final_answer` run begins in the same turn. With `validate_question` gone, the only regeneration source is `verify_answer` re-running `answer` on hallucination (≤2); the intake (`ask`) path is now terminal and never resets.
- `{"t":"done","session_id":"...","escalate":bool}` — terminal.
- `{"t":"error","name":"..."}` — clean failure (replaces the 502).

**Correctness safety net.** Token streaming is best-effort-progressive but the *final* state is authoritative. After the graph completes, if the accumulated streamed text ≠ the last AI message in `finalState.messages` (e.g. the `compose_response` concatenation `answer\n\nquestion`, or the structured `recommend` node which does not token-stream), emit `reset` + one `token` frame carrying the authoritative full message before `done`. This guarantees the user always lands on the correct message regardless of which graph path ran.

**Client.** Add `chatStream(sessionId, message, { onToken, onReset, onDone, onError })` to `lib/chat/api.ts` that reads `res.body` and dispatches frames. `ChatWidget.svelte` switches from the awaited `chat()` to `chatStream`: append `token` text to the in-progress assistant message, clear it on `reset`, finalize on `done`. `lib/chat/session.ts` transcript persistence is unchanged (the finalized message is saved as today).

## Error handling

- Stream errors → `error` frame, full stack still `console.error`'d to Vercel logs (preserves `de7e4f8` behaviour).
- `saveSession` failure after a successful reply: log and still emit `done` — the user got their answer; losing one turn's persistence is recoverable next turn (the client also holds the transcript).
- Lead email remains best-effort (`graph.ts:319`), unchanged.

## Out of scope

- Dropping `verify_answer` — kept deliberately as the outbound-claim trust gate.
- Drizzle migration files: follow the existing lazy `CREATE TABLE IF NOT EXISTS` convention instead.
- Rate limiting / abuse controls.
- Cross-device resume / server identity — the session is still keyed by the localStorage `session_id`; no cookie/contact identity yet.

## Testing

- `persistence` round-trip: `slim` → `saveSession` → `loadSession` → `rehydrate` returns equivalent messages/profile (one runnable check).
- Streaming frame parser: a `final_answer` retry produces a `reset` before the second run's tokens.
- Resume: clearing the localStorage transcript then reopening restores the conversation from the server row (`analytics` returns `prior.messages`, mapped to `ChatMessage`).
- Manual: concurrent chat requests don't 502.
