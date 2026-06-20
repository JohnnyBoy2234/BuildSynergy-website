# Light Theme Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the BuildSynergy SvelteKit site from its dark navy/indigo theme to an elegant light "crisp & cool" theme (white + cool grey-blue, single indigo accent).

**Architecture:** The theme is ~70% driven by CSS custom properties in `src/app.css`. Task 1 rewrites those tokens (the largest single win). Remaining tasks convert each live component's hardcoded colors and dark-only effects (glass, glows) to the new tokens, working from a shared mapping table. The closing CTA (`ContactSection`) stays an intentional deep-dark accent block.

**Tech Stack:** SvelteKit 5 (runes), Tailwind 4 (utility import only; styling is component `<style>` + `app.css` tokens), GSAP (scroll reveals), Three.js (one live particle scene), plain CSS.

## How to read this plan

Most tasks are **mechanical token swaps**: the "code" is the shared mapping in
Global Constraints, applied to the file named in the task. For these the
executor MUST: (1) read the file, (2) replace each hardcoded color per the
mapping, (3) run the task's verification grep + build. Tasks with non-mechanical
logic (Hero canvas, Nav lamp, Task 1 tokens, CTA dark block) include complete
code inline.

A "test" for a CSS re-theme is: the verification grep finds no leftover
dark-on-dark values, `npm run build` passes, and a manual visual check in
`npm run dev` looks correct. Each task ends with that gate.

## Global Constraints

- **Palette tokens (verbatim — define in `app.css`, use everywhere):**
  - `--bg #FFFFFF` · `--bg2 #F7F9FC` · `--surface #FFFFFF` · `--surface2 #F4F6FB` · `--tint #EEF1F8`
  - `--border #E5E8F0` · `--border2 #D4D9E6`
  - `--text #0B0F19` · `--text-body #4A5163` · `--text-muted #7A8194`
  - `--indigo #6366F1` · `--indigo-strong #4F46E5` · `--indigo-soft #EEF0FE`
  - `--shadow-sm 0 1px 2px rgba(16,24,40,0.05)` · `--shadow-md 0 4px 16px rgba(16,24,40,0.08)` · `--shadow-lg 0 12px 32px rgba(16,24,40,0.10)` · `--shadow-indigo 0 8px 24px rgba(99,102,241,0.18)`
- **Color discipline:** indigo + grey only on light surfaces. Collapse cyan `#22d3ee`, violet `#a855f7`, pink `#e879f9` to indigo/grey. Exception: inside the dark CTA block they may remain.
- **Mapping table (old dark value → new):**
  - dark page bg (`#04040e`,`#07071a`) → `var(--bg)`; alt section → `var(--bg2)`
  - card/glass (`rgba(255,255,255,0.04|0.07)`, `--surface`,`--surface2`) → `var(--surface)` + `1px solid var(--border)` + `var(--shadow-sm)`
  - dark borders (`rgba(255,255,255,0.09|0.16)`) → `var(--border)` / `var(--border2)`
  - heading text (`#fff`, `rgba(255,255,255,0.9+)`) → `var(--text)`
  - body text (`rgba(255,255,255,0.6)`) → `var(--text-body)`; muted (`rgba(255,255,255,0.4)`) → `var(--text-muted)`
  - indigo accent (`#6366f1`) → keep as `var(--indigo)`; hover → `var(--indigo-strong)`
  - any blurred glow (`filter: blur(...)` radial, `box-shadow: 0 0 Npx rgba(99,102,241..)`) → remove; replace with `var(--shadow-md)` or an `var(--indigo-soft)` fill
  - gradient `linear-gradient(...,#a855f7|#22d3ee...)` → solid `var(--indigo)` or `var(--indigo-strong)`
- **Keep:** GSAP, Three.js (`three` stays in deps), fonts (Space Grotesk + Inter), all copy text, layout/markup structure.
- **Accessibility:** body text ≥ WCAG AA contrast on its background. `--text` (#0B0F19) on white/bg2 passes; `--text-muted` (#7A8194) only for non-essential labels.
- **Verify after every task:** `npm run build` passes; existing tests unaffected. `npm run check` is pre-broken ($lib alias + missing @types/three) — ignore its 38 baseline errors; only regard NEW build failures.

---

### Task 1: Rewrite design tokens + global base (`app.css`)

**Files:**
- Modify: `src/app.css` (tokens block ~8-48, base/body ~50-77, typography/eyebrow, buttons, washes, card, divider, text-gradient)

**Interfaces:**
- Produces: all tokens listed in Global Constraints, plus restyled global classes `.btn`, `.btn--ghost`, `.card`, `.eyebrow`, `.text-gradient`, `.section`, `.container`. Every later task consumes these.

- [ ] **Step 1: Replace the `:root` token block** (lines ~8-48) with:

```css
:root {
  /* Backgrounds — light, cool */
  --bg:       #FFFFFF;
  --bg2:      #F7F9FC;
  --surface:  #FFFFFF;
  --surface2: #F4F6FB;
  --tint:     #EEF1F8;

  /* Borders */
  --border:   #E5E8F0;
  --border2:  #D4D9E6;

  /* Text */
  --text:       #0B0F19;
  --text-body:  #4A5163;
  --text-muted: #7A8194;

  /* Accent: indigo only */
  --indigo:        #6366F1;
  --indigo-strong: #4F46E5;
  --indigo-soft:   #EEF0FE;

  /* Shadows replace dark-theme glows */
  --shadow-sm:     0 1px 2px rgba(16,24,40,0.05);
  --shadow-md:     0 4px 16px rgba(16,24,40,0.08);
  --shadow-lg:     0 12px 32px rgba(16,24,40,0.10);
  --shadow-indigo: 0 8px 24px rgba(99,102,241,0.18);

  /* Typography */
  --sans:    'Inter', system-ui, sans-serif;
  --display: 'Space Grotesk', system-ui, sans-serif;

  /* Layout rhythm */
  --section-pad: clamp(5rem, 10vw, 9rem);
  --container:   1280px;
  --gutter:      clamp(1.25rem, 5vw, 5rem);
}
```

- [ ] **Step 2: Update `body` + remove dark ambient `body::before`.** Set `background: var(--bg); color: var(--text);` on body. Replace the dark radial `body::before` (lines ~64-75) with a near-invisible cool wash (or delete it):

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse 70% 60% at 50% -5%, rgba(99,102,241,0.04) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 3: Update buttons, card, eyebrow, text-gradient, divider, section-wash.** Replace those rules with:

```css
.btn {
  display: inline-flex; align-items: center; gap: 0.55rem;
  background: var(--indigo); color: #fff;
  font-family: var(--display); font-size: 0.9rem; font-weight: 600;
  text-decoration: none; padding: 0.9rem 1.7rem; border-radius: 100px;
  border: none; cursor: pointer;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.btn:hover { background: var(--indigo-strong); transform: translateY(-1px); box-shadow: var(--shadow-indigo); }
.btn svg { transition: transform 0.2s; }
.btn:hover svg { transform: translateX(3px); }

.btn--ghost {
  background: transparent; color: var(--text-body);
  border: 1px solid var(--border2); font-weight: 500;
}
.btn--ghost:hover { background: var(--surface2); color: var(--text); border-color: var(--indigo); }

.section-wash {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 55% 50% at 70% 30%, rgba(99,102,241,0.05) 0%, transparent 70%);
}

.text-gradient {
  background: linear-gradient(135deg, #0B0F19 0%, #4F46E5 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.25s;
}
.card:hover { border-color: var(--border2); box-shadow: var(--shadow-md); transform: translateY(-3px); }
```

- [ ] **Step 4: Neutralize `.divider`.** It blended dark sections; on light, make it transparent (rhythm now comes from alternating section bg). Replace its `background` with `transparent` or delete the rule and its usages later. Keep `.eyebrow` color as `var(--indigo)` (already correct).

- [ ] **Step 5: Verify.**

Run: `grep -nE "#04040e|#07071a|#0c0c22|#11112e|rgba\(255,255,255" src/app.css` → Expected: no matches.
Run: `npm run build` → Expected: `✓ built`.
Manual: `npm run dev`, open `/` — page background is white, buttons indigo, body text dark. (Sections will still be dark until later tasks — that's expected.)

- [ ] **Step 6: Commit.**

```bash
git add src/app.css
git commit -m "feat(theme): light crisp-and-cool design tokens + global base

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Navigation (`Navigation.svelte`)

**Files:**
- Modify: `src/lib/components/Navigation.svelte` (`<style>` only; markup unchanged)

**Interfaces:**
- Consumes: tokens from Task 1.

- [ ] **Step 1: Light glass pill.** `.nav-pill` background `rgba(8,8,22,0.55)` → `rgba(255,255,255,0.7)`; border `rgba(99,102,241,0.18)` → `var(--border)`; `box-shadow` → `var(--shadow-md)`. `.nav-pill.scrolled` → `background: rgba(255,255,255,0.9); border-color: var(--border2);`.

- [ ] **Step 2: Logo + items.** `.logo-build` color → `var(--text)`. `.logo-accent` gradient (`#a5b4fc,#22d3ee`) → solid `var(--indigo)` (drop cyan); `.nav-logo:hover` drop-shadow → remove or `filter: none`. `.nav-item` color `rgba(255,255,255,0.58)` → `var(--text-muted)`; `:hover` → `var(--text)`; `.active` → `var(--text)`. Burger `span` background → `var(--text)`.

- [ ] **Step 3: Replace the lamp glow with a clean indigo pill.** The violet/pink bloom reads wrong on white. Set `.lamp` to `background: var(--indigo-soft);` and **delete** the `.lamp-bar`, `.lamp-bloom`, `.lamp-bloom--*` rules. Remove the corresponding `<div class="lamp-bar">…</div>` markup inside the `.lamp` div (lines ~141-145) so only the soft pill remains.

- [ ] **Step 4: CTA + mobile dropdown.** `.nav-cta` gradient (`#6366f1,#a855f7`) → `background: var(--indigo);`; `:hover` → `background: var(--indigo-strong); box-shadow: var(--shadow-indigo);` (drop the glow). Mobile `.nav-links` panel: background `rgba(8,8,22,0.95)` → `var(--surface)`; border → `var(--border)`; `box-shadow` → `var(--shadow-lg)`; `.nav-item.active` mobile bg → `var(--indigo-soft)`.

- [ ] **Step 5: Verify.**

Run: `grep -nE "rgba\(255,255,255|rgba\(8, ?8, ?22|#a855f7|#22d3ee|#a5b4fc" src/lib/components/Navigation.svelte` → Expected: no matches.
Run: `npm run build` → Expected: `✓ built`.
Manual: nav pill is light glass, active item is a soft indigo pill, CTA solid indigo; mobile dropdown is a white panel.

- [ ] **Step 6: Commit.**

```bash
git add src/lib/components/Navigation.svelte
git commit -m "feat(theme): light navigation (glass pill, indigo lamp, solid CTA)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Hero (`Hero.svelte`) — copy, glow→light wash, canvas recolor

**Files:**
- Modify: `src/lib/components/Hero.svelte` (canvas `draw()` colors in `<script>`; `<style>` shell/copy)

**Interfaces:**
- Consumes: tokens from Task 1.

- [ ] **Step 1: Shell + copy colors.** `.hero` background `var(--bg)` (already token, confirm white). `.hero-heading` `color: #fff` → `var(--text)`; `.accent` stays `var(--indigo)`. `.hero-sub` → `var(--text-body)`; `.hero-eyebrow`/`.hero-trust` → `var(--text-muted)`.

- [ ] **Step 2: Replace the glow wash with a fine dot-grid + faint cool radial.** Replace the `.hero-wash` rule:

```css
.hero-wash {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(circle at 1px 1px, rgba(99,102,241,0.10) 1px, transparent 0) 0 0 / 26px 26px,
    radial-gradient(ellipse 50% 45% at 50% 40%, rgba(99,102,241,0.05) 0%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 75% 65% at 50% 42%, #000 30%, transparent 80%);
          mask-image: radial-gradient(ellipse 75% 65% at 50% 42%, #000 30%, transparent 80%);
}
```

- [ ] **Step 3: Recolor the 2D line-network for white.** In the `draw()` function, change the three color literals so lines/nodes read on white (deeper indigo, low alpha):
  - line stroke (link): `rgba(99,102,241,${(1 - d / LINK) * 0.16})` → `rgba(79,70,229,${(1 - d / LINK) * 0.14})`
  - pointer link: `rgba(129,140,248,${(1 - pd / (LINK * 1.5)) * 0.4})` → `rgba(79,70,229,${(1 - pd / (LINK * 1.5)) * 0.30})`
  - node fill: `rgba(129,140,248,0.5)` → `rgba(79,70,229,0.45)`

- [ ] **Step 4: Verify.**

Run: `grep -nE "#fff\b|rgba\(129,140,248|color: white" src/lib/components/Hero.svelte` → Expected: no matches.
Run: `npm run build` → Expected: `✓ built`.
Manual: hero on white, headline dark ink with indigo accent line, faint dot-grid + subtle line-network visible but subordinate to the headline.

- [ ] **Step 5: Commit.**

```bash
git add src/lib/components/Hero.svelte
git commit -m "feat(theme): light hero (ink copy, dot-grid wash, indigo line-network)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: TrustStrip (`TrustStrip.svelte`)

**Files:** Modify: `src/lib/components/TrustStrip.svelte` (`<style>`).

- [ ] **Step 1: Apply the mapping.** Read the file; convert backgrounds → `var(--bg2)` (this strip sits between white sections), text → `--text`/`--text-body`/`--text-muted`, any divider/border → `var(--border)`, any indigo glow → removed.
- [ ] **Step 2: Verify.** Run: `grep -nE "rgba\(255,255,255|#0[0-9a-f]{5}" src/lib/components/TrustStrip.svelte` → Expected: no matches. Run: `npm run build` → `✓ built`. Manual: light strip, readable logos/labels.
- [ ] **Step 3: Commit.**

```bash
git add src/lib/components/TrustStrip.svelte
git commit -m "feat(theme): light trust strip

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: ProblemSection (`ProblemSection.svelte`)

**Files:** Modify: `src/lib/components/ProblemSection.svelte` (`<style>`; 41 color literals — the heaviest).

- [ ] **Step 1: Apply the mapping table** to every literal. Section bg → `var(--bg)`; cards → `var(--surface)` + `1px solid var(--border)` + `var(--shadow-sm)` (hover `--shadow-md`); icon/accent colors → `var(--indigo)`; **collapse any cyan/violet/pink to indigo or grey**; text → ink/body/muted; remove blurred glows.
- [ ] **Step 2: Verify.** Run: `grep -nE "rgba\(255,255,255|#22d3ee|#a855f7|#e879f9|filter: ?blur" src/lib/components/ProblemSection.svelte` → Expected: no matches. Run: `npm run build` → `✓ built`. Manual: white section, light cards with hairline borders + soft shadow, indigo-only accents.
- [ ] **Step 3: Commit.**

```bash
git add src/lib/components/ProblemSection.svelte
git commit -m "feat(theme): light problem section

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: SolutionSection (`SolutionSection.svelte`)

**Files:** Modify: `src/lib/components/SolutionSection.svelte` (`<style>`; 29 literals).

- [ ] **Step 1: Apply the mapping.** Section bg → `var(--bg2)` (alternate with the white Problem section). Cards/text/accents/glows per Task 5. Indigo-only.
- [ ] **Step 2: Verify.** Run: `grep -nE "rgba\(255,255,255|#22d3ee|#a855f7|#e879f9|filter: ?blur" src/lib/components/SolutionSection.svelte` → Expected: no matches. Run: `npm run build` → `✓ built`. Manual: section is cool-tint `--bg2`, alternating cleanly with neighbours.
- [ ] **Step 3: Commit.**

```bash
git add src/lib/components/SolutionSection.svelte
git commit -m "feat(theme): light solution section

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: ProcessSection (`ProcessSection.svelte`)

**Files:** Modify: `src/lib/components/ProcessSection.svelte` (`<style>`; 22 literals).

- [ ] **Step 1: Apply the mapping.** Section bg → `var(--bg)`. Step connectors/lines → `var(--border)` or `var(--indigo)` for the active path; numbered markers → `var(--indigo-soft)` fill + `var(--indigo)` text. Text per mapping.
- [ ] **Step 2: Verify.** Run: `grep -nE "rgba\(255,255,255|#22d3ee|#a855f7|filter: ?blur" src/lib/components/ProcessSection.svelte` → Expected: no matches. Run: `npm run build` → `✓ built`. Manual: process steps legible on white, indigo accents only.
- [ ] **Step 3: Commit.**

```bash
git add src/lib/components/ProcessSection.svelte
git commit -m "feat(theme): light process section

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 8: ManifestoSection (`ManifestoSection.svelte`)

**Files:** Modify: `src/lib/components/ManifestoSection.svelte` (`<style>`; 21 literals; note pre-existing unused `.t-*` selector warnings — leave markup, just retheme used rules).

- [ ] **Step 1: Apply the mapping.** Section bg → `var(--bg2)`. Quote/manifesto text → `var(--text)`; secondary → `var(--text-body)`. Any accent → `var(--indigo)`; remove glows.
- [ ] **Step 2: Verify.** Run: `grep -nE "rgba\(255,255,255|#22d3ee|#a855f7|filter: ?blur" src/lib/components/ManifestoSection.svelte` → Expected: no matches. Run: `npm run build` → `✓ built`. Manual: manifesto reads as elegant ink type on cool-tint bg.
- [ ] **Step 3: Commit.**

```bash
git add src/lib/components/ManifestoSection.svelte
git commit -m "feat(theme): light manifesto section

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 9: Final CTA dark block — `FinalCTA.svelte` + `ContactSection.svelte` + `SectionCanvas.svelte` + funnel

**Files:**
- Modify: `src/lib/components/FinalCTA.svelte` (remove dead `fcta-*` CSS)
- Modify: `src/lib/components/ContactSection.svelte` (the live CTA/contact UI; ensure intentional deep-dark block)
- Modify: `src/lib/components/SectionCanvas.svelte` (optional: indigo-only particles)
- Modify: `src/lib/components/funnel/*.svelte` (style for the dark surface)

**Interfaces:**
- Consumes: tokens from Task 1. `ContactSection` renders `SectionCanvas` + `LeadFunnel`.

- [ ] **Step 1: Remove dead CSS in `FinalCTA.svelte`.** It renders only `<ContactSection />`; every `fcta-*` selector is unused (svelte-check warns). Delete the entire `<style>` block (or keep only rules that target rendered markup — there is none). Keep the `<script>` import and `<ContactSection />`.

- [ ] **Step 2: Make `ContactSection` an intentional deep-dark accent block.** Read it. Its background should be deep indigo or ink (e.g. `#0B0F19` or a deep `#1E1B4B` indigo), text white, with generous padding and rounded top corners to read as a deliberate block closing the light page. Keep its heading/sub copy; ensure white-on-dark contrast. This is the ONE place dark values are allowed — do not convert them to light tokens.

- [ ] **Step 3: Recolor `SectionCanvas` to indigo-only (optional but preferred).** In the `palette` array (lines ~28-33) replace the four hues with indigo shades so the particle field matches the indigo+grey discipline:

```js
const palette = [
  new THREE.Color('#6366f1'),
  new THREE.Color('#818cf8'),
  new THREE.Color('#4f46e5'),
  new THREE.Color('#a5b4fc'),
];
```
Leave the `lineMat` indigo `0x6366f1` as-is.

- [ ] **Step 4: Style the lead funnel for the dark block.** Read `funnel/LeadFunnel.svelte`, `StepContext`, `StepService`, `StepBudgetTimeline`, `StepContact`. Since the funnel renders inside the dark CTA block, inputs/cards use translucent-on-dark: field bg `rgba(255,255,255,0.06)`, border `rgba(255,255,255,0.14)`, text white, placeholder `rgba(255,255,255,0.5)`; selected/active option → `var(--indigo)` fill or `rgba(99,102,241,0.25)` + indigo border. Submit button: `var(--indigo)` (hover `var(--indigo-strong)`).

- [ ] **Step 5: Verify.**

Run: `grep -nE "fcta-" src/lib/components/FinalCTA.svelte` → Expected: no matches (dead CSS gone).
Run: `npm run build` → Expected: `✓ built`.
Manual: the closing section is a single deep-dark block on the otherwise light page; particle field is indigo-toned; funnel fields are legible white-on-dark with indigo selected states.

- [ ] **Step 6: Commit.**

```bash
git add src/lib/components/FinalCTA.svelte src/lib/components/ContactSection.svelte src/lib/components/SectionCanvas.svelte src/lib/components/funnel
git commit -m "feat(theme): final CTA as deep-dark accent block + indigo particles + funnel

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 10: Footer (`Footer.svelte`)

**Files:** Modify: `src/lib/components/Footer.svelte` (`<style>`; 4 literals; uses GSAP — leave JS).

- [ ] **Step 1: Apply the mapping.** Footer bg → `var(--bg2)` or `var(--surface)` with a top `1px solid var(--border)`. Links → `var(--text-body)`, hover → `var(--indigo)`. Headings → `var(--text)`. Logo accent → `var(--indigo)`.
- [ ] **Step 2: Verify.** Run: `grep -nE "rgba\(255,255,255|#22d3ee|#a855f7" src/lib/components/Footer.svelte` → Expected: no matches. Run: `npm run build` → `✓ built`. Manual: footer light with hairline top border, readable links.
- [ ] **Step 3: Commit.**

```bash
git add src/lib/components/Footer.svelte
git commit -m "feat(theme): light footer

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 11: Chat widget (`ChatWidget.svelte`, `chat/MessageList.svelte`, `chat/ChatInput.svelte`)

**Files:** Modify the three files (`<style>`; ChatWidget uses GSAP — leave JS).

- [ ] **Step 1: Launcher + panel.** `ChatWidget` floating launcher and panel: surface → `var(--surface)`, border → `var(--border)`, `box-shadow: var(--shadow-lg)`. Header → `var(--surface2)` or indigo accent. Launcher button background → `var(--indigo)`.
- [ ] **Step 2: Messages.** `MessageList`: assistant bubble bg → `var(--surface2)`, text → `var(--text)`; user bubble bg → `var(--indigo)`, text → `#fff`. Timestamps/labels → `var(--text-muted)`.
- [ ] **Step 3: Input.** `ChatInput`: field bg → `var(--surface2)`, border → `var(--border)`, text → `var(--text)`, placeholder → `var(--text-muted)`; send button → `var(--indigo)` (hover `--indigo-strong`).
- [ ] **Step 4: Verify.** Run: `grep -rnE "rgba\(255,255,255|#0[0-9a-f]{5}|#22d3ee|#a855f7" src/lib/components/ChatWidget.svelte src/lib/components/chat` → Expected: no matches. Run: `npm run build` → `✓ built`. Manual: open chat — white panel, light assistant bubbles, indigo user bubbles, light input.
- [ ] **Step 5: Commit.**

```bash
git add src/lib/components/ChatWidget.svelte src/lib/components/chat
git commit -m "feat(theme): light chat widget (panel, bubbles, input)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 12: Legal pages (`terms`, `privacy-policy`)

**Files:** Modify: `src/routes/terms/+page.svelte`, `src/routes/privacy-policy/+page.svelte` (`<style>` if any; both use `Seo`).

- [ ] **Step 1: Sweep for hardcoded dark values** and convert per mapping. These pages mostly inherit global tokens; ensure body bg white, headings ink, body text `--text-body`, links `--indigo`.
- [ ] **Step 2: Verify.** Run: `grep -rnE "rgba\(255,255,255|#0[0-9a-f]{5}" src/routes/terms src/routes/privacy-policy` → Expected: no matches. Run: `npm run build` → `✓ built`. Manual: visit `/terms` and `/privacy-policy` — light, readable.
- [ ] **Step 3: Commit.**

```bash
git add src/routes/terms src/routes/privacy-policy
git commit -m "feat(theme): light legal pages

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 13: Full-site QA pass

**Files:** Any file needing a fix found during QA.

- [ ] **Step 1: Global leftover-dark sweep.** Run:

```bash
grep -rnE "rgba\(255, ?255, ?255|#04040e|#07071a|#0c0c22|#11112e|#22d3ee|#e879f9" src/lib src/routes
```
Expected: matches only inside `ContactSection.svelte` / funnel (the intentional dark block) and `SectionCanvas.svelte`. Anything else → fix in its component and re-commit.

- [ ] **Step 2: Divider check.** Confirm no dark `.divider` bands remain between sections (Task 1 neutralized `.divider`; if any section relied on it for contrast, ensure alternating `--bg`/`--bg2` reads correctly).

- [ ] **Step 3: Contrast check.** In `npm run dev`, verify body copy on every section meets AA (use browser devtools contrast or eyeball ink-on-white vs muted-on-tint). Bump any `--text-muted` used for essential copy to `--text-body`.

- [ ] **Step 4: Reduced-motion + responsive.** Toggle prefers-reduced-motion and check mobile widths (nav dropdown, hero, CTA block, chat).

- [ ] **Step 5: Final build + tests.**

Run: `npm run build` → Expected: `✓ built`.
Run: `npm test` → Expected: `21 passed`.

- [ ] **Step 6: Commit any QA fixes.**

```bash
git add -A
git commit -m "fix(theme): light-theme QA pass (contrast, leftover dark, responsive)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

- **Spec coverage:** tokens (T1), Navigation (T2), Hero incl. canvas (T3), TrustStrip (T4), Problem (T5), Solution (T6), Process (T7), Manifesto (T8), FinalCTA+ContactSection+SectionCanvas+funnel (T9), Footer (T10), chat (T11), legal (T12), QA/contrast (T13). All spec sections mapped.
- **Final CTA:** spec's deep-dark block honored in T9; SectionCanvas retained + recolored, not replaced.
- **Color discipline:** indigo+grey enforced per-task via grep gates for cyan/violet/pink.
- **Dead code:** already removed in a prior commit; T9 removes the residual dead `fcta-*` CSS.
- **Verification:** every task gates on a leftover-dark grep + `npm run build`; `npm run check` baseline noise explicitly excluded.
