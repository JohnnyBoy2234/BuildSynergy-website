import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import { HumanMessage, AIMessage, type BaseMessage } from '@langchain/core/messages';
import pg from 'pg';
import { env } from '$env/dynamic/private';
import type { Profile } from './schemas';
import type { BrowsingSession } from './browsing';

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

// ── Session state (replaces the per-node checkpointer) ───────────────────────

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
