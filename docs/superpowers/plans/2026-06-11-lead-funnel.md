# Lead Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-page contact form with a 4-step lead funnel (service → context → timeline/budget → contact) to lift enquiry conversion.

**Architecture:** New `src/lib/components/funnel/` folder: `LeadFunnel.svelte` orchestrates step state, progress bar, per-step validation, and stubbed submit; four small step components receive a shared `FunnelData` object via `$bindable` props. `ContactSection.svelte` keeps its section shell (id="contact", glows, heading, GSAP entrance) and swaps its `<form>` for `<LeadFunnel />`. Nothing else changes.

**Tech Stack:** Svelte 5 (runes), TypeScript, GSAP (existing dependency), scoped CSS using existing design tokens.

**Spec:** `docs/superpowers/specs/2026-06-11-lead-funnel-design.md`

**Testing note:** This repo has no test runner. The automated gate for every task is `npm run check` (svelte-check + tsc). Final task is a manual dev-server walkthrough per the spec's verification list. Work happens directly on the `add-lead-funnel` branch (already checked out) — no worktree needed.

**All commands run from:** `/home/caleb/Projects/BuildSynergy-website`

---

## File Structure

```
src/lib/components/funnel/
├── types.ts                   FunnelData interface + emptyFunnelData() + option lists
├── StepService.svelte         step 1 — service chips, auto-advance on tap
├── StepContext.svelte         step 2 — has-website toggle, optional URL, main goal
├── StepBudgetTimeline.svelte  step 3 — timeline chips (required), budget chips (optional)
├── StepContact.svelte         step 4 — name/business/email/phone + consent
└── LeadFunnel.svelte          orchestrator: step state, progress, nav, validation, submit stub, success state

src/lib/components/ContactSection.svelte   modified: form replaced by <LeadFunnel />
```

Shared form styling (chips, fields, inputs, errors) lives in `LeadFunnel.svelte` under a `.lf` scoping class using `:global()` selectors, so step components stay markup-only. This mirrors the visual style of the form being replaced (see the style block of the current `ContactSection.svelte` — the chip/input/error CSS is copied from there).

---

### Task 1: Funnel types and shared data

**Files:**
- Create: `src/lib/components/funnel/types.ts`

- [ ] **Step 1: Create the types file**

```ts
export interface FunnelData {
  service: string;
  hasWebsite: boolean | null;
  websiteUrl: string;
  mainGoal: string;
  timeline: string;
  budget: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  agreed: boolean;
}

export function emptyFunnelData(): FunnelData {
  return {
    service: '',
    hasWebsite: null,
    websiteUrl: '',
    mainGoal: '',
    timeline: '',
    budget: '',
    name: '',
    businessName: '',
    email: '',
    phone: '',
    agreed: false,
  };
}

export const SERVICE_OPTIONS = [
  'New Website', 'Website Redesign', 'WhatsApp Integration',
  'Contact or Quote Forms', 'AI Chatbot', 'Google Visibility',
  'Company Profile', 'Photography or Video', 'Website Maintenance', 'Not Sure Yet',
];

export const TIMELINE_OPTIONS = ['ASAP', '1–3 months', 'Just exploring'];

export const BUDGET_OPTIONS = ['Under R10k', 'R10–25k', 'R25–50k', 'R50k+', 'Not sure yet'];
```

- [ ] **Step 2: Verify it type-checks**

Run: `npm run check`
Expected: `svelte-check found 0 errors and 0 warnings` (tsc exits clean)

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/funnel/types.ts
git commit -m "feat: add funnel data model and option lists"
```

---

### Task 2: Step 1 — service chips

**Files:**
- Create: `src/lib/components/funnel/StepService.svelte`

- [ ] **Step 1: Create the component**

Tapping a chip selects the service and immediately calls `onselect` so the
orchestrator advances to step 2 (auto-advance, per spec). Styling classes
(`chips`, `chip`, `active`) are defined globally under `.lf` in
`LeadFunnel.svelte` (Task 6).

```svelte
<script lang="ts">
  import { SERVICE_OPTIONS, type FunnelData } from './types';

  interface Props {
    data: FunnelData;
    onselect: () => void;
  }

  let { data = $bindable(), onselect }: Props = $props();
</script>

<h3 class="lf-title">What do you need help with?</h3>
<div class="chips" role="group" aria-label="Service required">
  {#each SERVICE_OPTIONS as opt}
    <button
      type="button"
      class="chip"
      class:active={data.service === opt}
      aria-pressed={data.service === opt}
      onclick={() => { data.service = opt; onselect(); }}
    >{opt}</button>
  {/each}
</div>

<style>
  .lf-title {
    font-size: 1.15rem;
    margin: 0 0 1.25rem;
  }
</style>
```

- [ ] **Step 2: Verify it type-checks**

Run: `npm run check`
Expected: 0 errors. (An "unused component" situation is fine — it's wired up in Task 6.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/funnel/StepService.svelte
git commit -m "feat: add funnel step 1 (service selection)"
```

---

### Task 3: Step 2 — current situation

**Files:**
- Create: `src/lib/components/funnel/StepContext.svelte`

- [ ] **Step 1: Create the component**

Yes/no toggle for "do you have a website", a URL field that only renders
after "Yes", and a required main-goal textarea. `errors` keys used here:
`hasWebsite`, `mainGoal` (set by the orchestrator's validator in Task 6).

```svelte
<script lang="ts">
  import type { FunnelData } from './types';

  interface Props {
    data: FunnelData;
    errors: Record<string, string>;
  }

  let { data = $bindable(), errors }: Props = $props();
</script>

<h3 class="lf-title">Tell us about your current setup</h3>

<div class="form-field" class:err={errors.hasWebsite}>
  <span class="lf-label">Do you currently have a website?</span>
  <div class="chips" role="group" aria-label="Do you currently have a website?">
    <button
      type="button"
      class="chip"
      class:active={data.hasWebsite === true}
      aria-pressed={data.hasWebsite === true}
      onclick={() => (data.hasWebsite = true)}
    >Yes</button>
    <button
      type="button"
      class="chip"
      class:active={data.hasWebsite === false}
      aria-pressed={data.hasWebsite === false}
      onclick={() => (data.hasWebsite = false)}
    >No</button>
  </div>
  {#if errors.hasWebsite}<span class="err-msg">{errors.hasWebsite}</span>{/if}
</div>

{#if data.hasWebsite}
  <div class="form-field">
    <label for="lf-url">Website <span class="opt">(optional)</span></label>
    <input id="lf-url" type="url" placeholder="https://yourbusiness.co.za" bind:value={data.websiteUrl} />
  </div>
{/if}

<div class="form-field" class:err={errors.mainGoal}>
  <label for="lf-goal">What's the main thing you want to improve?</label>
  <textarea
    id="lf-goal"
    rows="4"
    placeholder="e.g. We don't show up on Google and our site looks outdated..."
    bind:value={data.mainGoal}
  ></textarea>
  {#if errors.mainGoal}<span class="err-msg">{errors.mainGoal}</span>{/if}
</div>

<style>
  .lf-title {
    font-size: 1.15rem;
    margin: 0 0 1.25rem;
  }
  .lf-label {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.02em;
  }
</style>
```

- [ ] **Step 2: Verify it type-checks**

Run: `npm run check`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/funnel/StepContext.svelte
git commit -m "feat: add funnel step 2 (current situation)"
```

---

### Task 4: Step 3 — timeline and budget

**Files:**
- Create: `src/lib/components/funnel/StepBudgetTimeline.svelte`

- [ ] **Step 1: Create the component**

Timeline is a required single-select. Budget is optional: clicking the
selected chip again deselects it (`data.budget` back to `''` = skipped).
`errors` key used here: `timeline`.

```svelte
<script lang="ts">
  import { TIMELINE_OPTIONS, BUDGET_OPTIONS, type FunnelData } from './types';

  interface Props {
    data: FunnelData;
    errors: Record<string, string>;
  }

  let { data = $bindable(), errors }: Props = $props();
</script>

<h3 class="lf-title">Timeline and budget</h3>

<div class="form-field" class:err={errors.timeline}>
  <span class="lf-label">When do you want to be live?</span>
  <div class="chips" role="group" aria-label="Timeline">
    {#each TIMELINE_OPTIONS as opt}
      <button
        type="button"
        class="chip"
        class:active={data.timeline === opt}
        aria-pressed={data.timeline === opt}
        onclick={() => (data.timeline = opt)}
      >{opt}</button>
    {/each}
  </div>
  {#if errors.timeline}<span class="err-msg">{errors.timeline}</span>{/if}
</div>

<div class="form-field">
  <span class="lf-label">Budget range <span class="opt">(optional)</span></span>
  <div class="chips" role="group" aria-label="Budget range">
    {#each BUDGET_OPTIONS as opt}
      <button
        type="button"
        class="chip"
        class:active={data.budget === opt}
        aria-pressed={data.budget === opt}
        onclick={() => (data.budget = data.budget === opt ? '' : opt)}
      >{opt}</button>
    {/each}
  </div>
</div>

<style>
  .lf-title {
    font-size: 1.15rem;
    margin: 0 0 1.25rem;
  }
  .lf-label {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.02em;
  }
  .opt {
    font-weight: 400;
    opacity: 0.6;
  }
</style>
```

- [ ] **Step 2: Verify it type-checks**

Run: `npm run check`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/funnel/StepBudgetTimeline.svelte
git commit -m "feat: add funnel step 3 (timeline and budget)"
```

---

### Task 5: Step 4 — contact details

**Files:**
- Create: `src/lib/components/funnel/StepContact.svelte`

- [ ] **Step 1: Create the component**

Field markup mirrors the form being replaced (same placeholders, autocomplete
attributes, POPIA consent links). `errors` keys used here: `name`,
`businessName`, `email`, `agreed`.

```svelte
<script lang="ts">
  import type { FunnelData } from './types';

  interface Props {
    data: FunnelData;
    errors: Record<string, string>;
  }

  let { data = $bindable(), errors }: Props = $props();
</script>

<h3 class="lf-title">How do we reach you?</h3>

<div class="form-row">
  <div class="form-field" class:err={errors.name}>
    <label for="lf-name">Name</label>
    <input id="lf-name" type="text" placeholder="Your name" bind:value={data.name} autocomplete="name" />
    {#if errors.name}<span class="err-msg">{errors.name}</span>{/if}
  </div>
  <div class="form-field" class:err={errors.businessName}>
    <label for="lf-biz">Business Name</label>
    <input id="lf-biz" type="text" placeholder="Your business" bind:value={data.businessName} />
    {#if errors.businessName}<span class="err-msg">{errors.businessName}</span>{/if}
  </div>
</div>

<div class="form-row">
  <div class="form-field" class:err={errors.email}>
    <label for="lf-email">Email</label>
    <input id="lf-email" type="email" placeholder="hello@yourbusiness.co.za" bind:value={data.email} autocomplete="email" />
    {#if errors.email}<span class="err-msg">{errors.email}</span>{/if}
  </div>
  <div class="form-field">
    <label for="lf-phone">Phone <span class="opt">(optional)</span></label>
    <input id="lf-phone" type="tel" placeholder="+27 81 000 0000" bind:value={data.phone} autocomplete="tel" />
  </div>
</div>

<div class="form-field agree-field" class:err={errors.agreed}>
  <label class="agree-label">
    <input type="checkbox" bind:checked={data.agreed} class="agree-check" />
    <span>
      I agree to the
      <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>
      and
      <a href="/terms" target="_blank" rel="noopener">Terms &amp; Conditions</a>.
    </span>
  </label>
  {#if errors.agreed}<span class="err-msg">{errors.agreed}</span>{/if}
</div>

<style>
  .lf-title {
    font-size: 1.15rem;
    margin: 0 0 1.25rem;
  }
  .opt {
    font-weight: 400;
    opacity: 0.6;
  }
</style>
```

- [ ] **Step 2: Verify it type-checks**

Run: `npm run check`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/funnel/StepContact.svelte
git commit -m "feat: add funnel step 4 (contact details)"
```

---

### Task 6: LeadFunnel orchestrator

**Files:**
- Create: `src/lib/components/funnel/LeadFunnel.svelte`

- [ ] **Step 1: Create the component**

Owns all funnel state. Single `<form>`: Enter / Continue submits the form,
which advances if `step < 4` and submits if `step === 4`. Back clears errors
but never resets data (answers persist, per spec). `{#key step}` +
`use:stepIn` gives the ~250ms GSAP fade/slide between steps. Submit is a
stub: validate → 900ms fake delay → success panel (markup and styles carried
over from the form being replaced).

The `:global()` selectors under `.lf` style the markup inside the step
components — chip, form-field, input, error, and consent-checkbox CSS is
copied from the current `ContactSection.svelte` style block so the funnel
looks identical to the form it replaces.

```svelte
<script lang="ts">
  import gsap from 'gsap';
  import StepService from './StepService.svelte';
  import StepContext from './StepContext.svelte';
  import StepBudgetTimeline from './StepBudgetTimeline.svelte';
  import StepContact from './StepContact.svelte';
  import { emptyFunnelData } from './types';

  const TOTAL_STEPS = 4;

  let data = $state(emptyFunnelData());
  let step = $state(1);
  let errors = $state<Record<string, string>>({});
  let submitting = $state(false);
  let submitted = $state(false);

  function validateStep(n: number): Record<string, string> {
    const e: Record<string, string> = {};
    if (n === 2) {
      if (data.hasWebsite === null) e.hasWebsite = 'Please choose one.';
      if (!data.mainGoal.trim()) e.mainGoal = 'Required.';
    }
    if (n === 3) {
      if (!data.timeline) e.timeline = 'Please choose a timeline.';
    }
    if (n === 4) {
      if (!data.name.trim()) e.name = 'Required.';
      if (!data.businessName.trim()) e.businessName = 'Required.';
      if (!data.email.trim()) e.email = 'Required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Invalid email.';
      if (!data.agreed) e.agreed = 'You must agree to continue.';
    }
    return e;
  }

  function next() {
    errors = validateStep(step);
    if (Object.keys(errors).length) return;
    step = Math.min(step + 1, TOTAL_STEPS);
  }

  function back() {
    errors = {};
    step = Math.max(step - 1, 1);
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (step < TOTAL_STEPS) {
      next();
      return;
    }
    errors = validateStep(TOTAL_STEPS);
    if (Object.keys(errors).length) return;
    submitting = true;
    // TODO: wire to delivery (email service / endpoint / sheet)
    await new Promise(r => setTimeout(r, 900));
    submitting = false;
    submitted = true;
  }

  function stepIn(node: HTMLElement) {
    gsap.fromTo(
      node,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
    );
  }
</script>

<div class="lf">
  {#if submitted}
    <div class="lf-success">
      <div class="success-ring" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M6 14l6 6 10-12" stroke="#22d3ee" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3>Message received.</h3>
      <p>We'll be in touch within one business day.</p>
    </div>

  {:else}
    <div class="lf-progress">
      <span class="lf-progress-label" role="status">Step {step} of {TOTAL_STEPS}</span>
      <div class="lf-bar" aria-hidden="true">
        <div class="lf-bar-fill" style="width: {(step / TOTAL_STEPS) * 100}%"></div>
      </div>
    </div>

    <form onsubmit={handleSubmit} novalidate>
      {#key step}
        <div class="lf-step" use:stepIn>
          {#if step === 1}
            <StepService bind:data onselect={next} />
          {:else if step === 2}
            <StepContext bind:data {errors} />
          {:else if step === 3}
            <StepBudgetTimeline bind:data {errors} />
          {:else}
            <StepContact bind:data {errors} />
          {/if}
        </div>
      {/key}

      {#if step > 1}
        <div class="lf-nav">
          <button type="button" class="lf-back" onclick={back}>← Back</button>
          {#if step < TOTAL_STEPS}
            <button type="submit" class="btn-submit">Continue →</button>
          {:else}
            <button type="submit" class="btn-submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Start My Project'}
            </button>
          {/if}
        </div>
      {/if}
    </form>
  {/if}
</div>

<style>
  /* Progress */
  .lf-progress {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-bottom: 2rem;
  }
  .lf-progress-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }
  .lf-bar {
    height: 4px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.07);
    overflow: hidden;
  }
  .lf-bar-fill {
    height: 100%;
    border-radius: 100px;
    background: linear-gradient(90deg, var(--indigo), var(--violet));
    transition: width 0.3s ease;
  }

  /* Step container + nav */
  .lf-step {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .lf-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
    padding-top: 1.75rem;
  }
  .lf-back {
    background: none;
    border: none;
    color: var(--text-muted);
    font-family: var(--sans);
    font-size: 0.88rem;
    cursor: pointer;
    padding: 0.5rem 0;
    transition: color 0.2s;
  }
  .lf-back:hover { color: var(--text); }

  .btn-submit {
    background: linear-gradient(135deg, var(--indigo), var(--violet));
    color: #fff;
    font-family: var(--display);
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0.9rem 2.25rem;
    border-radius: 100px;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .btn-submit:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
    box-shadow: 0 0 26px rgba(99, 102, 241, 0.4);
  }
  .btn-submit:disabled { opacity: 0.5; cursor: wait; }

  /* Shared field styles for step components (copied from the replaced form) */
  .lf :global(.form-row) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .lf :global(.form-field) {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .lf :global(label),
  .lf :global(.lf-label) {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.02em;
  }
  .lf :global(.opt) { font-weight: 400; opacity: 0.6; }

  .lf :global(input),
  .lf :global(textarea) {
    background: rgba(6, 6, 18, 0.9);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.875rem 1rem;
    color: var(--text);
    font-family: var(--sans);
    font-size: 0.9rem;
    width: 100%;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .lf :global(input::placeholder),
  .lf :global(textarea::placeholder) { color: var(--text-muted); }
  .lf :global(input:focus),
  .lf :global(textarea:focus) {
    border-color: rgba(99, 102, 241, 0.55);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  .lf :global(.err input),
  .lf :global(.err textarea) { border-color: rgba(239, 68, 68, 0.5); }
  .lf :global(textarea) { resize: vertical; min-height: 110px; }

  .lf :global(.err-msg) { font-size: 0.75rem; color: rgba(239, 68, 68, 0.9); }

  .lf :global(.chips) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }
  .lf :global(.chip) {
    font-size: 0.78rem;
    padding: 0.38rem 0.85rem;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: var(--glass);
    color: var(--text-body);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
  }
  .lf :global(.chip:hover) { border-color: var(--border2); color: var(--text); }
  .lf :global(.chip.active) {
    border-color: var(--indigo);
    background: rgba(99, 102, 241, 0.14);
    color: var(--text);
  }

  /* Consent checkbox (copied from the replaced form) */
  .lf :global(.agree-field) { gap: 0.35rem; }
  .lf :global(.agree-label) {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    cursor: pointer;
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.42);
    line-height: 1.55;
    font-weight: 400;
    letter-spacing: 0;
  }
  .lf :global(.agree-check) {
    appearance: none;
    -webkit-appearance: none;
    width: 17px;
    height: 17px;
    min-width: 17px;
    border-radius: 5px;
    border: 1px solid var(--border);
    background: rgba(6, 6, 18, 0.9);
    cursor: pointer;
    margin-top: 1px;
    position: relative;
    transition: border-color 0.2s, background 0.2s;
    padding: 0;
  }
  .lf :global(.agree-check:checked) {
    background: var(--indigo);
    border-color: var(--indigo);
  }
  .lf :global(.agree-check:checked::after) {
    content: '';
    position: absolute;
    top: 2px;
    left: 5px;
    width: 5px;
    height: 9px;
    border: 1.5px solid #fff;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
  }
  .lf :global(.agree-check:focus-visible) {
    outline: 2px solid var(--indigo);
    outline-offset: 2px;
  }
  .lf :global(.agree-label a) {
    color: var(--indigo);
    text-decoration: none;
    transition: color 0.2s;
  }
  .lf :global(.agree-label a:hover) { color: var(--cyan); }
  .lf :global(.err .agree-label) { color: rgba(239, 68, 68, 0.8); }
  .lf :global(.err .agree-check) { border-color: rgba(239, 68, 68, 0.5); }

  /* Success state (carried over from the replaced form) */
  .lf-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.1rem;
    padding: 3rem 1rem;
  }
  .success-ring {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(34, 211, 238, 0.1);
    border: 1px solid rgba(34, 211, 238, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .lf-success h3 { font-size: 1.5rem; }
  .lf-success p { max-width: 380px; color: var(--text-body); }

  @media (max-width: 768px) {
    .lf :global(.form-row) { grid-template-columns: 1fr; }
    .lf-nav { flex-direction: column-reverse; align-items: stretch; }
    .btn-submit { text-align: center; }
    .lf-back { text-align: center; }
  }
</style>
```

- [ ] **Step 2: Verify it type-checks**

Run: `npm run check`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/funnel/LeadFunnel.svelte
git commit -m "feat: add LeadFunnel orchestrator with progress bar and step validation"
```

---

### Task 7: Wire LeadFunnel into ContactSection

**Files:**
- Modify: `src/lib/components/ContactSection.svelte` (full replacement below)

- [ ] **Step 1: Replace the file contents**

Keeps: `id="contact"` (all site CTAs scroll here), SectionCanvas particles,
glows, header copy, GSAP word-reveal + panel entrance, `.ct-panel` card.
Removes: all form state, validation, markup, and the form/chip/success CSS
(now owned by `LeadFunnel.svelte`).

Replace the entire file with:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import SectionCanvas from './SectionCanvas.svelte';
  import LeadFunnel from './funnel/LeadFunnel.svelte';

  let sectionEl: HTMLElement;
  let panelEl:   HTMLElement;
  let headingEl: HTMLElement;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (headingEl) {
      const words = headingEl.textContent?.split(' ') ?? [];
      headingEl.innerHTML = words
        .map(w => `<span class="word-outer"><span class="word-inner">${w}</span></span>`)
        .join(' ');
      gsap.from(headingEl.querySelectorAll('.word-inner'), {
        y: '110%',
        opacity: 0,
        duration: 0.7,
        stagger: 0.04,
        ease: 'power4.out',
        scrollTrigger: { trigger: headingEl, start: 'top 82%' },
      });
    }

    if (panelEl) {
      gsap.from(panelEl, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: panelEl, start: 'top 85%' },
      });
    }

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  });
</script>

<section id="contact" class="contact-section" bind:this={sectionEl}>
  <!-- Particle network -->
  <SectionCanvas particleCount={45} opacity={0.35} />

  <!-- Atmospheric glows -->
  <div class="ct-glow ct-glow--l" aria-hidden="true"></div>
  <div class="ct-glow ct-glow--r" aria-hidden="true"></div>

  <div class="ct-inner">
    <div class="ct-header">
      <span class="eyebrow">Start a Project</span>
      <h2 bind:this={headingEl}>Ready to give your business a stronger online presence?</h2>
      <p>Tell us about your business and what you'd like to improve. We'll help you identify the right digital solution.</p>
    </div>

    <div class="ct-panel" bind:this={panelEl}>
      <LeadFunnel />
    </div>
  </div>
</section>

<style>
  .contact-section {
    position: relative;
    padding: var(--section-pad) var(--gutter);
    background: var(--bg);
    overflow: hidden;
  }

  .ct-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
  }
  .ct-glow--l {
    width: 500px; height: 500px;
    top: 10%; left: -5%;
    background: rgba(99,102,241,0.10);
  }
  .ct-glow--r {
    width: 400px; height: 400px;
    bottom: 10%; right: -5%;
    background: rgba(168,85,247,0.09);
  }

  .ct-inner {
    position: relative;
    z-index: 1;
    max-width: var(--container);
    margin: 0 auto;
  }

  .ct-header { max-width: 560px; margin-bottom: 3.5rem; }
  .ct-header h2 { margin: 0.6rem 0 1rem; }
  .ct-header p  { color: var(--text-body); font-size: 1rem; }

  /* Panel */
  .ct-panel {
    background: rgba(8,8,22,0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 3rem;
    max-width: 860px;
  }

  @media (max-width: 768px) {
    .ct-panel { padding: 2rem 1.5rem; }
  }
</style>
```

- [ ] **Step 2: Verify it type-checks and builds**

Run: `npm run check && npm run build`
Expected: 0 errors; build completes

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/ContactSection.svelte
git commit -m "feat: replace single-page contact form with multi-step lead funnel"
```

---

### Task 8: Manual verification (spec checklist)

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background)
Expected: Vite serves on http://localhost:5173

- [ ] **Step 2: Walk the funnel to success**

In a browser (or Playwright MCP) at `http://localhost:5173`, scroll to the
contact section and verify:

1. Progress shows "Step 1 of 4"; tapping a service chip auto-advances to step 2.
2. Step 2: clicking Continue with nothing filled shows errors on the
   website toggle and goal textarea; choosing "Yes" reveals the URL field;
   fill goal → Continue.
3. Step 3: Continue without a timeline shows an error; budget chip can be
   selected and deselected (skip works); pick a timeline → Continue.
4. Step 4: Continue with empty fields shows errors on name, business name,
   email, and consent; an invalid email shows "Invalid email."; fill all,
   tick consent → "Start My Project" → success panel "Message received."

- [ ] **Step 3: Verify back-navigation persistence**

From step 4 (before submitting), click Back to steps 3, 2, 1 — every
previously entered answer must still be selected/filled. Navigate forward
again; values still present.

- [ ] **Step 4: Verify mobile viewport**

At 375px width: chips wrap into a tappable grid, contact fields stack
single-column, nav buttons stack full-width.

- [ ] **Step 5: Verify existing CTAs still reach the funnel**

Click the Hero primary CTA, the Navigation "Start a Project" button, a
package card CTA, and the Footer "Contact" link — each scrolls to the funnel
section.

- [ ] **Step 6: Stop the dev server**

No commit for this task. If any check fails, fix and amend/commit on the
relevant task's file before finishing.
