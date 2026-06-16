import { json, error } from '@sveltejs/kit';
import { HumanMessage } from '@langchain/core/messages';
import { randomUUID } from 'node:crypto';
import { getAgent } from '$lib/server/agent';
import type { RequestHandler } from './$types';

export const config = { maxDuration: 60 };

export const POST: RequestHandler = async ({ request }) => {
  const { message, session_id } = await request.json();
  const sessionId = session_id || randomUUID();
  const { graph } = await getAgent();
  const cfg = { configurable: { thread_id: sessionId } };

  let result;
  try {
    result = await graph.invoke({ messages: [new HumanMessage(message)] }, cfg);
  } catch (e) {
    throw error(502, `agent error: ${(e as Error).name}`);
  }

  const messages = result.messages ?? [];
  const lastAi = [...messages].reverse().find((m) => m.getType() === 'ai');
  return json({
    session_id: sessionId,
    reply: lastAi ? String(lastAi.content) : '',
    escalate: Boolean(result.alert_human),
  });
};
