import { t as getAgent } from "../../../../chunks/agent.js";
import { error, json } from "@sveltejs/kit";
import { randomUUID } from "node:crypto";
import { HumanMessage } from "@langchain/core/messages";
//#region src/routes/api/chat/+server.ts
var config = { maxDuration: 60 };
var POST = async ({ request }) => {
	const { message, session_id } = await request.json();
	const sessionId = session_id || randomUUID();
	const { graph } = await getAgent();
	const cfg = { configurable: { thread_id: sessionId } };
	let result;
	try {
		result = await graph.invoke({ messages: [new HumanMessage(message)] }, cfg);
	} catch (e) {
		throw error(502, `agent error: ${e.name}`);
	}
	const lastAi = [...result.messages ?? []].reverse().find((m) => m.getType() === "ai");
	return json({
		session_id: sessionId,
		reply: lastAi ? String(lastAi.content) : "",
		escalate: Boolean(result.alert_human)
	});
};
//#endregion
export { POST, config };
