import { t as getAgent } from "../../../../chunks/agent.js";
import { json } from "@sveltejs/kit";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
//#region src/routes/api/greeting/+server.ts
var DEFAULT_GREETING = "Welcome to BuildSynergy. I'm here to help you with any enquiries you may have.";
var POST = async ({ request }) => {
	const { session_id, browsing } = await request.json();
	const { graph, llm } = await getAgent();
	let projectType = null;
	if (session_id) projectType = (await graph.getState({ configurable: { thread_id: session_id } })).values?.profile?.project_type ?? null;
	if (projectType) return json({ greeting: `Welcome back. Last time we were discussing ${projectType}. Ready to pick up where we left off?` });
	if (browsing) {
		const pages = browsing.page_views.map((pv) => `${pv.title} (${pv.path})`).join(", ");
		return json({ greeting: await ChatPromptTemplate.fromMessages([["system", `You are the BuildSynergy assistant greeting a website visitor who just opened the chat.
You can see which pages they browsed before chatting: {pages}.
Write ONE warm, natural opening line (max two sentences) that subtly references what they looked at and invites them to talk specifics.
Do not list the pages mechanically. Do not ask more than one question. Never sound like a form.`], ["human", "Write the opening line."]]).pipe(llm).pipe(new StringOutputParser()).invoke({ pages }) });
	}
	return json({ greeting: DEFAULT_GREETING });
};
//#endregion
export { POST };
