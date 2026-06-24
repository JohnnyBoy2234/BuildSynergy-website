import { HumanMessage } from '@langchain/core/messages';
import { randomUUID } from 'node:crypto';
import { getAgent } from '$lib/server/agent';
import { loadSession, saveSession, rehydrate, slim, type PersistedState } from '$lib/server/agent/persistence';
import type { RequestHandler } from './$types';

export const config = { maxDuration: 60 };

const enc = new TextEncoder();
const frame = (o: unknown) => enc.encode(JSON.stringify(o) + '\n');

export const POST: RequestHandler = async ({ request }) => {
  const { message, session_id } = await request.json();
  const sessionId = session_id || randomUUID();
  const prior = await loadSession(sessionId);
  const { graph } = await getAgent();

  // Seed the channels that carry between turns; ephemerals (retry_counts, retrieved_docs,
  // intents, answer_grade) reset each run. alert_human/recommendation_action are terminal
  // outputs and don't need re-seeding.
  const input = {
    messages: [...rehydrate(prior.messages), new HumanMessage(message)],
    profile: prior.profile ?? undefined,
    questions_asked: prior.questions_asked,
    browsing: prior.browsing,
    lead_score: prior.lead_score,
  };

  const stream = new ReadableStream({
    async start(controller) {
      let streamed = '';
      let started = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let finalState: any = null;
      try {
        // streamMode: ['messages','values'] yields [mode, chunk]; messages = token stream,
        // values = full state snapshots (keep the last for persistence + reconciliation).
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const events = (await graph.stream(input, { streamMode: ['messages', 'values'] })) as any;
        for await (const [mode, chunk] of events) {
          if (mode === 'messages') {
            const [msg, meta] = chunk;
            if (meta?.tags?.includes('final_answer') && msg?.content) {
              streamed += String(msg.content);
              started = true;
              controller.enqueue(frame({ t: 'token', v: String(msg.content) }));
            }
          } else if (mode === 'values') {
            finalState = chunk;
          }
        }

        const slimmed: PersistedState = slim(finalState ?? {});
        const lastAi = [...slimmed.messages].reverse().find((m) => m.type === 'ai');
        const authoritative = lastAi?.content ?? '';
        // The token stream is best-effort; the committed message is the source of truth.
        // If they diverge (compose concatenation, structured recommend, no streamed tokens),
        // reset the bubble and send the authoritative text.
        if (authoritative && authoritative !== streamed) {
          if (started) controller.enqueue(frame({ t: 'reset' }));
          controller.enqueue(frame({ t: 'token', v: authoritative }));
        }

        try {
          await saveSession(sessionId, slimmed);
        } catch (e) {
          console.error('saveSession failed:', (e as Error).message); // reply already delivered
        }
        controller.enqueue(frame({ t: 'done', session_id: sessionId, escalate: slimmed.alert_human }));
      } catch (e) {
        console.error('chat agent error:', e); // full stack to server logs; client gets a clean frame
        controller.enqueue(frame({ t: 'error', name: (e as Error).name }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache' },
  });
};
