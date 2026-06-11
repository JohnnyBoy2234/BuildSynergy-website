# Lead Funnel — Multi-Step Enquiry Form

**Date:** 2026-06-11
**Branch:** `add-lead-funnel`
**Status:** Approved

## Goal

Replace the single-page contact form with a multi-step lead funnel to increase
enquiry conversion. Research basis: multi-step forms convert 86%+ higher than
single-page equivalents on B2B enquiry forms (Formstack: 13.9% vs 4.5%);
forms with 7+ visible fields collapse to ~11% completion vs ~23% at 3 fields.
Easy qualifiers go first, contact details last.

## Scope

- UI only. Submit is stubbed (validate → fake delay → success state) with a
  `TODO` marker for delivery wiring later.
- Lives in the existing contact section on the homepage. No new routes, no
  CTA rewiring — `ContactSection.svelte` keeps `id="contact"`.

## Architecture

```
src/lib/components/funnel/
├── LeadFunnel.svelte          orchestrator: step state, progress bar, nav, submit
├── StepService.svelte         step 1 — service chips
├── StepContext.svelte         step 2 — website? + main goal
├── StepBudgetTimeline.svelte  step 3 — timeline + budget chips
└── StepContact.svelte         step 4 — contact fields + consent
```

`ContactSection.svelte` keeps its section shell, glow, heading, and GSAP
scroll-entrance animation; its `<form>` is replaced by `<LeadFunnel />`.
`FinalCTA.svelte` and everything else are untouched.

## Data Model

One `FunnelData` object owned by `LeadFunnel`, shared with steps via
`$bindable` props (Svelte 5 runes):

```ts
interface FunnelData {
  service: string;            // step 1, required
  hasWebsite: boolean | null; // step 2, required
  websiteUrl: string;         // step 2, optional, shown when hasWebsite
  mainGoal: string;           // step 2, required
  timeline: string;           // step 3, required chip
  budget: string;             // step 3, optional chip ('' = skipped)
  name: string;               // step 4, required
  businessName: string;       // step 4, required
  email: string;              // step 4, required, format-checked
  phone: string;              // step 4, optional
  agreed: boolean;            // step 4, required (POPIA consent)
}
```

State never resets on back-navigation — answers persist across steps.

## Steps

### Step 1 — What do you need help with?
Chip grid with the existing 10 options: New Website, Website Redesign,
WhatsApp Integration, Contact or Quote Forms, AI Chatbot, Google Visibility,
Company Profile, Photography or Video, Website Maintenance, Not Sure Yet.
Tapping a chip selects it and **auto-advances** to step 2.

### Step 2 — Your situation
- "Do you currently have a website?" — yes/no toggle.
- If yes: optional URL text field.
- "What's the main thing you want to improve?" — textarea, required.

### Step 3 — Timeline & budget
- Timeline chips (required): `ASAP` / `1–3 months` / `Just exploring`.
- Budget chips (optional, skippable):
  `Under R10k` / `R10–25k` / `R25–50k` / `R50k+` / `Not sure yet`.
  Optional by design — budget fields cost ~15% completion when forced.

### Step 4 — Contact details
Name (required), Business Name (required), Email (required, regex-checked),
Phone (optional), POPIA consent checkbox (required).
Submit button: **"Start My Project"**.

## Behaviour

- **Progress indicator:** "Step N of 4" text + filled bar at the top of the
  card.
- **Navigation:** Back button on steps 2–4. Continue button per step
  ("Continue →"); step 1 advances on chip tap with no button.
- **Validation:** per-step gate — cannot advance with missing required
  fields. Inline errors in the existing error style. Email regex matches the
  current form's.
- **Transitions:** ~250ms fade/slide between steps via GSAP (existing
  dependency).
- **Success state:** existing "Message received / We'll be in touch within
  one business day." panel, unchanged.
- **Mobile:** chips wrap to a tappable grid, fields go single-column at the
  existing 768px breakpoint.
- **Styling:** reuse the current form's design tokens (card, input, button,
  error styles) so the funnel looks native to the site.

## Error Handling

Client-side only: required-field checks per step, email format check,
consent gate. No network error handling until delivery is wired.

## Out of Scope

- Lead delivery (email service / endpoint / sheet) — decided later.
- Standalone funnel page, lead magnet funnel, social proof sections,
  sticky CTA, exit-intent — possible follow-ups, not this build.

## Verification

Manual via dev server + Playwright screenshots (established project
pattern):

1. Walk all 4 steps to success state.
2. Back-navigation preserves every answer.
3. Validation blocks advancing on each step; errors render inline.
4. Budget skip works (step 3 advances with no budget selected).
5. Mobile viewport (375px): chips and fields usable.
6. Existing CTAs (Hero, Navigation, Packages, Footer) still scroll to the
   funnel.
