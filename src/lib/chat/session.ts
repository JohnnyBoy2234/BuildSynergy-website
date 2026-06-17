// session_id + transcript persistence in localStorage.

export type ChatMessage = { role: 'user' | 'assistant' | 'error'; content: string };

const SID_KEY = 'bs_session_id';
const TX_KEY = 'bs_transcript';

const hasStore = () => typeof localStorage !== 'undefined';

export function getOrCreateSessionId(): string {
  if (!hasStore()) return crypto.randomUUID();
  const existing = localStorage.getItem(SID_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(SID_KEY, id);
  return id;
}

export function loadTranscript(): ChatMessage[] {
  if (!hasStore()) return [];
  const raw = localStorage.getItem(TX_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

export function saveTranscript(messages: ChatMessage[]): void {
  if (hasStore()) localStorage.setItem(TX_KEY, JSON.stringify(messages));
}
