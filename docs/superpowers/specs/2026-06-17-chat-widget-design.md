# Design: BuildSynergy chat widget

**Date:** 2026-06-17
**Status:** Approved
**Branch:** `chat-widget`
**Depends on:** the deployed agent API (`/api/chat`, `/api/analytics`, `/api/greeting`) — already built and live-verified.

## Goal

A floating chat widget on the BuildSynergy site that talks to the LangGraph.js
agent, feeds it real browsing behavior, and persists the conversation across
reloads. Additive — the existing multi-step `LeadFunnel` is left untouched; the
widget is a second, independent lead path.

## Decisions (locked)

| Area | Decision |
|---|---|
| Scope | Global floating launcher (bottom-right) on every page via root layout. |
| Browsing data | **Full page-view tracking** — record path/title/time/visits across the visit; feed `/api/analytics` + `/api/greeting`. |
| LeadFunnel | Unchanged; widget is additive. |
| Transcript | **Persisted** in localStorage (keyed by session_id); restored on reopen/reload. |
| Streaming | None — clean JSON; a "typing" indicator covers latency. |
| Styling | Match existing tokens (deep navy glass, indigo→violet gradient, Space Grotesk/Inter, GSAP micro-anims, reduced-motion). |

## Architecture

### Files

```
src/lib/chat/
├─ api.ts        typed client: chat(), analytics(), greeting()
├─ browsing.ts   page-view tracker → BrowsingSession in localStorage (pure)
└─ session.ts    session_id + transcript persistence in localStorage (pure)
src/lib/components/
├─ ChatWidget.svelte          launcher + panel + orchestration
└─ chat/
   ├─ MessageList.svelte      message bubbles + typing indicator (presentational)
   └─ ChatInput.svelte        textarea + send (presentational)
src/routes/+layout.svelte     mount <ChatWidget/> + start browsing tracker (global)
```

Unit-testable pure modules (`browsing.ts`, `session.ts`) are separated from the
Svelte components so logic can be verified without a DOM.

### Types (mirror the agent's API contracts)

- `BrowsingSession` = `{ referrer, session_count, total_time_seconds, page_views: PageView[] }`,
  `PageView` = `{ path, title, visits, time_seconds }` — identical shape to the
  backend's `browsing.ts`.
- `ChatMessage` = `{ role: 'user' | 'assistant' | 'error', content: string }`.

### browsing.ts (tracker)

- On each navigation: flush accumulated time onto the previous page view, then
  upsert the current page (increment `visits`, set title). Persist the whole
  `BrowsingSession` to localStorage.
- `session_count`: incremented once per browser session (sessionStorage flag),
  `total_time_seconds`: running sum, `referrer`: `document.referrer` on first load.
- Exposes `recordPageView(path, title)`, `accumulateTime()`, `getBrowsing()`.

### session.ts

- `getOrCreateSessionId()`: returns persisted `session_id` (localStorage) or a new
  `crypto.randomUUID()`.
- `loadTranscript(id)` / `saveTranscript(id, messages)`: persist `ChatMessage[]`.

### api.ts

- `analytics(sessionId, browsing)` → `POST /api/analytics`.
- `greeting(sessionId, browsing)` → `POST /api/greeting` → `{ greeting }`.
- `chat(sessionId, message)` → `POST /api/chat` → `{ session_id, reply, escalate }`.
- Each returns typed data or throws; the widget renders errors.

### ChatWidget.svelte (orchestration + state)

State (`$state`): `open`, `messages: ChatMessage[]`, `sending`, `escalated`, `greeted`.
- **Mount:** load persisted `session_id` + transcript; if a transcript exists,
  `greeted = true`.
- **First open** (no greeting yet): `analytics()` then `greeting()`; render the
  greeting as the first assistant message; set `greeted`.
- **Send:** push user message (optimistic) + save; set `sending` (typing dots);
  `chat()`; push reply; if `escalate`, append a subtle system line "I've flagged
  this for the team — they'll follow up." Save transcript after each change.
- **Reopen:** restores from state/localStorage; no re-greeting.

## Data flow

```
navigation ──► browsing.ts (localStorage BrowsingSession)
first open ──► getOrCreateSessionId
           ──► POST /api/analytics {session_id, browsing}
           ──► POST /api/greeting  {session_id, browsing} ──► greeting bubble
send       ──► optimistic user bubble + typing
           ──► POST /api/chat {session_id, message} ──► reply bubble (+escalate note)
every change ─► saveTranscript(session_id, messages)
```

## Error handling

- Any API throw → an `error`-role bubble ("Something went wrong — try again?")
  without losing the typed message; user can resend.
- Tracker guards against SSR (no `window`/`localStorage`) — runs only in browser.

## Accessibility & responsiveness

- Panel is a labelled dialog; `aria-live="polite"` on the message log; ESC closes;
  focus moves to input on open and back to launcher on close.
- Mobile (≤640px): panel expands to near-fullscreen.
- `prefers-reduced-motion`: GSAP open/close animation is skipped.

## Non-goals

- No streaming/token-by-token (clean JSON + typing indicator).
- No change to LeadFunnel or its unfinished submit.
- No server-side history endpoint (transcript lives client-side).
- No auth / multi-user — single anonymous visitor per browser.

## Testing

- **Unit (vitest):** `browsing.ts` (time accumulation, visit increment, session
  count) and `session.ts` (id create/persist, transcript round-trip), using a
  localStorage stub.
- **Manual (dev server):** open widget → greeting personalized by browsed pages;
  ask a services question → grounded reply; multi-turn → escalation note; reload →
  transcript restored.

## Open questions

- Launcher copy/icon (default: chat glyph, no label) — cosmetic, decide in build.
