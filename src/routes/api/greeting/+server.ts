import { json } from '@sveltejs/kit';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getAgent } from '$lib/server/agent';
import type { RequestHandler } from './$types';

const DEFAULT_GREETING = "Welcome to BuildSynergy. I'm here to help you with any enquiries you may have.";

export const POST: RequestHandler = async ({ request }) => {
  const { session_id, browsing } = await request.json();
  const { graph, llm } = await getAgent();

  let projectType: string | null = null;
  if (session_id) {
    const snap = await graph.getState({ configurable: { thread_id: session_id } });
    projectType = snap.values?.profile?.project_type ?? null;
  }
  if (projectType) {
    return json({ greeting: `Welcome back. Last time we were discussing ${projectType}. Ready to pick up where we left off?` });
  }
  if (browsing) {
    const pages = browsing.page_views.map((pv: { title: string; path: string }) => `${pv.title} (${pv.path})`).join(', ');
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are the BuildSynergy assistant greeting a website visitor who just opened the chat.
You can see which pages they browsed before chatting: {pages}.
Write ONE warm, natural opening line (max two sentences) that subtly references what they looked at and invites them to talk specifics.
Do not list the pages mechanically. Do not ask more than one question. Never sound like a form.`,
      ],
      ['human', 'Write the opening line.'],
    ]);
    const opening = await prompt.pipe(llm).pipe(new StringOutputParser()).invoke({ pages });
    return json({ greeting: opening });
  }
  return json({ greeting: DEFAULT_GREETING });
};
