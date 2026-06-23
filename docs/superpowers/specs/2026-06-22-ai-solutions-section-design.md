# AI Solutions Section — Design Spec

**Date:** 2026-06-22
**Status:** Approved, ready for implementation plan

## Goal

Add a standout homepage section that showcases the range of AI solutions BuildSynergy
offers. It must visually break from the light theme to read as the high-tech, premium
capability, and present four core AI solutions with a clear path to enquire.

## Non-Goals

- No dedicated `/ai` page (homepage section only).
- No new dependencies.
- No backend/agent changes — this is a presentational marketing section.
- Not removing the existing "AI Development & Integration" card from the Services grid
  (kept as the services-level overview; this section goes deeper).

## Placement & Visual Direction

- A **full-bleed dark band** inserted into the homepage **directly after `<SolutionSection />`**
  (between Services and Process). No `.divider` — the dark band is its own separator.
- Deep indigo/charcoal background with light text and soft indigo/violet glows; glassy
  translucent cards. High contrast against the otherwise light page is the "standout" device.
- The homepage's sections self-pad (`var(--section-pad) var(--gutter)`) and `<main>` is not
  width-constrained, so a full-width dark `background` on the section needs no layout hacks;
  inner content is wrapped at `max-width: var(--container)`.

## Content

- **Heading:** "AI that does the work, not just the talking."
- **Sub:** "We design and build practical AI solutions that handle real work — so your team
  spends less time on the repetitive and more on your customers."
- **Four solution cards** (label + description + icon):
  1. **AI Chatbots & Assistants** — "An always-on assistant that answers questions and
     captures leads on your site — exactly like the one you're chatting with right now."
     Carries a small **"Live on this site"** badge.
  2. **Document Processing** — "Turn invoices, forms, IDs and PDFs into clean, structured
     data automatically — no more manual capture."
  3. **Workflow Automation** — "Hand off repetitive admin — quotes, follow-ups, data entry —
     to AI that works across the tools you already use."
  4. **Custom AI Integrations** — "Bespoke AI features built into your existing website or
     systems, tailored to how your business actually runs."
- **CTA button:** "Get an AI solution →" — smooth-scrolls to `#contact`.

## Architecture

### New component — `src/lib/components/AiSection.svelte`
- Renders `<section id="ai" class="ai-section">` with the dark band, heading, sub, a 4-card
  grid, and the CTA.
- The four solutions live in an inline typed const array (`{ label, desc, icon }`), mirroring
  the `SolutionSection` pattern; the first entry includes a `badge?: string` for "Live on this site".
- Inline SVG icons (chat bubble, document, workflow/gears, chip/puzzle), `currentColor`,
  matching the existing icon style.
- GSAP scroll reveals (heading + staggered cards) consistent with other sections, with
  `ScrollTrigger` cleanup in the `onMount` return; cursor-spotlight hover on cards (reuse the
  `SolutionSection` `--mx/--my` technique, restyled for the dark surface).
- The CTA scrolls to `#contact` via `document.querySelector('#contact')?.scrollIntoView`.

### Homepage — `src/routes/+page.svelte`
- Import `AiSection`; render `<AiSection />` immediately after `<SolutionSection />`
  (before the Process divider). No surrounding `.divider`.

### Navigation — `src/lib/components/Navigation.svelte`
- Add an anchor `navItems` entry `{ name: 'AI', id: 'ai', type: 'anchor', icon: <svg> }`,
  positioned between `Services` and `Process`. It participates in the existing route-aware
  behaviour (scroll-spy + smooth scroll on home; `/#ai` link off home) and the lamp/scroll-spy
  IntersectionObserver automatically (it observes all `type === 'anchor'` items).

## Styling

- Dark band: deep gradient background (e.g. indigo-tinted charcoal); light heading/body text;
  two soft radial accent glows (indigo + violet) behind the content.
- Cards: translucent light-on-dark surface (`rgba(255,255,255,0.04)`), hairline border
  (`rgba(255,255,255,0.08)`), accent-tinted spotlight + border on hover, subtle lift.
- "Live on this site" badge: small pill with an accent dot.
- Reuse existing tokens where they read correctly on dark (`--indigo`, `--display`,
  `--section-pad`, `--gutter`, `--container`); section-local rgba values are used for the
  dark surface treatment (no new global CSS variables).
- `prefers-reduced-motion: reduce`: disable reveals/hover transforms/spotlight, render static.

## Verification

- `npm run build` succeeds; the homepage renders the dark AI band after Services.
- The "AI" nav link appears and scrolls to the section on the homepage; off-home it is `/#ai`.
- Cards show hover spotlight/lift; CTA scrolls to the contact section.
- Reduced motion: section is fully readable with animations disabled.
- (Repo note: `npm run check` has a pre-existing `$lib` alias resolution issue; use
  `npm run build` as the gate.)

## Files Touched

**New:**
- `src/lib/components/AiSection.svelte`

**Modified:**
- `src/routes/+page.svelte` (insert `<AiSection />` after `<SolutionSection />`)
- `src/lib/components/Navigation.svelte` (add `AI` anchor nav item)
