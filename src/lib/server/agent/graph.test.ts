import { describe, it, expect, vi } from 'vitest';

// graph.ts pulls in persistence/llm, which read $env at import; the routing fns under
// test don't touch it. Stub so the module loads under vitest.
vi.mock('$env/dynamic/private', () => ({ env: {} }));

import { routeAfterProcessTurn, routeAfterVerify } from './graph';
import { SCORE_THRESHOLD } from './scoring';
import type { AgentStateType } from './state';

const HOT = SCORE_THRESHOLD;
const st = (s: Partial<AgentStateType>) => s as AgentStateType;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const profile = (email: string | null) => ({ email } as any);

describe('routeAfterProcessTurn', () => {
  it('answers a hot no-email lead who asks a question instead of nagging for email', () => {
    expect(routeAfterProcessTurn(st({ lead_score: HOT, profile: profile(null), intents: ['question'] })))
      .toBe('compose_fetch');
  });

  it('still asks a hot no-email lead with no question for their email', () => {
    expect(routeAfterProcessTurn(st({ lead_score: HOT, profile: profile(null), intents: [] }))).toBe('ask');
  });

  it('answers (not recommends) a hot lead with email who asks a question', () => {
    expect(routeAfterProcessTurn(st({ lead_score: HOT, profile: profile('a@b.c'), intents: ['question'] })))
      .toBe('fetch_docs');
  });

  it('recommends a hot lead with email and no live question', () => {
    expect(routeAfterProcessTurn(st({ lead_score: HOT, profile: profile('a@b.c'), intents: [] }))).toBe('recommend');
  });
});

describe('routeAfterVerify', () => {
  it('composes the email ask after answering a hot no-email lead (pure question)', () => {
    expect(routeAfterVerify(st({
      lead_score: HOT, profile: profile(null), intents: ['question'], answer_grade: 'grounded',
    }))).toBe('compose_response');
  });

  it('ends a cold question-only turn after answering', () => {
    expect(routeAfterVerify(st({
      lead_score: 0.2, profile: profile(null), intents: ['question'], answer_grade: 'grounded',
    }))).toBe('__end__');
  });

  it('retries the answer on hallucination', () => {
    expect(routeAfterVerify(st({ lead_score: 0.2, intents: ['question'], answer_grade: 'hallucination' })))
      .toBe('answer');
  });
});
