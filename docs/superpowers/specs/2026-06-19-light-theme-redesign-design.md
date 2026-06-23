# Light Theme Redesign — "Crisp & Cool"

**Date:** 2026-06-19
**Status:** Approved design, pending implementation plan

## Goal

Convert the BuildSynergy marketing site from its current deep navy/indigo dark
theme to a beautiful, elegant **light theme**. The chosen direction is
**"Crisp & cool"**: pure white backgrounds with cool grey-blue tints, sharp
contrast, indigo as the single accent — Linear/Vercel light-mode energy.

## Direction Decisions (locked)

- **Aesthetic:** Crisp & cool (pure white + cool grey-blue tints, indigo accent).
- **Visuals:** Replace dark glow/glass treatments with light-native equivalents
  (soft cool gradients, hairline borders, low-opacity shadows). Recolor the hero
  2D line-network for white; do not add new 3D.
- **Color discipline:** Indigo + grey only. Collapse the decorative cyan / violet
  / pink accents to a single indigo accent on neutral grey. This restraint is
  what makes the result elegant rather than templated.
- **Final CTA:** Intentional deep dark accent block (deep indigo or ink panel,
  white text) — one high-contrast block to close an otherwise light page.
- **Scope:** Full live site — homepage sections, nav, footer, chat widget, lead
  funnel, and legal pages.
- **Typography:** Unchanged — Space Grotesk (display) + Inter (body). Geometric
  sans suits the crisp direction.

## Key Finding — what is actually live

Two canvases render on the live site:

1. The Hero's lightweight **2D line-network** (`Hero.svelte`).
2. A **Three.js particle field** (`SectionCanvas.svelte`), reached via
   `FinalCTA.svelte` → `ContactSection.svelte` → `SectionCanvas`. `FinalCTA` is a
   thin wrapper that just renders `<ContactSection />` (its own `fcta-*` styles
   are dead/unused). So `ContactSection` is the real closing/contact section and
   `SectionCanvas` + the `three` dependency **are live**.

The other Three.js scenes (`HeroScene`, `ThreeScene`, `SynergyCanvas`) and the
old Vite-SPA tree (`index.html` → `src/main.ts` → `src/App.svelte` and its
`src/lib/*` template components) plus the unused sections (`ServicesSection`,
`JudgingSection`, `ValueSection`, `TeamSection`) were genuinely dead.

### Dead code removed (done)

Deleted in this pass (verified with `npm run build` + `npm test`, both pass):

- Old Vite SPA: `index.html`, `src/main.ts`, `src/App.svelte`
- Template/SPA leftovers: `src/lib/{Header,Hero,Contact,Counter,FeatureSection,
  ThreeScene,SynergyCanvas,ContactSection}.svelte`, `src/lib/SynergyCore.ts`
- Unused components: `src/lib/components/{HeroScene,ValueSection,JudgingSection,
  ServicesSection,TeamSection}.svelte`
- Unused data: `src/lib/data/{team,services}.ts` (dir removed)
- Template assets: `src/assets/{vite,svelte}.svg`

`three` stays in `package.json` (used by the live `SectionCanvas`). `src/assets/
hero.png` is unreferenced but left in place (brand asset, not code).

### Live components in scope

- `Navigation.svelte`
- `Hero.svelte` (incl. its 2D line-network canvas)
- `TrustStrip.svelte`
- `ProblemSection.svelte`
- `SolutionSection.svelte`
- `ProcessSection.svelte`
- `ManifestoSection.svelte`
- `FinalCTA.svelte` (wrapper) + `ContactSection.svelte` (real CTA/contact UI)
- `SectionCanvas.svelte` (Three.js particle field inside ContactSection)
- `Footer.svelte`
- `ChatWidget.svelte`, `chat/MessageList.svelte`, `chat/ChatInput.svelte`
- `funnel/LeadFunnel.svelte`, `funnel/StepContext.svelte`,
  `funnel/StepService.svelte`, `funnel/StepBudgetTimeline.svelte`,
  `funnel/StepContact.svelte`
- `routes/terms/+page.svelte`, `routes/privacy-policy/+page.svelte`
- `app.css` (global tokens + base)

## Design

### 1. Design tokens (`app.css`)

The dark palette is ~70% tokenized. Rewriting the tokens flips everything keyed
to variables automatically. New palette:

```
--bg         #FFFFFF   page white
--bg2        #F7F9FC   cool tint (alternating sections)
--surface    #FFFFFF   cards
--surface2   #F4F6FB   inputs / raised
--tint       #EEF1F8   subtle fills

--border     #E5E8F0   hairline
--border2    #D4D9E6   hover / stronger

--text       #0B0F19   ink (headings)
--text-body  #4A5163   body
--text-muted #7A8194   muted

--indigo         #6366F1   accent (kept)
--indigo-strong  #4F46E5   hover / deep
--indigo-soft    #EEF0FE   tinted accent fills (chips, active states)
```

Glows are replaced by shadows — the core dark→light move:

```
--shadow-sm     0 1px 2px  rgba(16,24,40,0.05)
--shadow-md     0 4px 16px rgba(16,24,40,0.08)
--shadow-lg     0 12px 32px rgba(16,24,40,0.10)
--shadow-indigo 0 8px 24px rgba(99,102,241,0.18)   (CTA hover lift)
```

Base/global changes:

- Remove the dark `body::before` ambient radial → clean white (optionally a
  whisper-faint cool wash, very low opacity).
- `.text-gradient`: retune white→cyan to `ink → indigo`
  (`linear-gradient(135deg, #0B0F19, #4F46E5)`) — refined and fully legible.
- `.card`: glass → white + hairline border + `--shadow-sm`; hover lifts to
  `--shadow-md` + `--border2`.
- `.divider`: remove the dark gradient blend. Section rhythm instead comes from
  **alternating `--bg` / `--bg2` section backgrounds**.
- `.btn`: indigo background unchanged; hover → `--indigo-strong` +
  `--shadow-indigo`. `.btn--ghost`: light `--border2` + `--text-body`, hover →
  indigo border + ink text.
- `.section-wash`: lower-opacity indigo radial, or replace with a subtle cool
  tint.
- `.eyebrow`: indigo on white (already fine).
- Keep the reduced-motion block.

### 2. Navigation

- Pill: dark glass → light glass `rgba(255,255,255,0.7)` + `backdrop-filter:
  blur` + hairline border + `--shadow-md`. Scrolled → opaquer white + stronger
  shadow.
- Logo: `.logo-build` → ink; `.logo-accent` → indigo (solid or
  indigo→indigo-strong gradient; drop cyan).
- Nav items: white-alpha → `--text-muted` (rest) / `--text` (active/hover).
- **Lamp indicator:** the violet/pink bloom glow reads wrong on white →
  **replace with a clean indigo pill (`--indigo-soft`) or a crisp indigo
  underline bar** for the active item.
- CTA: gradient indigo→violet → solid indigo; hover → `--shadow-indigo`.
- Hamburger lines → ink. Mobile dropdown → white panel + border + `--shadow-lg`.

### 3. Hero

- Background → white.
- **2D line-network recolor:** deepen line/node color so it reads on white (use
  indigo `--indigo-strong` at low alpha; keep the edge mask fade). It stays
  subtle and never competes with the headline.
- Replace the indigo glow `--hero-wash` with a **faint cool radial and/or a fine
  dot-grid** behind the headline.
- Heading `#fff` → `--text`; `.accent` stays indigo; sub → `--text-body`; trust
  line → `--text-muted`.

### 4. Content sections (TrustStrip, Problem, Solution, Process, Manifesto)

- Convert hardcoded dark / glass / glow values → light tokens.
- Alternate `--bg` / `--bg2` backgrounds for vertical rhythm.
- Cards → white + hairline border + shadow.
- **Collapse cyan / violet / pink to indigo + grey.** Only keep a non-indigo hue
  where it carries real meaning (none expected; default to indigo).
- Any indigo glow → soft `--indigo-soft` fill or a shadow.

### 5. Final CTA — deep dark accent block

The closing section is `ContactSection.svelte` (rendered via the `FinalCTA`
wrapper). It already contains the `SectionCanvas` particle field + the lead
funnel. Keep it as the **intentional deep dark accent block** — deep indigo / ink
background, white text, one high-contrast block closing the otherwise light page.

Because it stays dark, the `SectionCanvas` particle field continues to read well
and is **retained** (optionally simplified to indigo-only particles to match the
indigo+grey discipline). The lead funnel inputs inside this block are styled for
the dark surface (translucent fields, white text, indigo selected states). The
dead `fcta-*` CSS in `FinalCTA.svelte` should be removed during this task.

### 6. Chat widget + lead funnel

- `ChatWidget` launcher + panel: dark → white surface, hairline border,
  `--shadow-lg`.
- `MessageList`: assistant bubbles light (`--surface2`), user bubbles indigo with
  white text.
- `ChatInput`: light field (`--surface2` + border), indigo send.
- Funnel steps: inputs → `--surface2` + border; selected/active states →
  `--indigo-soft` fill + indigo border/text.

### 7. Legal pages

`terms` and `privacy-policy` inherit the new tokens. Sweep for any hardcoded dark
values and convert.

## Execution Order

1. Rewrite `app.css` tokens + base/global rules (largest single win).
2. `Navigation.svelte`.
3. `Hero.svelte` (copy colors + canvas recolor + glow→light wash).
4. Content sections: `TrustStrip`, `ProblemSection`, `SolutionSection`,
   `ProcessSection`, `ManifestoSection`.
5. `FinalCTA.svelte` + `ContactSection.svelte` (dark accent block; remove dead
   `fcta-*` CSS; optionally recolor `SectionCanvas` to indigo-only; style funnel
   for the dark surface).
6. `Footer.svelte`.
7. `ChatWidget` + `chat/*` + `funnel/*`.
8. Legal pages.
9. Full visual pass / contrast + accessibility check.

## Out of Scope

- Dead code listed under "Dead code removed" — already deleted, not restyled.
- The live `SectionCanvas` Three.js scene is retained (kept on the dark Final CTA
  block); it is not replaced, only optionally recolored to indigo-only.
- Copywriting changes (text content stays as-is).
- Layout/IA restructuring — this is a visual re-theme, not a re-architecture.

## Success Criteria

- Every live surface renders in the light "crisp & cool" theme with no leftover
  dark backgrounds, glass, or glows.
- Single indigo accent; no stray cyan/violet/pink on live surfaces.
- Text meets WCAG AA contrast against its background (ink/body/muted verified).
- Hero line-network is visible but subordinate to the headline on white.
- Final CTA is a deep high-contrast block.
- `npm run check` passes; existing tests still pass.
