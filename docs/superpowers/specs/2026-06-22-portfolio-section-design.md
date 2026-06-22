# Portfolio Section — Design Spec

**Date:** 2026-06-22
**Status:** Approved, ready for implementation plan

## Goal

Add a portfolio to the BuildSynergy site: a dedicated `/portfolio` page listing real
finished projects, with a clickable detail page per project (gallery, written case
study, service/tech tags, live link). Surface featured work on the homepage via a
teaser section and add a `Work` link to the main navigation.

## Non-Goals

- No CMS / admin UI. Projects are edited by hand in a TypeScript file.
- No DB tables (existing Drizzle/Neon stack is untouched).
- No new runtime dependencies.

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
}

export const projects: Project[];
export const getProject: (slug: string) => Project | undefined;
```

- Project images live in `static/portfolio/<slug>/`.
- Real project data supplied by the user; the file ships with at least one real entry.
  Any sample placeholder entry is clearly marked for replacement.

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
- Responsive grid of `ProjectCard`s (all projects).
- GSAP scroll reveals consistent with existing sections.

### Detail — `/portfolio/[slug]`
- `+page.ts` resolves the project via `getProject`; unknown slug throws SvelteKit `error(404)`.
- Layout, top to bottom:
  - Back link ("← All work")
  - Title, category, year, tag chips, optional "Visit site" button (`liveUrl`)
  - Hero image
  - Case study in three labelled blocks: **The challenge** / **What we built** / **The outcome**
  - Gallery grid (remaining screenshots)
  - Closing CTA: reuse `<FinalCTA />` to funnel to contact
- `<Navigation />`, `<AuroraBackground />`, `<Seo>`, `<Footer />`.
- GSAP scroll reveals.

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
  sections; nav `Work` link works from both home and a detail page; anchor links from a detail
  page navigate home and scroll to the right section.

## Files Touched

**New:**
- `src/lib/portfolio.ts`
- `src/routes/portfolio/+page.svelte`
- `src/routes/portfolio/[slug]/+page.ts`
- `src/routes/portfolio/[slug]/+page.svelte`
- `src/lib/components/ProjectCard.svelte`
- `src/lib/components/PortfolioTeaser.svelte`
- `static/portfolio/<slug>/` image assets

**Modified:**
- `src/lib/components/Navigation.svelte` (route-aware + `Work` item)
- `src/routes/+page.svelte` (insert `PortfolioTeaser`)
