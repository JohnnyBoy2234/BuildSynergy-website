import { describe, it, expect, beforeEach } from 'vitest';
import { getOrCreateSessionId, loadTranscript, saveTranscript, type ChatMessage } from './session';

// Minimal localStorage stub for the node test environment.
class MemStore {
  private m = new Map<string, string>();
  getItem(k: string) { return this.m.has(k) ? this.m.get(k)! : null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  clear() { this.m.clear(); }
}

beforeEach(() => {
  (globalThis as { localStorage?: unknown }).localStorage = new MemStore();
});

describe('getOrCreateSessionId', () => {
  it('creates an id and reuses it on subsequent calls', () => {
    const a = getOrCreateSessionId();
    const b = getOrCreateSessionId();
    expect(a).toBe(b);
    expect(a).toMatch(/[0-9a-f-]{36}/);
  });
});

describe('transcript persistence', () => {
  it('round-trips messages', () => {
    const msgs: ChatMessage[] = [
      { role: 'assistant', content: 'hi' },
      { role: 'user', content: 'hello' },
    ];
    saveTranscript(msgs);
    expect(loadTranscript()).toEqual(msgs);
  });

  it('returns [] when nothing saved', () => {
    expect(loadTranscript()).toEqual([]);
  });
});
