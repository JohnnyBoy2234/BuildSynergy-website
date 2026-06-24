import { json } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { browsingToSeed } from '$lib/server/agent/browsing';
import { loadSession, saveSession } from '$lib/server/agent/persistence';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { browsing, session_id } = await request.json();
  const sessionId = session_id || randomUUID();
  const prior = await loadSession(sessionId);
  const seed = browsingToSeed(browsing);
  // Only seed a profile when none exists — never clobber one extracted from chat.
  const profile = prior.profile ?? {
    name: null, email: null, project_type: null, goal: null, urgency: null, notes: [...seed.notes],
  };
  await saveSession(sessionId, { ...prior, browsing, profile });
  // Return the persisted thread so the client can resume server-authoritatively.
  return json({ session_id: sessionId, messages: prior.messages });
};
