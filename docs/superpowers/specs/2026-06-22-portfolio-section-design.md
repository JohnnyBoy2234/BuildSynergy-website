# Portfolio Section — Design Spec

**Date:** 2026-06-22
**Status:** Approved, ready for implementation plan

## Goal

Add a portfolio to the BuildSynergy site: a dedicated `/portfolio` page listing
projects, with a clickable detail page per project that reads as an *experience* —
a scroll-driven case study (gallery, narrative, service/tech tags, live link), with
count-up outcome metrics and view-transition morphs between listing and detail.
Surface featured work on the homepage via a teaser section and add a `Work` link to
the main navigation.

**Built with realistic placeholder data first** so the design can be judged before
real content exists. The user swaps placeholder projects + images for real ones later;
no code changes required — only `src/lib/portfolio.ts` and `static/portfolio/`.

## Non-Goals

- No CMS / admin UI. Projects are edited by hand in a TypeScript file.
- No DB tables (existing Drizzle/Neon stack is untouched).
- No new runtime dependencies (GSAP/ScrollTrigger and the native View Transitions API
  cover the experience layer).
- No filterable/searchable listing grid (deferred — listing is a clean animated grid).

## Data Model

Single typed module: `src/lib/portfolio.ts`

```ts
export interface Project {
  slug: string;          // URL segment: /portfolio/<slug>
  title: string;
  category: string;      // e.g. "Website Design & SEO"
  year: string;
  summary: string;       // one-liner for cards / listing
  heroImage: string;     // /portfolio/<slug>/hero.webp
  gallery: string[];     // additional screenshots
  tags: string[];        // ["SvelteKit", "Local SEO", ...]
  liveUrl?: string;      // optional "Visit site"
  featured?: boolean;    // surfaces in homepage teaser
  caseStudy: {
    challenge: string;
    approach: string;
    outcome: string;
  };
  metrics: Metric[];     // animated count-up outcome stats
}

export interface Metric {
  prefix?: string;       // e.g. "+", "R"
  value: number;         // numeric target, count-up animates 0 → value
  suffix?: string;       // e.g. "%", "k", "s"
  label: string;         // e.g. "more enquiries in 3 months"
}

export const projects: Project[];
export const getProject: (slug: string) => Project | undefined;
```

- Ships with **3–4 realistic placeholder projects** (varied categories: web build, SEO,
  app, branding) so the design reads as real. Placeholder images are committed under
  `static/portfolio/<slug>/` (simple generated/sample images, clearly replaceable).
- The user later edits this file + swaps images to publish real work — no other changes.
- `metrics` is count-up-friendly by construction (numeric `value` + prefix/suffix), so a
  metric like `+140%` is `{ prefix: '+', value: 140, suffix: '%', label: '…' }`.

## Routes & Pages

```
src/routes/portfolio/
  +page.svelte          listing — grid of all projects
  [slug]/
    +page.ts            load: getProject(slug); error(404) on miss
    +page.svelte        detail page
```

### Listing — `/portfolio`
- `<Navigation />`, `<AuroraBackground />`, `<Seo>`, `<Footer />` for continuity with the site.
- Heading + intro line.
- Responsive grid of `ProjectCard`s (all projects), GSAP scroll reveals consistent with existing sections.
- Each card's hero image carries a `view-transition-name` (`hero-<slug>`) so it morphs into the
  detail hero on navigation.

### Detail — `/portfolio/[slug]` (the experience)
- `+page.ts` resolves the project via `getProject`; unknown slug throws SvelteKit `error(404)`.
- Layout, top to bottom:
  - Back link ("← All work")
  - **Hero block:** title, category, year, tag chips, optional "Visit site" button (`liveUrl`), and
    the large hero image carrying the matching `view-transition-name` (`hero-<slug>`).
  - **Scroll-driven case study:** the three blocks (**The challenge** / **What we built** /
    **The outcome**) presented as a two-column scroll story — narrative text scrolls on one side
    while a screenshot column **pins and parallaxes**, swapping the visible shot per block via
    GSAP ScrollTrigger. Collapses to single-column stacked (no pin) on mobile.
  - **Outcome metrics:** the `metrics` array rendered as count-up stats that animate 0 → value
    when scrolled into view.
  - **Gallery:** grid of remaining screenshots; clicking any opens the lightbox.
  - Closing CTA: reuse `<FinalCTA />` to funnel to contact.
- `<Navigation />`, `<AuroraBackground />`, `<Seo>`, `<Footer />`.

## Experience Layer

The portfolio's distinguishing interactions, all on existing tooling (GSAP + native View
Transitions), each with a `prefers-reduced-motion` fallback to a static equivalent.

1. **Scroll-driven case study** (detail page): GSAP ScrollTrigger pins the imagery column and
   cross-fades/parallaxes screenshots as the reader moves through challenge → build → outcome.
   Reduced motion / mobile: plain stacked text + images, no pin.

2. **Count-up outcome metrics:** GSAP tweens each `Metric` from 0 to `value` (respecting
   prefix/suffix) when the stats row enters the viewport, once. Reduced motion: render final
   values immediately.

3. **View-transition morph** (listing ↔ detail): `onNavigate` in `+layout.svelte` wraps
   navigation in `document.startViewTransition` (feature-detected; no-op fallback otherwise).
   Shared `view-transition-name: hero-<slug>` on the card hero and the detail hero makes the
   image morph across the navigation. Guarded behind `prefers-reduced-motion`.

4. **Lightbox** — new `src/lib/components/ProjectLightbox.svelte`: click a gallery image to open
   a full-screen zoomable overlay with prev/next, keyboard (←/→/Esc) and swipe support, focus
   trap, and background scroll lock. Dependency-free.

## Navigation (route-aware refactor)

`src/lib/components/Navigation.svelte` becomes route-aware while preserving current homepage behaviour:

- Add a `Work` item to `navItems`, typed with `type: 'route' | 'anchor'`.
- `$derived` flag for "are we on `/`" from `$page.url.pathname`.
  - On `/`: anchor items scroll (current behaviour); lamp + IntersectionObserver scroll-spy run as today.
  - Off `/`: anchor items render as real links (`/#services`, `/#process`, `/#why`) that navigate home then scroll; scroll-spy/IO is skipped; `Work` is the active lamp item.
- `Work` is always a real route link to `/portfolio`.
- Backwards-compatible: the homepage experience is unchanged.
- Four desktop items (Services, Process, Work, Why us) — fits the pill; mobile dropdown already stacks.

## Homepage Teaser

New `src/lib/components/PortfolioTeaser.svelte`:
- Section with `id="work"`, heading ("Selected work") + intro line.
- Renders `projects.filter(p => p.featured)` capped at 3, using the shared `ProjectCard`.
- "View all work →" button to `/portfolio`.
- Inserted into `src/routes/+page.svelte` between `ProcessSection` and `ManifestoSection`, wrapped in the existing `.divider` pattern.

## Shared Component

`src/lib/components/ProjectCard.svelte`:
- Spotlight-hover card lifted from the `SolutionSection` pattern (`--accent`/`--glow` vars, cursor-tracking spotlight, top beam sweep, hover lift).
- Props: `project: Project`.
- Wraps content in `<a href="/portfolio/{project.slug}">`.
- Used by both the listing page and the homepage teaser so card styling lives in one place.

## Styling

- Reuse existing tokens only — no new globals: `--surface`, `--border`, `--indigo`,
  `--text`, `--text-body`, `--shadow-*`, `--section-pad`, `--container`, `--gutter`, `--display`.
- Detail-page case-study labels reuse the small-caps label treatment seen in the legal pages' section headers.
- Scoped `<style>` blocks per component, matching existing convention.
- `prefers-reduced-motion` honoured as in existing sections.

## Verification

- Unit: `getProject` returns the correct project for a known slug and `undefined` for an unknown one.
- `+page.ts` 404s on unknown slug.
- Typecheck / `npm run build` passes (the `Project` type guards the data).
- Manual (run skill): `/portfolio` lists projects; cards link through; detail page renders all
  sections; the scroll-driven case study pins/swaps imagery; metrics count up once on scroll;
  the hero image morphs on listing ↔ detail navigation; the lightbox opens, navigates, and closes;
  nav `Work` link works from both home and a detail page; anchor links from a detail page navigate
  home and scroll to the right section.
- Reduced motion: with `prefers-reduced-motion: reduce`, the pin/parallax, count-up, and view
  transition all degrade to static — content is fully readable and final metric values show.

## Files Touched

**New:**
- `src/lib/portfolio.ts`
- `src/routes/portfolio/+page.svelte`
- `src/routes/portfolio/[slug]/+page.ts`
- `src/routes/portfolio/[slug]/+page.svelte`
- `src/lib/components/ProjectCard.svelte`
- `src/lib/components/PortfolioTeaser.svelte`
- `src/lib/components/ProjectLightbox.svelte`
- `static/portfolio/<slug>/` placeholder image assets

**Modified:**
- `src/lib/components/Navigation.svelte` (route-aware + `Work` item)
- `src/routes/+page.svelte` (insert `PortfolioTeaser`)
- `src/routes/+layout.svelte` (View Transitions `onNavigate` hook)
