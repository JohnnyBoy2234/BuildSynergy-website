import { r as funnelLeadEmail, t as sendLeadEmail } from "../../../../chunks/email.js";
import { error, json } from "@sveltejs/kit";
//#region src/routes/api/lead/+server.ts
var POST = async ({ request }) => {
	const data = await request.json();
	try {
		await sendLeadEmail(funnelLeadEmail(data));
	} catch (e) {
		throw error(502, `lead delivery failed: ${e.message}`);
	}
	return json({ ok: true });
};
//#endregion
export { POST };
