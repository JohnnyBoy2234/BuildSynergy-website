// Pure lead-email formatters (no env / no I/O) so they can be unit-tested.

import type { Profile } from '../agent/schemas';
import type { FunnelData } from '$lib/components/funnel/types';

export type Email = { subject: string; html: string; text: string };

const esc = (s: unknown) =>
  String(s ?? '—').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function table(rows: [string, unknown][]): string {
  const trs = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${esc(k)}</td>` +
        `<td style="padding:4px 0;color:#111;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join('');
  return `<table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">${trs}</table>`;
}

function textBlock(rows: [string, unknown][]): string {
  return rows.map(([k, v]) => `${k}: ${v ?? '—'}`).join('\n');
}

export function chatbotLeadEmail(
  profile: Profile,
  score: number,
  action: string,
  transcript: string,
): Email {
  const rows: [string, unknown][] = [
    ['Name', profile.name],
    ['Email', profile.email],
    ['Project type', profile.project_type],
    ['Goal', profile.goal],
    ['Urgency', profile.urgency],
    ['Lead score', score.toFixed(2)],
    ['Recommended action', action],
    ['Notes', (profile.notes ?? []).join('\n') || '—'],
  ];
  const subject = `New chatbot lead — ${profile.email || profile.name || 'unknown'} (score ${score.toFixed(2)})`;
  const html =
    `<h2 style="font-family:system-ui,sans-serif">New chatbot lead</h2>${table(rows)}` +
    `<h3 style="font-family:system-ui,sans-serif;margin-top:20px">Conversation</h3>` +
    `<pre style="font-family:ui-monospace,monospace;font-size:13px;white-space:pre-wrap;background:#f6f6f8;padding:12px;border-radius:8px">${esc(transcript)}</pre>`;
  const text = `New chatbot lead\n\n${textBlock(rows)}\n\nConversation:\n${transcript}`;
  return { subject, html, text };
}

export function funnelLeadEmail(data: FunnelData): Email {
  const rows: [string, unknown][] = [
    ['Name', data.name],
    ['Business', data.businessName],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Service', data.service],
    ['Has website', data.hasWebsite === null ? '—' : data.hasWebsite ? `Yes (${data.websiteUrl || 'no URL'})` : 'No'],
    ['Main goal', data.mainGoal],
    ['Timeline', data.timeline],
    ['Budget', data.budget],
  ];
  const subject = `New funnel lead — ${data.name || 'unknown'} (${data.businessName || '—'})`;
  const html = `<h2 style="font-family:system-ui,sans-serif">New funnel lead</h2>${table(rows)}`;
  const text = `New funnel lead\n\n${textBlock(rows)}`;
  return { subject, html, text };
}
