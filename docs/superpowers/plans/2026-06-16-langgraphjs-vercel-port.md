# LangGraph.js Vercel Port — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the Python q_aBot lead agent in TypeScript with LangGraph.js and serve it from SvelteKit API routes inside BuildSynergy-website, deployed on Vercel free tier.

**Architecture:** Faithful 1:1 port of the Python LangGraph (10 nodes, routers, retry caps). RAG vectors are embedded at build time into a shipped JSON and loaded into an in-memory store; only queries are embedded at runtime. Sessions + leads persist in Neon Postgres via `PostgresSaver`. Agent lives in `src/lib/server/agent/` (server-only); three `+server.ts` routes expose it.

**Tech Stack:** SvelteKit 2 / Svelte 5, `@sveltejs/adapter-vercel`, `@langchain/langgraph`, `@langchain/langgraph-checkpoint-postgres`, `@langchain/groq` (Llama-4-scout), `@langchain/google-genai` (embeddings), `langchain` MemoryVectorStore, `zod`, `vitest`.

**Source of truth (port FROM these, keep them):** `~/Projects/q_aBot/agent/{graph.py,browsing.py,scoring.py,vectorstore.py}` and `~/Projects/q_aBot/api/main.py`. When a step says "port verbatim from graph.py:NN", copy the exact prompt text — prompts are tuned product logic, do not reword.

**Reference spec:** `docs/superpowers/specs/2026-06-16-langgraphjs-vercel-port-design.md`

---

## File Structure

```
svelte.config.js                        # MODIFY: adapter-static → adapter-vercel
package.json                            # MODIFY: deps + scripts
.env / .env.example                     # CREATE: GROQ_API_KEY, GOOGLE_API_KEY, DATABASE_URL
src/lib/server/agent/
├─ scoring.ts        scoring.ts port (pure)         + scoring.test.ts
├─ browsing.ts       browsing.py port (pure)        + browsing.test.ts
├─ schemas.ts        Zod structured-output schemas
├─ llm.ts            ChatGroq + Gemini embeddings factory
├─ retriever.ts      load rag-vectors.json → MemoryVectorStore + retriever.test.ts
├─ state.ts          Annotation.Root state channels
├─ persistence.ts    PostgresSaver + leads INSERT
├─ graph.ts          buildGraph(): nodes + routers + compile
└─ index.ts          getAgent() singleton (lazy init per cold start)
scripts/embed-docs.ts                   # build-time embedder → static/rag-vectors.json
data/{faq,privacy_policy,process,services}.txt   # copied from q_aBot
static/rag-vectors.json                 # generated artifact (committed)
src/routes/api/chat/+server.ts          # POST /api/chat (streams)
src/routes/api/analytics/+server.ts     # POST /api/analytics
src/routes/api/greeting/+server.ts      # POST /api/greeting
```

---

### Task 0: Scaffolding — deps, adapter, env, test runner

**Files:**
- Modify: `package.json`
- Modify: `svelte.config.js`
- Create: `.env.example`, `vitest.config.ts`
- Copy: `data/*.txt` from q_aBot

- [ ] **Step 1: Install dependencies**

```bash
cd ~/Projects/BuildSynergy-website
npm i @langchain/langgraph @langchain/langgraph-checkpoint-postgres @langchain/groq @langchain/google-genai @langchain/core langchain zod pg
npm i -D @sveltejs/adapter-vercel vitest @types/pg tsx
npm uninstall @sveltejs/adapter-static
```

- [ ] **Step 2: Switch the adapter**

Edit `svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ runtime: 'nodejs20.x' }),
  },
};
```

> Note: the old config used `fallback: 'index.html'` (SPA). Removing adapter-static means SvelteKit now prerenders/serves normally. If any existing page relied on SPA fallback, add `export const prerender = true;` to those static routes — the existing marketing pages are static and should prerender fine.

- [ ] **Step 3: Copy the corpus**

```bash
mkdir -p data && cp ~/Projects/q_aBot/data/*.txt data/
ls data/   # expect: faq.txt privacy_policy.txt process.txt services.txt
```

- [ ] **Step 4: Create `.env.example`**

```bash
GROQ_API_KEY=
GOOGLE_API_KEY=
# Neon POOLED connection string (has -pooler in host)
DATABASE_URL=
```

- [ ] **Step 5: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
```

Add to `package.json` `"scripts"`:

```json
"test": "vitest run",
"embed-docs": "tsx scripts/embed-docs.ts"
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json svelte.config.js .env.example vitest.config.ts data/
git commit -m "chore: scaffold LangGraph.js agent (deps, adapter-vercel, corpus, vitest)"
```

---

### Task 1: Port `scoring.ts` (pure, TDD)

**Files:**
- Create: `src/lib/server/agent/scoring.ts`
- Test: `src/lib/server/agent/scoring.test.ts`

Port of `q_aBot/agent/scoring.py`. Keep the same weights and thresholds exactly.

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { computeLeadScore, SCORE_THRESHOLD } from './scoring';

const msg = (type: 'human' | 'ai', content: string) => ({ type, content });

describe('computeLeadScore', () => {
  it('scores an empty profile at zero', () => {
    expect(computeLeadScore({}, [], [], 0)).toBe(0);
  });

  it('weights field completeness at 0.45', () => {
    // all 4 fields filled => completeness 1.0 => 0.45 contribution
    const profile = { email: 'a@b.c', project_type: 'site', goal: 'leads', urgency: 'soon' };
    expect(computeLeadScore(profile, [], [], 0)).toBeCloseTo(0.45, 4);
  });

  it('detects pricing questions in engagement', () => {
    const score = computeLeadScore({}, [], ['how much does it cost'], 0);
    expect(score).toBeGreaterThan(0); // pricing hit contributes via 0.25 weight
  });

  it('adds behavioral signal at 0.15 weight', () => {
    expect(computeLeadScore({}, [], [], 1.0)).toBeCloseTo(0.15, 4);
  });

  it('exposes the threshold constant', () => {
    expect(SCORE_THRESHOLD).toBe(0.65);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- scoring`
Expected: FAIL — cannot find module './scoring'.

- [ ] **Step 3: Implement `scoring.ts`**

```typescript
export const SCORE_THRESHOLD = 0.65;

const FIELD_POINTS: Record<string, number> = { email: 2, project_type: 3, goal: 3, urgency: 2 };
const MAX_POINTS = Object.values(FIELD_POINTS).reduce((a, b) => a + b, 0); // 10

const PRICING_KEYWORDS = ['how much', 'pricing', 'cost', 'do you do', 'can you build', 'price', 'rate', 'charge'];
const URGENCY_KEYWORDS = ['asap', 'deadline', 'urgent', 'as soon as', 'need it', 'by '];
const BUDGET_KEYWORDS = ['budget', 'how much', 'pricing', 'cost', ' r ', 'afford'];

type Msg = { type: string; content: string };

const round4 = (n: number) => Math.round(n * 1e4) / 1e4;

function fieldCompleteness(profile: Record<string, unknown>): number {
  const filled = Object.entries(FIELD_POINTS).reduce(
    (sum, [field, pts]) => (profile[field] ? sum + pts : sum), 0);
  return filled / MAX_POINTS;
}

function engagementScore(questionsAsked: string[]): number {
  const turnDepth = Math.min(questionsAsked.length / 8, 1.0);
  const qs = questionsAsked.map((q) => q.toLowerCase());
  const pricingHit = qs.some((q) => PRICING_KEYWORDS.some((kw) => q.includes(kw))) ? 0.4 : 0.0;
  const otherQs = qs.filter((q) => !PRICING_KEYWORDS.some((kw) => q.includes(kw)));
  const otherScore = Math.min(otherQs.length * 0.15, 0.6);
  return Math.min(turnDepth + pricingHit + otherScore, 1.0);
}

function intentSignalScore(messages: Msg[]): number {
  const allText = messages
    .filter((m) => m.type === 'human' && typeof m.content === 'string')
    .map((m) => m.content.toLowerCase())
    .join(' ');
  const urgency = URGENCY_KEYWORDS.some((kw) => allText.includes(kw)) ? 0.6 : 0.0;
  const budget = BUDGET_KEYWORDS.some((kw) => allText.includes(kw)) ? 0.4 : 0.0;
  return Math.min(urgency + budget, 1.0);
}

export function computeLeadScore(
  profile: Record<string, unknown>,
  messages: Msg[],
  questionsAsked: string[],
  behavioral = 0.0,
): number {
  const completeness = fieldCompleteness(profile);
  const engagement = engagementScore(questionsAsked);
  const intent = intentSignalScore(messages);
  return round4(completeness * 0.45 + engagement * 0.25 + intent * 0.15 + behavioral * 0.15);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- scoring`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/server/agent/scoring.ts src/lib/server/agent/scoring.test.ts
git commit -m "feat: port lead scoring to TS"
```

---

### Task 2: Port `browsing.ts` (pure, TDD)

**Files:**
- Create: `src/lib/server/agent/browsing.ts`
- Test: `src/lib/server/agent/browsing.test.ts`

Port of `q_aBot/agent/browsing.py`. Note `_INFERENCE_CONF = 0.5`.

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { behavioralScore, browsingToSeed, type BrowsingSession } from './browsing';

const session = (overrides: Partial<BrowsingSession> = {}): BrowsingSession => ({
  referrer: '', session_count: 1, total_time_seconds: 0, page_views: [], ...overrides,
});

describe('behavioralScore', () => {
  it('adds 0.35 for a /contact visit', () => {
    const s = session({ page_views: [{ path: '/contact', title: 'Contact', visits: 1, time_seconds: 10 }] });
    expect(behavioralScore(s)).toBeCloseTo(0.35, 4);
  });

  it('caps the total at 1.0', () => {
    const s = session({
      session_count: 10, total_time_seconds: 6000,
      page_views: [
        { path: '/contact', title: 'C', visits: 1, time_seconds: 10 },
        { path: '/pricing', title: 'P', visits: 5, time_seconds: 10 },
      ],
    });
    expect(behavioralScore(s)).toBeLessThanOrEqual(1.0);
  });
});

describe('browsingToSeed', () => {
  it('infers project_type from a /services/ slug at confidence 0.5', () => {
    const s = session({ page_views: [{ path: '/services/web-design', title: 'X', visits: 1, time_seconds: 5 }] });
    const seed = browsingToSeed(s);
    expect(seed.inferred.project_type?.confidence).toBe(0.5);
    expect(seed.inferred.project_type?.claim).toContain('web-design');
  });

  it('notes a pricing visit', () => {
    const s = session({ page_views: [{ path: '/pricing', title: 'P', visits: 2, time_seconds: 5 }] });
    expect(browsingToSeed(s).notes.join(' ')).toContain('pricing');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- browsing`
Expected: FAIL — cannot find module './browsing'.

- [ ] **Step 3: Implement `browsing.ts`**

```typescript
const INFERENCE_CONF = 0.5;

export type PageView = { path: string; title: string; visits: number; time_seconds: number };
export type BrowsingSession = {
  referrer: string; session_count: number; total_time_seconds: number; page_views: PageView[];
};
export type InferenceSeed = { claim: string; confidence: number; reasoning: string };
export type BrowsingSeed = { notes: string[]; inferred: Record<string, InferenceSeed> };

const hasPath = (s: BrowsingSession, prefix: string) => s.page_views.some((pv) => pv.path.startsWith(prefix));
const visitsTo = (s: BrowsingSession, prefix: string) =>
  s.page_views.filter((pv) => pv.path.startsWith(prefix)).reduce((sum, pv) => sum + pv.visits, 0);
const round4 = (n: number) => Math.round(n * 1e4) / 1e4;

export function behavioralScore(s: BrowsingSession): number {
  let score = 0.0;
  if (hasPath(s, '/contact')) score += 0.35;
  const pricingVisits = visitsTo(s, '/pricing');
  if (pricingVisits) score += Math.min(0.15 + 0.1 * (pricingVisits - 1), 0.35);
  score += Math.min(((s.session_count ?? 1) - 1) * 0.1, 0.2);
  score += Math.min(((s.total_time_seconds ?? 0) / 600) * 0.1, 0.1);
  return round4(Math.min(score, 1.0));
}

export function browsingToSeed(s: BrowsingSession): BrowsingSeed {
  const notes: string[] = [];
  const inferred: Record<string, InferenceSeed> = {};
  for (const pv of s.page_views) {
    const { path } = pv;
    const visits = pv.visits ?? 1;
    if (path.startsWith('/pricing')) {
      const suffix = visits > 1 ? ` ${visits}×` : '';
      notes.push(`Viewed /pricing${suffix} before chatting — price-sensitive / evaluating cost`);
    } else if (path.startsWith('/contact')) {
      notes.push('Visited /contact — high intent, near conversion');
    } else if (path.startsWith('/portfolio/') || path.startsWith('/services/')) {
      const slug = path.replace(/\/$/, '').split('/').pop() ?? '';
      inferred.project_type = {
        claim: `Interested in a ${slug} project`,
        confidence: INFERENCE_CONF,
        reasoning: `Browsed ${path} before chatting`,
      };
      notes.push(`Browsed ${path}`);
    }
  }
  return { notes, inferred };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- browsing`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/server/agent/browsing.ts src/lib/server/agent/browsing.test.ts
git commit -m "feat: port browsing signals to TS"
```

---

### Task 3: Zod schemas (`schemas.ts`)

**Files:**
- Create: `src/lib/server/agent/schemas.ts`

These mirror the Pydantic models in `graph.py:29-93`. Used with `withStructuredOutput(schema, { method: "json_mode" })`.

- [ ] **Step 1: Implement `schemas.ts`**

```typescript
import { z } from 'zod';

export const InferenceSchema = z.object({
  claim: z.string(),
  confidence: z.number().gt(0).lte(1),
  reasoning: z.string(),
});

// graph.py:64 TurnAnalysis
export const TurnAnalysisSchema = z.object({
  name: z.string().nullable().default(null),
  email: z.string().nullable().default(null),
  project_type: z.string().nullable().default(null),
  goal: z.string().nullable().default(null),
  urgency: z.string().nullable().default(null),
  extraction_quality: z.enum(['good', 'poor']).default('good'),
  inferred_project_type: InferenceSchema.nullable().default(null),
  inferred_goal: InferenceSchema.nullable().default(null),
  inferred_urgency: InferenceSchema.nullable().default(null),
  inferred_notes: z.array(InferenceSchema).default([]),
  intents: z.array(z.enum(['question', 'intake'])).default([]),
});
export type TurnAnalysis = z.infer<typeof TurnAnalysisSchema>;

export const GradeSchema = z.object({ score: z.enum(['good', 'poor']) });
export const DocGradeSchema = z.object({ score: z.enum(['relevant', 'irrelevant']) });
export const AnswerGradeSchema = z.object({ score: z.enum(['grounded', 'hallucination']) });
export const RecommendationSchema = z.object({
  action: z.enum(['portfolio', 'contact', 'newsletter']),
  message: z.string(),
});

export type Profile = {
  name: string | null; email: string | null; project_type: string | null;
  goal: string | null; urgency: string | null; notes: string[];
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors from `schemas.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/server/agent/schemas.ts
git commit -m "feat: add Zod structured-output schemas"
```

---

### Task 4: LLM + embeddings factory (`llm.ts`)

**Files:**
- Create: `src/lib/server/agent/llm.ts`

- [ ] **Step 1: Implement `llm.ts`**

```typescript
import { ChatGroq } from '@langchain/groq';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { env } from '$env/dynamic/private';

export const MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';
export const EMBED_MODEL = 'text-embedding-004'; // Gemini; keep identical at build + query time

export function makeLlm(): ChatGroq {
  return new ChatGroq({ model: MODEL, apiKey: env.GROQ_API_KEY, temperature: 0 });
}

export function makeEmbeddings(): GoogleGenerativeAIEmbeddings {
  return new GoogleGenerativeAIEmbeddings({ model: EMBED_MODEL, apiKey: env.GOOGLE_API_KEY });
}
```

> `scripts/embed-docs.ts` runs outside SvelteKit, so it reads `process.env` instead of `$env/dynamic/private` (see Task 5). `EMBED_MODEL` must match between this file and the script.

- [ ] **Step 2: Commit**

```bash
git add src/lib/server/agent/llm.ts
git commit -m "feat: add Groq + Gemini factory"
```

---

### Task 5: Build-time embedding + runtime retriever

**Files:**
- Create: `scripts/embed-docs.ts`
- Create: `src/lib/server/agent/retriever.ts`
- Test: `src/lib/server/agent/retriever.test.ts`

Port of `vectorstore.py`. Chunking: `RecursiveCharacterTextSplitter` chunkSize 500, overlap 50. Retrieval k=3.

- [ ] **Step 1: Implement `scripts/embed-docs.ts`**

```typescript
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

const DATA_DIR = 'data';
const OUT = 'static/rag-vectors.json';
const EMBED_MODEL = 'text-embedding-004'; // MUST match llm.ts EMBED_MODEL

async function main() {
  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith('.txt'));
  const docs = files.map((f) => readFileSync(join(DATA_DIR, f), 'utf-8'));

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
  const chunks = (await splitter.createDocuments(docs)).map((d) => d.pageContent);

  const embedder = new GoogleGenerativeAIEmbeddings({ model: EMBED_MODEL, apiKey: process.env.GOOGLE_API_KEY });
  const vectors = await embedder.embedDocuments(chunks);

  writeFileSync(OUT, JSON.stringify({ model: EMBED_MODEL, chunks, vectors }));
  console.log(`Embedded ${chunks.length} chunks → ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Generate the vectors**

```bash
GOOGLE_API_KEY=<your key> npm run embed-docs
ls -la static/rag-vectors.json   # expect a non-empty JSON file
```

- [ ] **Step 3: Write the failing retriever test**

```typescript
import { describe, it, expect } from 'vitest';
import { loadRetriever } from './retriever';

describe('loadRetriever', () => {
  it('returns the k most similar chunks for a query', async () => {
    const retriever = await loadRetriever();
    const docs = await retriever('what services do you offer', 3);
    expect(docs.length).toBeGreaterThan(0);
    expect(docs.length).toBeLessThanOrEqual(3);
    expect(typeof docs[0]).toBe('string');
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npm test -- retriever`
Expected: FAIL — cannot find module './retriever'.

- [ ] **Step 5: Implement `retriever.ts`**

```typescript
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from '@langchain/core/documents';
import { makeEmbeddings } from './llm';

type RagFile = { model: string; chunks: string[]; vectors: number[][] };

let storePromise: Promise<MemoryVectorStore> | null = null;

async function buildStore(): Promise<MemoryVectorStore> {
  const path = join(process.cwd(), 'static', 'rag-vectors.json');
  const data = JSON.parse(readFileSync(path, 'utf-8')) as RagFile;
  const store = new MemoryVectorStore(makeEmbeddings());
  // Inject precomputed vectors so we never re-embed the corpus at runtime.
  store.memoryVectors = data.chunks.map((content, i) => ({
    content,
    embedding: data.vectors[i],
    metadata: {},
    id: String(i),
  }));
  return store;
}

/** Returns a query fn: (query, k) => top-k chunk strings. Only the query is embedded. */
export async function loadRetriever() {
  if (!storePromise) storePromise = buildStore();
  const store = await storePromise;
  return async (query: string, k = 3): Promise<string[]> => {
    const results = await store.similaritySearch(query, k);
    return results.map((d: Document) => d.pageContent);
  };
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `GOOGLE_API_KEY=<your key> npm test -- retriever`
Expected: PASS (query embedding hits Gemini; corpus vectors come from JSON).

- [ ] **Step 7: Commit**

```bash
git add scripts/embed-docs.ts src/lib/server/agent/retriever.ts src/lib/server/agent/retriever.test.ts static/rag-vectors.json
git commit -m "feat: build-time embedding + in-memory retriever"
```

---

### Task 6: State annotation (`state.ts`)

**Files:**
- Create: `src/lib/server/agent/state.ts`

Mirror of `AgentState` (`graph.py:42-59`). `messages` uses `messagesStateReducer`; all other channels are last-write-wins (default Annotation, no reducer).

- [ ] **Step 1: Implement `state.ts`**

```typescript
import { Annotation, messagesStateReducer } from '@langchain/langgraph';
import type { BaseMessage } from '@langchain/core/messages';
import type { Profile } from './schemas';
import type { BrowsingSession } from './browsing';

export const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({ reducer: messagesStateReducer, default: () => [] }),
  profile: Annotation<Profile>,
  alert_human: Annotation<boolean>,
  rewritten_query: Annotation<string>,
  retrieved_docs: Annotation<string>,
  pending_message: Annotation<string>,
  retry_counts: Annotation<Record<string, number>>({ reducer: (_a, b) => b, default: () => ({}) }),
  lead_score: Annotation<number>,
  intents: Annotation<string[]>({ reducer: (_a, b) => b, default: () => [] }),
  questions_asked: Annotation<string[]>({ reducer: (_a, b) => b, default: () => [] }),
  browsing: Annotation<BrowsingSession | null>,
  // ephemeral RAG routing signals (overwritten each turn)
  doc_relevance: Annotation<string>,
  answer_grade: Annotation<string>,
  question_grade: Annotation<string>,
  recommendation_action: Annotation<string>,
});

export type AgentStateType = typeof AgentState.State;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors from `state.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/server/agent/state.ts
git commit -m "feat: define agent state annotation"
```

---

### Task 7: Persistence — checkpointer + leads (`persistence.ts`)

**Files:**
- Create: `src/lib/server/agent/persistence.ts`

Replaces `AsyncSqliteSaver` (`api/main.py:42`) and `_write_lead_record` (`graph.py:493-550`).

- [ ] **Step 1: Implement `persistence.ts`**

```typescript
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import pg from 'pg';
import { env } from '$env/dynamic/private';
import type { Profile } from './schemas';

let checkpointerPromise: Promise<PostgresSaver> | null = null;

export function getCheckpointer(): Promise<PostgresSaver> {
  if (!checkpointerPromise) {
    checkpointerPromise = (async () => {
      const saver = PostgresSaver.fromConnString(env.DATABASE_URL);
      await saver.setup(); // idempotent: creates checkpoint tables if absent
      return saver;
    })();
  }
  return checkpointerPromise;
}

const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
let leadsReady: Promise<void> | null = null;

function ensureLeadsTable(): Promise<void> {
  if (!leadsReady) {
    leadsReady = pool
      .query(`CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        score REAL NOT NULL,
        action TEXT NOT NULL,
        profile JSONB NOT NULL,
        signals JSONB NOT NULL,
        notes JSONB NOT NULL
      )`)
      .then(() => undefined);
  }
  return leadsReady;
}

type Msg = { type: string; content: string };

export async function writeLead(
  profile: Profile, score: number, action: string, questionsAsked: string[], messages: Msg[],
): Promise<void> {
  await ensureLeadsTable();

  const filledFields = (['project_type', 'goal', 'urgency', 'email'] as const).filter((f) => profile[f]);
  const allText = messages.filter((m) => m.type === 'human').map((m) => m.content.toLowerCase()).join(' ');
  const askedPricing = questionsAsked.some((q) =>
    ['how much', 'pricing', 'cost', 'price', 'rate'].some((kw) => q.toLowerCase().includes(kw)));
  const urgencyDetected = ['asap', 'deadline', 'urgent', 'as soon as', 'need it'].some((kw) => allText.includes(kw));

  const signals = {
    filled_fields: filledFields,
    asked_pricing: askedPricing,
    urgency_detected: urgencyDetected,
    turns_engaged: messages.length,
  };

  await pool.query(
    `INSERT INTO leads (score, action, profile, signals, notes) VALUES ($1, $2, $3, $4, $5)`,
    [score, action, JSON.stringify(profile), JSON.stringify(signals), JSON.stringify(profile.notes ?? [])],
  );
}
```

- [ ] **Step 2: Verify connection + setup against Neon**

```bash
node --input-type=module -e "import('@langchain/langgraph-checkpoint-postgres').then(async ({PostgresSaver}) => { const s = PostgresSaver.fromConnString(process.env.DATABASE_URL); await s.setup(); console.log('checkpoint tables OK'); process.exit(0); })"
```
Run with `DATABASE_URL=<neon pooled url>` exported.
Expected: prints `checkpoint tables OK`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/server/agent/persistence.ts
git commit -m "feat: Postgres checkpointer + leads persistence"
```

---

### Task 8: Graph nodes — turn analysis & intake (`graph.ts` part 1)

**Files:**
- Create: `src/lib/server/agent/graph.ts`

This task ports the helpers + first nodes. Port prompts **verbatim** from the cited lines. Use a module-scoped `llm` and `retrieve` passed into `buildGraph`.

- [ ] **Step 1: Scaffold `graph.ts` with helpers**

```typescript
import { StateGraph, START, END } from '@langchain/langgraph';
import { AIMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import type { ChatGroq } from '@langchain/groq';
import { AgentState, type AgentStateType } from './state';
import { SCORE_THRESHOLD, computeLeadScore } from './scoring';
import { behavioralScore } from './browsing';
import { writeLead } from './persistence';
import {
  TurnAnalysisSchema, GradeSchema, DocGradeSchema, AnswerGradeSchema, RecommendationSchema,
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
```

- [ ] **Step 2: Add `generateIntakeQuestion` helper**

Port `_generate_intake_question` (`graph.py:139-199`). Copy the system prompt verbatim from `graph.py:171-184` and the `target_instructions` map verbatim from `graph.py:159-164`.

```typescript
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
    // VERBATIM from graph.py:159-164
    project_type: 'Ask what kind of project or website they want to build.',
    goal: 'Ask what outcome or result they want to achieve with this project.',
    urgency: 'Ask about their timeline — when do they need this done?',
    email: 'Ask for the best email address to reach them, framing it as wanting to follow up personally.',
  };

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', `<<COPY graph.py:171-184 SYSTEM PROMPT VERBATIM>>`],
    ['human', 'Generate the next message.'],
  ]);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({
    profile: JSON.stringify(profile), notes: JSON.stringify(notes),
    conversation: conversation(state.messages), target_instruction: targetInstructions[target],
  });
}
```

> The `<<COPY ...>>` marker is an instruction to paste exact text from the cited Python lines, preserving the `{profile}`, `{notes}`, `{conversation}`, `{target_instruction}` template variables. Do not reword.

- [ ] **Step 3: Add `processTurn` node**

Port `process_turn` (`graph.py:201-276`). Copy the system+human prompts verbatim from `graph.py:214-246`.

```typescript
function makeProcessTurn(llm: ChatGroq) {
  const structured = llm.withStructuredOutput(TurnAnalysisSchema, { method: 'json_mode', name: 'TurnAnalysis' });
  return async (state: AgentStateType) => {
    const profile = state.profile ?? ({} as Profile);
    const questionsAsked = [...(state.questions_asked ?? [])];
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `<<COPY graph.py:214-240 SYSTEM PROMPT VERBATIM>>`],
      ['human', `<<COPY graph.py:243-244 HUMAN PROMPT VERBATIM>>`],
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
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors (nodes not yet wired — that's fine).

- [ ] **Step 5: Commit**

```bash
git add src/lib/server/agent/graph.ts
git commit -m "feat: port process_turn + intake helpers"
```

---

### Task 9: Graph nodes — ask/validate + RAG (`graph.ts` part 2)

**Files:**
- Modify: `src/lib/server/agent/graph.ts`

Port `ask`, `validate_question`, `rewrite_query`, `fetch_docs`, `grade_docs`, `answer`, `verify_answer`, `compose_response`. Copy all prompts verbatim from the cited lines.

- [ ] **Step 1: Add the ask/validate nodes**

Port `ask` (`graph.py:280-284`) and `validate_question` (`graph.py:286-325`); prompt verbatim from `graph.py:304-312`.

```typescript
function makeAsk(llm: ChatGroq) {
  return async (state: AgentStateType) => {
    const counts = { ...(state.retry_counts ?? {}) };
    counts.ask = (counts.ask ?? 0) + 1;
    const question = await generateIntakeQuestion(state, llm);
    return { pending_message: question, retry_counts: counts };
  };
}

function makeValidateQuestion(llm: ChatGroq) {
  const structured = llm.withStructuredOutput(GradeSchema, { method: 'json_mode', name: 'Grade' });
  return async (state: AgentStateType) => {
    const question = state.pending_message ?? '';
    const counts = state.retry_counts ?? {};
    if ((counts.ask ?? 0) >= 2) {
      return { question_grade: 'good', messages: [new AIMessage(question)] };
    }
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `<<COPY graph.py:304-312 SYSTEM PROMPT VERBATIM>>`],
      ['human', 'Grade this question.'],
    ]);
    const result = await prompt.pipe(structured).invoke({
      question, conversation: conversation(state.messages), profile: JSON.stringify(state.profile ?? {}),
    });
    if (result.score === 'good') return { question_grade: 'good', messages: [new AIMessage(question)] };
    return { question_grade: 'poor' };
  };
}
```

- [ ] **Step 2: Add the RAG nodes (rewrite/fetch/grade/answer/verify)**

Port `rewrite_query` (`graph.py:327-348`, prompt at :337), `fetch_docs` (:350-353, k=3), `grade_docs` (:355-373, prompt :362-367), `answer` (:375-401, fallback string at :382, prompt :390), `verify_answer` (:403-448, prompt :421-425).

```typescript
function makeRewriteQuery(llm: ChatGroq) {
  return async (state: AgentStateType) => {
    const counts = { ...(state.retry_counts ?? {}) };
    counts.rewrite_query = (counts.rewrite_query ?? 0) + 1;
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `<<COPY graph.py:337 SYSTEM PROMPT VERBATIM>>`],
      ['human', '{question}'],
    ]);
    const rewritten = await prompt.pipe(llm).pipe(new StringOutputParser()).invoke({
      question: state.messages.at(-1)!.content, profile: JSON.stringify(state.profile ?? {}),
    });
    return { rewritten_query: rewritten, retry_counts: counts };
  };
}

function makeFetchDocs(retrieve: Deps['retrieve']) {
  return async (state: AgentStateType) => {
    const query = state.rewritten_query || String(state.messages.at(-1)!.content);
    const docs = await retrieve(query, 3);
    return { retrieved_docs: docs.join('\n\n') };
  };
}

function makeGradeDocs(llm: ChatGroq) {
  const structured = llm.withStructuredOutput(DocGradeSchema, { method: 'json_mode', name: 'DocGrade' });
  return async (state: AgentStateType) => {
    const query = state.rewritten_query || String(state.messages.at(-1)!.content);
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `<<COPY graph.py:362-367 SYSTEM PROMPT VERBATIM>>`],
      ['human', 'Grade the documents.'],
    ]);
    const result = await prompt.pipe(structured).invoke({ query, docs: state.retrieved_docs ?? '' });
    return { doc_relevance: result.score };
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
      ['system', `<<COPY graph.py:390 SYSTEM PROMPT VERBATIM>>`],
      ['human', '{question}'],
    ]);
    const response = await prompt.pipe(llm).pipe(new StringOutputParser()).invoke({
      question: state.messages.at(-1)!.content, docs, profile: JSON.stringify(state.profile ?? {}),
    });
    return { pending_message: response, retry_counts: counts };
  };
}

function makeVerifyAnswer(llm: ChatGroq) {
  const structured = llm.withStructuredOutput(AnswerGradeSchema, { method: 'json_mode', name: 'AnswerGrade' });
  return async (state: AgentStateType) => {
    const answer = state.pending_message ?? '';
    const counts = state.retry_counts ?? {};
    const docs = state.retrieved_docs ?? '';
    if (!docs) {
      return { answer_grade: 'grounded', pending_message: NO_DOCS_FALLBACK, messages: [new AIMessage(NO_DOCS_FALLBACK)] };
    }
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `<<COPY graph.py:421-425 SYSTEM PROMPT VERBATIM>>`],
      ['human', 'Grade the answer.'],
    ]);
    const result = await prompt.pipe(structured).invoke({ docs, answer });
    if (result.score === 'grounded') return { answer_grade: 'grounded', messages: [new AIMessage(answer)] };
    if ((counts.answer ?? 0) >= 2) {
      return { answer_grade: 'grounded', pending_message: NO_DOCS_FALLBACK, messages: [new AIMessage(NO_DOCS_FALLBACK)] };
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
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/server/agent/graph.ts
git commit -m "feat: port ask/validate + RAG nodes"
```

---

### Task 10: recommend node, routers, and `buildGraph` (`graph.ts` part 3)

**Files:**
- Modify: `src/lib/server/agent/graph.ts`

Port `recommend` (`graph.py:456-491`, prompt :467-476), the four routers (`graph.py:554-602`), and the graph wiring (`graph.py:606-641`).

- [ ] **Step 1: Add the `recommend` node**

```typescript
function makeRecommend(llm: ChatGroq) {
  const structured = llm.withStructuredOutput(RecommendationSchema, { method: 'json_mode', name: 'Recommendation' });
  return async (state: AgentStateType) => {
    const profile = state.profile ?? ({} as Profile);
    const score = state.lead_score ?? 0.0;
    const questionsAsked = state.questions_asked ?? [];
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `<<COPY graph.py:467-476 SYSTEM PROMPT VERBATIM>>`],
      ['human', 'Generate the recommendation.'],
    ]);
    const result = await prompt.pipe(structured).invoke({ profile: JSON.stringify(profile) });
    const msgs = state.messages.map((m) => ({ type: m.getType(), content: String(m.content) }));
    await writeLead(profile, score, result.action, questionsAsked, msgs);
    return { alert_human: true, recommendation_action: result.action, messages: [new AIMessage(result.message)] };
  };
}
```

- [ ] **Step 2: Add the routers**

Port verbatim logic from `graph.py:554-602`.

```typescript
function routeAfterProcessTurn(state: AgentStateType): 'recommend' | 'ask' | 'fetch_docs' | 'compose_fetch' {
  const profile = state.profile ?? ({} as Profile);
  const score = state.lead_score ?? 0.0;
  const intents = state.intents ?? [];
  if (score >= SCORE_THRESHOLD) return profile.email ? 'recommend' : 'ask';
  if (intents.includes('question') && intents.includes('intake')) return 'compose_fetch';
  if (intents.includes('question')) return 'fetch_docs';
  return 'ask';
}

function routeAfterValidate(state: AgentStateType): 'ask' | '__end__' {
  const counts = state.retry_counts ?? {};
  if (state.question_grade === 'good') return '__end__';
  if ((counts.ask ?? 0) >= 2) return '__end__';
  return 'ask';
}

function routeAfterGradeDocs(state: AgentStateType): 'answer' | 'rewrite_query' {
  const counts = state.retry_counts ?? {};
  if (state.doc_relevance === 'irrelevant' && (counts.rewrite_query ?? 0) < 2) return 'rewrite_query';
  return 'answer';
}

function routeAfterVerify(state: AgentStateType): 'answer' | 'compose_response' | '__end__' {
  if (state.answer_grade === 'hallucination') return 'answer';
  if ((state.intents ?? []).includes('intake')) return 'compose_response';
  return '__end__';
}
```

- [ ] **Step 3: Add `buildGraph` and compile**

Mirror `graph.py:606-641`. Note `compose_fetch` maps to `fetch_docs` (multi-intent: RAG first).

```typescript
export function buildGraph({ llm, retrieve }: Deps, checkpointer: unknown) {
  const builder = new StateGraph(AgentState)
    .addNode('process_turn', makeProcessTurn(llm))
    .addNode('ask', makeAsk(llm))
    .addNode('validate_question', makeValidateQuestion(llm))
    .addNode('rewrite_query', makeRewriteQuery(llm))
    .addNode('fetch_docs', makeFetchDocs(retrieve))
    .addNode('grade_docs', makeGradeDocs(llm))
    .addNode('answer', makeAnswer(llm))
    .addNode('verify_answer', makeVerifyAnswer(llm))
    .addNode('compose_response', makeComposeResponse(llm))
    .addNode('recommend', makeRecommend(llm))
    .addEdge(START, 'process_turn')
    .addConditionalEdges('process_turn', routeAfterProcessTurn, {
      recommend: 'recommend', ask: 'ask', fetch_docs: 'fetch_docs', compose_fetch: 'fetch_docs',
    })
    .addEdge('ask', 'validate_question')
    .addConditionalEdges('validate_question', routeAfterValidate, { ask: 'ask', __end__: END })
    .addEdge('rewrite_query', 'fetch_docs')
    .addEdge('fetch_docs', 'grade_docs')
    .addConditionalEdges('grade_docs', routeAfterGradeDocs, { answer: 'answer', rewrite_query: 'rewrite_query' })
    .addEdge('answer', 'verify_answer')
    .addConditionalEdges('verify_answer', routeAfterVerify, { answer: 'answer', compose_response: 'compose_response', __end__: END })
    .addEdge('compose_response', END)
    .addEdge('recommend', END);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return builder.compile({ checkpointer: checkpointer as any });
}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/server/agent/graph.ts
git commit -m "feat: port recommend node, routers, and graph wiring"
```

---

### Task 11: Agent singleton + API routes

**Files:**
- Create: `src/lib/server/agent/index.ts`
- Create: `src/routes/api/chat/+server.ts`
- Create: `src/routes/api/analytics/+server.ts`
- Create: `src/routes/api/greeting/+server.ts`

- [ ] **Step 1: Implement `index.ts` (lazy singleton)**

```typescript
import { makeLlm } from './llm';
import { loadRetriever } from './retriever';
import { getCheckpointer } from './persistence';
import { buildGraph } from './graph';

let agentPromise: ReturnType<typeof build> | null = null;

async function build() {
  const [retrieve, checkpointer] = await Promise.all([loadRetriever(), getCheckpointer()]);
  const llm = makeLlm();
  return { graph: buildGraph({ llm, retrieve }, checkpointer), llm };
}

export function getAgent() {
  if (!agentPromise) agentPromise = build();
  return agentPromise;
}
```

- [ ] **Step 2: Implement `/api/chat` (non-streaming first, TDD-friendly)**

Port `chat` (`api/main.py:81-99`). `escalate` = `alert_human`.

```typescript
import { json, error } from '@sveltejs/kit';
import { HumanMessage } from '@langchain/core/messages';
import { randomUUID } from 'node:crypto';
import { getAgent } from '$lib/server/agent';
import type { RequestHandler } from './$types';

export const config = { maxDuration: 60 };

export const POST: RequestHandler = async ({ request }) => {
  const { message, session_id } = await request.json();
  const sessionId = session_id || randomUUID();
  const { graph } = await getAgent();
  const cfg = { configurable: { thread_id: sessionId } };

  let result;
  try {
    result = await graph.invoke({ messages: [new HumanMessage(message)] }, cfg);
  } catch (e) {
    throw error(502, `agent error: ${(e as Error).name}`);
  }

  const messages = result.messages ?? [];
  const lastAi = [...messages].reverse().find((m) => m.getType() === 'ai');
  return json({
    session_id: sessionId,
    reply: lastAi ? String(lastAi.content) : '',
    escalate: Boolean(result.alert_human),
  });
};
```

- [ ] **Step 3: Implement `/api/analytics`**

Port `analytics` (`api/main.py:107-125`). Seeds browsing + an inferred profile via `updateState`.

```typescript
import { json } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { getAgent } from '$lib/server/agent';
import { browsingToSeed } from '$lib/server/agent/browsing';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { browsing, session_id } = await request.json();
  const sessionId = session_id || randomUUID();
  const { graph } = await getAgent();
  const cfg = { configurable: { thread_id: sessionId } };

  const seed = browsingToSeed(browsing);
  const seededProfile = {
    name: null, email: null, project_type: null, goal: null, urgency: null, notes: [...seed.notes],
  };
  await graph.updateState(cfg, { browsing, profile: seededProfile });
  return json({ session_id: sessionId });
};
```

- [ ] **Step 4: Implement `/api/greeting`**

Port `greeting` + `personalized_opening` (`api/main.py:128-178`). Copy the opening-line prompt verbatim from `api/main.py:137-141`. Default greeting string from `api/main.py:29-31`.

```typescript
import { json } from '@sveltejs/kit';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getAgent } from '$lib/server/agent';
import type { RequestHandler } from './$types';

const DEFAULT_GREETING = "Welcome to BuildSynergy. I'm here to help you with any enquiries you may have.";

export const POST: RequestHandler = async ({ request }) => {
  const { session_id, browsing } = await request.json();
  const { graph, llm } = await getAgent();

  let projectType: string | null = null;
  if (session_id) {
    const snap = await graph.getState({ configurable: { thread_id: session_id } });
    projectType = snap.values?.profile?.project_type ?? null;
  }
  if (projectType) {
    return json({ greeting: `Welcome back. Last time we were discussing ${projectType}. Ready to pick up where we left off?` });
  }
  if (browsing) {
    const pages = browsing.page_views.map((pv: { title: string; path: string }) => `${pv.title} (${pv.path})`).join(', ');
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `<<COPY api/main.py:137-141 SYSTEM PROMPT VERBATIM>>`],
      ['human', 'Write the opening line.'],
    ]);
    const opening = await prompt.pipe(llm).pipe(new StringOutputParser()).invoke({ pages });
    return json({ greeting: opening });
  }
  return json({ greeting: DEFAULT_GREETING });
};
```

- [ ] **Step 5: Smoke-test locally**

```bash
GROQ_API_KEY=... GOOGLE_API_KEY=... DATABASE_URL=... npm run dev
# in another shell:
curl -s localhost:5173/api/greeting -X POST -H 'content-type: application/json' -d '{}'
curl -s localhost:5173/api/chat -X POST -H 'content-type: application/json' -d '{"message":"what services do you offer?"}'
```
Expected: greeting returns the default line; chat returns `{session_id, reply, escalate}` with a non-empty reply grounded in the corpus.

- [ ] **Step 6: Commit**

```bash
git add src/lib/server/agent/index.ts src/routes/api
git commit -m "feat: agent singleton + chat/analytics/greeting routes"
```

---

### Task 12: Streaming, parity check, and deploy

**Files:**
- Modify: `src/routes/api/chat/+server.ts`

- [ ] **Step 1: Stream the reply from `/api/chat`**

Replace the response in `/api/chat` with a token stream of the final AI message. Use the graph's `streamEvents` (v2) and forward `on_chat_model_stream` chunks **only for the final user-facing message** (the last node before END: `compose_response`, `verify_answer`, `recommend`, or `validate_question`). Simplest robust approach: keep `invoke` for routing, then stream the already-decided `reply` text via a `ReadableStream`:

```typescript
  // after computing `reply` as in Task 11:
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(reply));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'x-session-id': sessionId, 'x-escalate': String(Boolean(result.alert_human)) },
  });
```

> True token-by-token streaming of intermediate LLM calls is out of scope (the grading loop must finish before the final text is known). This delivers the reply as a stream so the widget can render progressively; revisit if real token streaming is wanted later.

- [ ] **Step 2: Parity check against q_aBot**

Run the Python app and the SvelteKit app side by side; send the same 3 scripted turns to each and diff behavior:

```bash
# terminal A: cd ~/Projects/q_aBot && uv run uvicorn api.main:app --port 8000  (Ollama running)
# terminal B: npm run dev  (in BuildSynergy-website)
```
For each turn (`"what services do you offer?"`, `"I need an online store, fairly urgent"`, `"my email is x@y.com"`), confirm: same routing behavior (answer vs ask vs recommend), grounded answers, escalate flips true once email + high score reached. Note any divergence; structured-output drift (risk #2) shows up here.

- [ ] **Step 3: Configure Vercel env + deploy**

In the Vercel project settings add `GROQ_API_KEY`, `GOOGLE_API_KEY`, `DATABASE_URL` (Neon **pooled** URL). Ensure `static/rag-vectors.json` is committed. Then:

```bash
git push   # triggers Vercel build on the branch, or:
npx vercel --prod
```
Expected: build succeeds; `POST /api/chat` on the deployed URL returns a grounded reply within the 60s limit.

- [ ] **Step 4: Commit**

```bash
git add src/routes/api/chat/+server.ts
git commit -m "feat: stream chat reply; finalize deploy config"
```

---

## Self-Review notes

- **Spec coverage:** adapter switch (T0), all 10 nodes + 4 routers (T8–10), 3 endpoints (T11), build-time vectors + in-memory retriever (T5), Postgres checkpointer + leads (T7), streaming + maxDuration (T12), parity check (T12). All spec sections mapped.
- **Verbatim prompts:** marked with `<<COPY graph.py:NN VERBATIM>>` rather than re-transcribed, to avoid corrupting tuned prompt text. The Python source stays in the repo as the authority. Each marker cites exact lines.
- **Type consistency:** `Profile` defined in `schemas.ts` and reused in `state.ts`, `graph.ts`, `persistence.ts`. `loadRetriever` returns a `(query, k) => Promise<string[]>` fn, consumed by `makeFetchDocs`. `getAgent()` returns `{ graph, llm }`, consumed by all three routes.
- **Open items from spec:** Gemini `EMBED_MODEL` pinned to `text-embedding-004` in both `llm.ts` and `embed-docs.ts` (must stay in sync); Vercel Pro upgrade deferred (ToS, not technical).
