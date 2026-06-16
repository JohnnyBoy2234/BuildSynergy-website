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
