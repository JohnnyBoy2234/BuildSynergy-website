// Lead delivery via Resend's REST API (no SDK dependency). Sender/recipient are
// env-configurable. Pure formatters live in ./format (and are re-exported here so
// callers have a single import site).

import { env } from '$env/dynamic/private';
import type { Email } from './format';

export { chatbotLeadEmail, funnelLeadEmail } from './format';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export async function sendLeadEmail(email: Email): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  const from = env.LEADS_FROM || 'BuildSynergy Leads <leads@buildsynergy.co.za>';
  const to = env.LEADS_TO || 'yoursupport@buildsynergy.co.za';

  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to, subject: email.subject, html: email.html, text: email.text }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
