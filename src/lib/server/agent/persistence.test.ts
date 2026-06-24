import { describe, it, expect, vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({ env: {} }));

import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { slim, rehydrate, blankState } from './persistence';

describe('slim/rehydrate round-trip', () => {
  it('preserves message roles and content', () => {
    const final = {
      messages: [new HumanMessage('hi'), new AIMessage('hello')],
      profile: { email: 'a@b.c' }, lead_score: 0.7,
    };
    const s = slim(final);
    expect(s.messages).toEqual([
      { type: 'human', content: 'hi' },
      { type: 'ai', content: 'hello' },
    ]);
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
