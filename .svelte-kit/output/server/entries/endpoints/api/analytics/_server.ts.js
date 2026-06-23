import { n as browsingToSeed, t as getAgent } from "../../../../chunks/agent.js";
import { json } from "@sveltejs/kit";
import { randomUUID } from "node:crypto";
//#region src/routes/api/analytics/+server.ts
var POST = async ({ request }) => {
	const { browsing, session_id } = await request.json();
	const sessionId = session_id || randomUUID();
	const { graph } = await getAgent();
	const cfg = { configurable: { thread_id: sessionId } };
	const seededProfile = {
		name: null,
		email: null,
		project_type: null,
		goal: null,
		urgency: null,
		notes: [...browsingToSeed(browsing).notes]
	};
	await graph.updateState(cfg, {
		browsing,
		profile: seededProfile
	});
	return json({ session_id: sessionId });
};
//#endregion
export { POST };
