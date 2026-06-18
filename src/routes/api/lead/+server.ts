import { json, error } from '@sveltejs/kit';
import { sendLeadEmail, funnelLeadEmail } from '$lib/server/leads/email';
import type { FunnelData } from '$lib/components/funnel/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const data = (await request.json()) as FunnelData;
  try {
    await sendLeadEmail(funnelLeadEmail(data));
  } catch (e) {
    throw error(502, `lead delivery failed: ${(e as Error).message}`);
  }
  return json({ ok: true });
};
