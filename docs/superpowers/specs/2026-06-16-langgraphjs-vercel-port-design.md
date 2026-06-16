# Design: Port the q_aBot lead agent to LangGraph.js on Vercel

**Date:** 2026-06-16
**Status:** Approved (pending written-spec review)
**Source of truth being ported:** `~/Projects/q_aBot` (Python: FastAPI + LangGraph + LangChain)
**Target:** `~/Projects/BuildSynergy-website` (SvelteKit 2, Svelte 5, TS, Vercel)

## Goal

Run the BuildSynergy lead-capture chatbot entirely inside the existing SvelteKit
website, deployed on Vercel — no separate VPS. The Python agent is rewritten in
TypeScript using LangGraph.js and served from SvelteKit API routes, so frontend
and agent live in one codebase, one deploy, one language.

## Why this over the alternatives

- **VPS (Oracle):** works as-is but is a second platform and an always-on box to
  maintain. Rejected because the user wants everything in one place.
- **Python on Vercel:** fights the platform — 250MB serverless bundle limit with a
  heavy `langchain`/`langgraph` tree, slow cold starts. Rejected.
- **LangGraph.js on Vercel (this design):** native runtime for Vercel, one language
  across the SvelteKit app. Cost is a one-time rewrite of ~640 lines of graph logic.

The serverless runtime — not the language — is what forces the data-layer changes
below. They would be required for *any* Vercel deployment.

## Decisions (locked)

| Area | Decision |
|---|---|
| Port fidelity | **Faithful 1:1** port of the Python graph (all 10 nodes, routers, retry caps, grading loops). Prompts ported verbatim. |
| Embeddings | **Google Gemini** free tier (query-time + build-time). |
| Vector store | **No vector DB.** Embed the 4 corpus docs at build time → `static/rag-vectors.json` → load into an in-memory store at runtime. |
| Sessions | **Neon Postgres** free tier via LangGraph `PostgresSaver` (replaces SQLite `AsyncSqliteSaver`). |
| Leads | **Neon Postgres** `leads` table (replaces `leads/leads.txt` append). |
| LLM | **Groq** `meta-llama/llama-4-scout-17b-16e-instruct` (unchanged from Python). |
| Code location | Agent lives in `src/lib/server/agent/` inside BuildSynergy-website. |
| q_aBot fate | **Kept as the Python reference** until the TS port reaches parity; not deleted. |
| Adapter | Switch `@sveltejs/adapter-static` → `@sveltejs/adapter-vercel`. |

## Architecture

### Project layout (in BuildSynergy-website)

```
svelte.config.js              # adapter-static → adapter-vercel
src/lib/server/agent/         # server-only (never bundled to client)
├─ graph.ts                   # StateGraph: 10 nodes + conditional routers
├─ state.ts                   # Annotation.Root state channels
├─ schemas.ts                 # Zod schemas (structured output)
├─ scoring.ts                 # pure port of scoring.py
├─ browsing.ts                # pure port of browsing.py
├─ retriever.ts               # loads rag-vectors.json → MemoryVectorStore
├─ persistence.ts             # PostgresSaver + leads INSERT
└─ llm.ts                     # ChatGroq + GoogleGenerativeAIEmbeddings
src/routes/api/
├─ chat/+server.ts            # POST /api/chat   (streams the reply)
├─ analytics/+server.ts       # POST /api/analytics
└─ greeting/+server.ts        # POST /api/greeting
scripts/embed-docs.ts         # build-time embed → static/rag-vectors.json
data/*.txt                    # 4 corpus files copied from q_aBot
```

`src/lib/server/**` is enforced server-only by SvelteKit, so `GROQ_API_KEY`,
`GOOGLE_API_KEY`, and `DATABASE_URL` cannot leak to the client. Because the widget
and API are same-origin, the CORS middleware from the Python app is **dropped
entirely**.

### The graph (faithful port of agent/graph.py)

- **State:** Python `MessagesState` subclass → `Annotation.Root({...})` with the same
  channels: `messages`, `profile`, `inferences`, `alert_human`, `rewritten_query`,
  `retrieved_docs`, `pending_message`, `retry_counts`, `lead_score`, `intents`,
  `questions_asked`, `browsing`, and the ephemeral RAG signals (`doc_relevance`,
  `answer_grade`, `question_grade`, `recommendation_action`).
- **Nodes (10):** `process_turn`, `ask`, `validate_question`, `rewrite_query`,
  `fetch_docs`, `grade_docs`, `answer`, `verify_answer`, `compose_response`,
  `recommend`.
- **Routers:** `_route_after_process_turn`, `_route_after_validate`,
  `_route_after_grade_docs`, `_route_after_verify` — ported edge-for-edge.
- **Retry caps preserved:** `ask` ≤ 2, `rewrite_query` < 2, `answer` ≤ 2.
- **Structured output:** Python `.with_structured_output(PydanticModel, method="json_mode")`
  → `.withStructuredOutput(zodSchema)` on `ChatGroq`. Zod equivalents for
  `TurnAnalysis`, `Inference`, `Grade`, `DocGrade`, `AnswerGrade`,
  `RecommendationOutput`.
- **Prompts:** ported **verbatim** — they are tuned product logic, not to be
  reworded during the port.

### Data flow per endpoint

- **POST /api/chat** `{ message, session_id? }` → runs the graph with
  `thread_id = session_id` → **streams** the final composed reply token-by-token.
  Internal grading hops complete before the stream begins. Returns `escalate`
  (= `alert_human`) and `session_id`.
- **POST /api/analytics** `{ browsing, session_id? }` → seeds browsing + an
  inferred profile into graph state via `updateState` (port of `browsing_to_seed`).
- **POST /api/greeting** `{ session_id?, browsing? }` → returns a personalized
  opening line (returning-visitor message if `project_type` known, else a
  browsing-aware opener, else the default greeting).

### RAG without a vector DB

The corpus is 4 text files (~11KB total). `scripts/embed-docs.ts` runs at build
time (and on demand), chunks + embeds with Gemini, and writes
`static/rag-vectors.json`. At runtime `retriever.ts` loads that JSON into an
in-memory vector store; **only the user's query is embedded per request**. The
`.data_hash` skip-rebuild logic from `vectorstore.py` moves into the build script.

### Persistence

- **Checkpointer:** `PostgresSaver` (`@langchain/langgraph-checkpoint-postgres`)
  against Neon, using Neon's **pooled** connection string (serverless opens many
  short-lived connections). `thread_id = session_id`, identical to today.
  `.setup()` creates the checkpoint tables once.
- **Leads:** `recommend`'s `_write_lead_record` → an `INSERT` into a `leads` table
  carrying the same fields (profile, score, action, derived signals, notes,
  captured-at timestamp).

## Non-goals

- No change to the agent's conversational behavior or prompts.
- No new vector database.
- No deletion of the Python q_aBot project during this work.
- No redesign of the chat widget UI (separate concern; this is the backend port).
- No multi-tenant / multi-business support — single BuildSynergy instance.

## Risks & mitigations

1. **Serverless timeout.** Worst-case turn ≈ 5–6 sequential Groq calls (a few
   seconds). BuildSynergy is on Vercel **Hobby**, which now allows functions up to
   **60s** (raised from the old 10s) — ample headroom. Mitigation: still set
   `export const config = { maxDuration: 60 }` on `/api/chat` explicitly and stream
   the reply for perceived latency.
2. **Vercel Hobby is officially non-commercial.** Hobby's terms are for personal/
   non-commercial use; a customer-facing business chatbot may require **Pro** to be
   ToS-compliant. Not a technical blocker for building/testing, but flag before
   going live on a real BuildSynergy domain.
3. **Structured-output parity.** Groq JSON-mode + Zod should match Pydantic
   `json_mode`, but the Llama-4-scout model is the likeliest source of subtle
   drift. Mitigation: verify each structured node's output against the running
   Python version.
4. **Postgres from serverless** needs pooled connections — use Neon's pooled
   endpoint, not a raw single client.
5. **Rewrite parity bugs.** ~640 lines of tuned graph logic. Mitigation: port in
   stages (pure modules → schemas → nodes → graph → endpoints) and diff behavior
   against q_aBot at each stage.

## Suggested build stages (for the implementation plan)

1. Switch adapter to `adapter-vercel`; add deps (`@langchain/langgraph`,
   `@langchain/groq`, `@langchain/google-genai`, checkpoint-postgres, `zod`).
2. Port pure modules: `scoring.ts`, `browsing.ts` (no LLM — unit-testable first).
3. Zod `schemas.ts` + `llm.ts` wiring.
4. Build-time `embed-docs.ts` + runtime `retriever.ts`.
5. Port the graph: state → nodes → routers → compile with PostgresSaver.
6. `persistence.ts` (checkpointer + leads table).
7. The three `+server.ts` routes; streaming on `/api/chat`.
8. Parity check against q_aBot; deploy to Vercel with env vars set.

## Open questions

- Gemini embedding model + dimensions to standardize on (affects the shipped
  vectors JSON; build-time and query-time must match).
- Whether to upgrade to Vercel Pro before going live (ToS — see risk #2).
