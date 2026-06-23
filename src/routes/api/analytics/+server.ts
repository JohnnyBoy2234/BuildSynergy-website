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
