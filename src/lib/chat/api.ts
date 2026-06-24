// Typed client for the agent API. Each call returns parsed data or throws.

import type { BrowsingSession } from './browsing';

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return (await res.json()) as T;
}

export function analytics(
  sessionId: string,
  browsing: BrowsingSession,
): Promise<{ session_id: string; messages: { type: 'human' | 'ai'; content: string }[] }> {
  return postJson('/api/analytics', { session_id: sessionId, browsing });
}

type StreamHandlers = {
  onToken: (v: string) => void;
  onReset: () => void;
  onDone: (sessionId: string, escalate: boolean) => void;
  onError: () => void;
};

/** POST a message and dispatch the server's newline-delimited JSON frames. */
export async function chatStream(sessionId: string, message: string, h: StreamHandlers): Promise<void> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, message }),
  });
  if (!res.ok || !res.body) {
    h.onError();
    return;
  }
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
