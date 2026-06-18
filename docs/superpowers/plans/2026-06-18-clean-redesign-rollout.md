# Clean Redesign Rollout — Implementation Plan

> **For agentic workers:** This is a visual/CSS rollout, not TDD. Each task's gate is:
> (1) `npx vite build` passes, (2) the dev server renders, (3) human visual review in the
> browser. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the "clean" discipline proven in the Hero POC to every remaining section, so
the whole site reads as *distinct but grounded* instead of templated-busy.

**Architecture:** First codify the discipline as shared design tokens/utilities in `app.css`
(done once), then reskin each section to consume them — removing competing focal points,
looping motion, the multi-colour accent rainbow, and fabricated proof. No structural rewrite of
working sections; subtractive edits plus token adoption.

**Tech Stack:** SvelteKit 5 (runes), scoped `<style>` per component, GSAP/ScrollTrigger
(retained but trimmed), Tailwind 4 present but sections use plain CSS + tokens.

## Global Constraints (every task obeys these)

- **One accent colour: `--indigo` (#6366f1).** Retire violet/cyan/pink/amber/green *as accents*.
  They may remain only as rare, intentional data colours (e.g. red/green for bad/good states),
  never as decorative per-card rainbow.
- **One focal point per section.** A section has a single thing the eye lands on.
- **One faint, static background wash per section.** No drifting orbs, no looping pulses/spins,
  no noise textures. Entrance animations (fire once on scroll-in) are allowed.
- **Honest content only.** No fabricated metrics, scores, or fake activity feeds. Placeholder
  avatars are not acceptable as a finished state.
- **Shared tokens, not per-section copies.** Buttons, eyebrows, section shell, and the wash use
  global classes from `app.css`. No re-declaring `.cta-primary` inside components.
- **Preserve accessibility + reduced-motion** handling already present.
- **Verify each task:** `npx vite build` must pass before commit.

---

## File Structure

- `src/app.css` — add shared tokens/utilities: `.btn`, `.btn--ghost`, `.eyebrow` (refine),
  `.section-wash`, retire decorative accent aliases. **Foundation for all later tasks.**
- `src/lib/components/Hero.svelte` — DONE (POC). Will be migrated to shared `.btn` in Task 1.
- `src/lib/components/TrustStrip.svelte` — make real or remove.
- `src/lib/components/ProblemSection.svelte` — honest numbers, trim motion.
- `src/lib/components/SolutionSection.svelte` — kill rainbow, one accent, calmer cards.
- `src/lib/components/ProcessSection.svelte` — minor token adoption only.
- `src/lib/components/PackageSection.svelte` — add pricing, one accent, shared buttons.
- `src/lib/components/ManifestoSection.svelte` — real photos or honest founder framing.
- `src/lib/components/ContactSection.svelte` — real contact details, shared buttons.
- `src/lib/components/FinalCTA.svelte` — remove ~80 lines dead CSS.
- `src/lib/components/Footer.svelte` — fix dead social links.
- `src/lib/components/Navigation.svelte` — light polish (reduce glow), token adoption.

---

### Task 1: Codify the discipline in `app.css`

**Files:**
- Modify: `src/app.css`
- Modify: `src/lib/components/Hero.svelte` (adopt shared `.btn`)

**Interfaces:**
- Produces: global classes `.btn`, `.btn--ghost`, `.section-wash`; refined `.eyebrow`.
  All later tasks consume these.

- [ ] **Step 1: Add shared button + wash utilities to `app.css`**

Replace the existing `.btn-primary` / `.btn-secondary` blocks with a single token-driven set:

```css
/* ── Buttons (single accent) ─────────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; gap: 0.55rem;
  background: var(--indigo); color: #fff;
  font-family: var(--display); font-size: 0.9rem; font-weight: 600;
  text-decoration: none; padding: 0.9rem 1.7rem;
  border-radius: 100px; border: none; cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.btn:hover { background: #5457e5; transform: translateY(-1px); }
.btn svg { transition: transform 0.2s; }
.btn:hover svg { transform: translateX(3px); }

.btn--ghost {
  background: transparent; color: var(--text-body);
  border: 1px solid var(--border2); font-weight: 500;
}
.btn--ghost:hover { background: transparent; color: #fff; border-color: rgba(255,255,255,0.32); }

/* ── Single faint static section wash ────────────────────────────── */
.section-wash {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 55% 50% at 70% 30%,
    rgba(99,102,241,0.10) 0%, transparent 70%);
}
```

- [ ] **Step 2: Retire decorative accent aliases**

In `app.css` `:root`, leave `--indigo` as the accent. Add a comment marking the others as
non-accent/data-only so future edits don't reach for them:

```css
/* Accent: indigo only. The colours below are data-state colours, NOT decorative accents. */
--cyan:   #22d3ee;   /* data only */
--violet: #a855f7;   /* data only */
--pink:   #e879f9;   /* data only */
```

- [ ] **Step 3: Migrate Hero to shared `.btn`**

In `Hero.svelte`, delete the local `.cta-primary` / `.cta-secondary` style blocks and change the
markup classes to `class="btn"` and `class="btn btn--ghost"`. Keep the arrow SVG inside the primary.

- [ ] **Step 4: Verify + commit**

```bash
npx vite build
git add src/app.css src/lib/components/Hero.svelte
git commit -m "refactor: shared button + wash tokens, single-accent palette"
```

---

### Task 2: TrustStrip — make real or remove

**Files:**
- Modify: `src/lib/components/TrustStrip.svelte`
- Modify: `src/routes/+page.svelte` (if removed)

**Decision required from Caleb (review gate):** the strip currently markets our own service names
as if they were trust signals. Options:
- **(a) Repurpose** as an honest "What's included" capability ribbon with a clear heading
  ("Every site includes —") so it no longer implies external proof. Static, single-accent icons.
- **(b) Remove** entirely until real client logos exist, and let Problem follow Hero directly.

- [ ] **Step 1: Apply chosen option** (default (a) if no answer: add heading, drop the
  marquee animation, recolour icons to `--indigo`, remove the gradient top/bottom rainbow lines).
- [ ] **Step 2: Verify + commit**

```bash
npx vite build
git add -A && git commit -m "refactor: honest trust strip (capabilities, single accent)"
```

---

### Task 3: ProblemSection — honest numbers, one accent, trim motion

**Files:**
- Modify: `src/lib/components/ProblemSection.svelte`

- [ ] **Step 1: De-fabricate the before/after.** Replace the invented "Trust Score 24 → 91"
  numeric bars with qualitative states (e.g. the signal rows already say "No website found" vs
  "Professional website live" — keep those; remove the numeric `score-val`/`score-fill` numbers,
  or relabel to a neutral "Impression" with no fake number).
- [ ] **Step 2: One accent.** Ensure all decorative colour is `--indigo`; keep red/amber/green
  only on the bad/good signal dots (legitimate data colours).
- [ ] **Step 3: Trim motion.** Remove the looping `prob-drift` glow animation; replace the
  `.prob-glow` animated orb with the static `.section-wash` utility. Keep the one-time GSAP
  scroll-in reveals.
- [ ] **Step 4: Verify + commit**

```bash
npx vite build
git add -A && git commit -m "refactor: problem section — honest states, static wash"
```

---

### Task 4: SolutionSection — kill the rainbow

**Files:**
- Modify: `src/lib/components/SolutionSection.svelte`

- [ ] **Step 1: Collapse the palette.** In the `pillars` array, remove the per-pillar `accent`
  and `glow` rainbow; all six cards use `--indigo` (and its glow) so the grid reads as one system.
- [ ] **Step 2: Calm the cards.** Remove the cursor-tracking `card-spotlight` and the
  `card-beam` sweep (the two busiest per-card effects). Keep the subtle hover lift + border.
- [ ] **Step 3: Static wash.** Replace `.sol-glow-l` / `.sol-glow-r` animated orbs with one
  `.section-wash`.
- [ ] **Step 4: Verify + commit**

```bash
npx vite build
git add -A && git commit -m "refactor: solution grid — single accent, calmer cards"
```

---

### Task 5: ProcessSection — token adoption only

**Files:**
- Modify: `src/lib/components/ProcessSection.svelte`

- [ ] **Step 1:** Ensure node/icon accents use `--indigo`; replace `proc-glow-c` animated glow
  with `.section-wash`. Keep the timeline draw-in (one-time). This section is already clean.
- [ ] **Step 2: Verify + commit**

```bash
npx vite build
git add -A && git commit -m "refactor: process section — static wash, single accent"
```

---

### Task 6: PackageSection — quote-driven (no flat prices) + single accent

**Decision made (2026-06-18):** quotes, not flat prices. Packages funnel to the contact section
for a custom quote. DONE: CTAs now read "Request a quote", a "Custom quote · pay for what you
need" cue replaces any price, and all CTAs scroll to `#contact`.

**Files:**
- Modify: `src/lib/components/PackageSection.svelte`

- [x] **Step 1 (done):** quote-oriented CTAs + custom-quote cue, funnel to contact.
- [ ] **Step 2: Single accent.** Recommended tier keeps `--indigo` emphasis; remove any other
  accent colours. Migrate `.pkg-cta` buttons to shared `.btn` / `.btn--ghost`.
- [ ] **Step 3: Static wash** in place of the animated `.pkg-glow-l/-r`.
- [ ] **Step 4: Verify + commit**

```bash
npx vite build
git add -A && git commit -m "feat: package pricing + single-accent cards"
```

---

### Task 7: ManifestoSection — real founders or honest framing

**Files:**
- Modify: `src/lib/components/ManifestoSection.svelte`

**Decision required from Caleb (review gate):** real founder photos available? If yes, drop them
in. If not, replace silhouette placeholders with a deliberate, honest treatment (initials in a
branded circle + real names + a short genuine founder note) — not a faceless skeleton.

- [ ] **Step 1: Replace placeholder avatars** per the decision above.
- [ ] **Step 2: Add the actual "why us" content** the section name promises (1–2 sentences of
  genuine positioning: founder-led, two brothers, every project done in-house).
- [ ] **Step 3: Single accent + static wash; remove unused `.t-divider`/`.t-quote` CSS** flagged
  by svelte-check.
- [ ] **Step 4: Verify + commit**

```bash
npx vite build
git add -A && git commit -m "refactor: founder section — real framing, single accent"
```

---

### Task 8: Contact + FinalCTA + Footer cleanup

**Files:**
- Modify: `src/lib/components/ContactSection.svelte`
- Modify: `src/lib/components/FinalCTA.svelte`
- Modify: `src/lib/components/Footer.svelte`

**Decision required from Caleb:** real phone number, location/city, business hours.

- [ ] **Step 1:** Add real contact details (phone, location, hours) to ContactSection; migrate
  its buttons to shared `.btn`.
- [ ] **Step 2:** Remove the ~80 lines of dead unused CSS in `FinalCTA.svelte` (it only renders
  `<ContactSection/>`).
- [ ] **Step 3:** Fix Footer dead social links (`href="/"`) — point to real profiles or remove
  the ones that don't exist yet.
- [ ] **Step 4: Verify + commit**

```bash
npx vite build
git add -A && git commit -m "refactor: real contact details, remove dead CSS + dead links"
```

---

### Task 9: Navigation polish

**Files:**
- Modify: `src/lib/components/Navigation.svelte`

- [ ] **Step 1:** Reduce the multi-layer lamp bloom to a single subtle indigo underline; keep the
  slide animation. Ensure the CTA uses the shared accent. This is the most distinctive element —
  light touch only.
- [ ] **Step 2: Verify + commit**

```bash
npx vite build
git add -A && git commit -m "polish: calmer nav lamp, single accent"
```

---

## Self-Review

**Spec coverage** (against the audit doc):
- 🔴 fabricated proof → Tasks 1 (Hero done), 2 (strip), 3 (problem). ✓
- 🔴 aesthetic monoculture / rainbow → Tasks 1, 4. ✓
- 🔴 no pricing → Task 6. ✓
- 🟠 placeholder founders → Task 7. ✓
- 🟡 dead CSS / dead links / contact → Task 8. ✓
- motion density → Tasks 3–7 (static wash, removed loops). ✓
- 🟢 nav → Task 9. ✓
- Proof scaffolding (empty testimonial/portfolio slots) — **deferred**: out of scope for the
  discipline rollout; tracked as a follow-up once first clients exist.

**Placeholder scan:** Decision gates (Tasks 2, 6, 7, 8) require Caleb's input (prices, photos,
contact, social) — these are genuine content inputs, not plan placeholders. Each has a stated
default so execution isn't blocked.

**Consistency:** All tasks consume `.btn` / `.btn--ghost` / `.section-wash` / `--indigo` defined
in Task 1. No conflicting names.
