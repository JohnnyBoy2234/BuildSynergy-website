import { t as private_env } from "./shared-server.js";
//#region src/lib/server/leads/format.ts
var esc = (s) => String(s ?? "—").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function table(rows) {
	return `<table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">${rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${esc(k)}</td><td style="padding:4px 0;color:#111;white-space:pre-wrap">${esc(v)}</td></tr>`).join("")}</table>`;
}
function textBlock(rows) {
	return rows.map(([k, v]) => `${k}: ${v ?? "—"}`).join("\n");
}
function chatbotLeadEmail(profile, score, action, transcript) {
	const rows = [
		["Name", profile.name],
		["Email", profile.email],
		["Project type", profile.project_type],
		["Goal", profile.goal],
		["Urgency", profile.urgency],
		["Lead score", score.toFixed(2)],
		["Recommended action", action],
		["Notes", (profile.notes ?? []).join("\n") || "—"]
	];
	return {
		subject: `New chatbot lead — ${profile.email || profile.name || "unknown"} (score ${score.toFixed(2)})`,
		html: `<h2 style="font-family:system-ui,sans-serif">New chatbot lead</h2>${table(rows)}<h3 style="font-family:system-ui,sans-serif;margin-top:20px">Conversation</h3><pre style="font-family:ui-monospace,monospace;font-size:13px;white-space:pre-wrap;background:#f6f6f8;padding:12px;border-radius:8px">${esc(transcript)}</pre>`,
		text: `New chatbot lead\n\n${textBlock(rows)}\n\nConversation:\n${transcript}`
	};
}
function funnelLeadEmail(data) {
	const rows = [
		["Name", data.name],
		["Business", data.businessName],
		["Email", data.email],
		["Phone", data.phone],
		["Service", data.service],
		["Has website", data.hasWebsite === null ? "—" : data.hasWebsite ? `Yes (${data.websiteUrl || "no URL"})` : "No"],
		["Main goal", data.mainGoal],
		["Timeline", data.timeline],
		["Budget", data.budget]
	];
	return {
		subject: `New funnel lead — ${data.name || "unknown"} (${data.businessName || "—"})`,
		html: `<h2 style="font-family:system-ui,sans-serif">New funnel lead</h2>${table(rows)}`,
		text: `New funnel lead\n\n${textBlock(rows)}`
	};
}
//#endregion
//#region src/lib/server/leads/email.ts
var RESEND_ENDPOINT = "https://api.resend.com/emails";
async function sendLeadEmail(email) {
	const apiKey = private_env.RESEND_API_KEY;
	if (!apiKey) throw new Error("RESEND_API_KEY is not set");
	const from = private_env.LEADS_FROM || "BuildSynergy Leads <leads@buildsynergy.co.za>";
	const to = private_env.LEADS_TO || "yoursupport@buildsynergy.co.za";
	const res = await fetch(RESEND_ENDPOINT, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"content-type": "application/json"
		},
		body: JSON.stringify({
			from,
			to,
			subject: email.subject,
			html: email.html,
			text: email.text
		})
	});
	if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
//#endregion
export { chatbotLeadEmail as n, funnelLeadEmail as r, sendLeadEmail as t };
