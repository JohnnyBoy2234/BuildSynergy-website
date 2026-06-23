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

export function analytics(sessionId: string, browsing: BrowsingSession): Promise<{ session_id: string }> {
  return postJson('/api/analytics', { session_id: sessionId, browsing });
}

export function greeting(sessionId: string, browsing: BrowsingSession): Promise<{ greeting: string }> {
  return postJson('/api/greeting', { session_id: sessionId, browsing });
}

export function chat(
  sessionId: string,
  message: string,
): Promise<{ session_id: string; reply: string; escalate: boolean }> {
  return postJson('/api/chat', { session_id: sessionId, message });
}
