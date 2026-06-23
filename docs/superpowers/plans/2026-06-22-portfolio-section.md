# Portfolio Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/portfolio` listing page and per-project detail pages that read as an experience (scroll-driven case study, count-up metrics, view-transition morphs, lightbox), plus a homepage teaser and a route-aware nav link — built on realistic placeholder data the user swaps for real content later.

**Architecture:** Project content lives in one typed module (`src/lib/portfolio.ts`) with placeholder entries and SVG placeholder images under `static/portfolio/`. SvelteKit routes render a listing grid and `[slug]` detail pages; the detail page composes a GSAP-driven pinned case study, a count-up metrics component, and a lightbox. The existing `Navigation` becomes route-aware so anchor links work off the homepage. A `+layout.svelte` `onNavigate` hook enables native View Transitions for the listing↔detail hero morph.

**Tech Stack:** SvelteKit 2.63 (runes mode), Svelte 5, GSAP 3.15 + ScrollTrigger, native View Transitions API, Vitest 4 (node env). No new dependencies.

## Global Constraints

- **No new dependencies.** Use only GSAP/ScrollTrigger (already installed) and the native View Transitions API.
- **Runes mode** — use `$props`, `$state`, `$derived`, `$effect`, `$bindable`. Read route state via `import { page } from '$app/state'`.
- **Design tokens only** — reuse `--surface`, `--surface2`, `--border`, `--border2`, `--indigo`, `--indigo-strong`, `--indigo-soft`, `--text`, `--text-body`, `--text-muted`, `--shadow-sm/md/lg`, `--section-pad`, `--container`, `--gutter`, `--display`. Add no new global CSS variables.
- **Every animation has a `prefers-reduced-motion: reduce` fallback** to a static equivalent.
- **Testing standard:** the repo unit-tests pure TypeScript only (Vitest, node env, files `src/**/*.test.ts`). Do **not** add a component/DOM test harness. Pure-logic tasks are TDD'd with Vitest; Svelte component tasks are verified with `npm run check` (svelte-check) plus a manual browser check via the `run` skill.
- **Placeholder metrics use integer `value`s** (count-up rounds with `Math.round`).
- Commit after every task with a `feat:`/`test:` message.

---

### Task 1: Portfolio data module + placeholder images

**Files:**
- Create: `src/lib/portfolio.ts`
- Create: `src/lib/portfolio.test.ts`
- Create: `static/portfolio/placeholders/shot-1.svg`
- Create: `static/portfolio/placeholders/shot-2.svg`
- Create: `static/portfolio/northwind-plumbing/hero.svg`
- Create: `static/portfolio/cape-coffee-co/hero.svg`
- Create: `static/portfolio/summit-legal/hero.svg`
- Create: `static/portfolio/tasklane-app/hero.svg`

**Interfaces:**
- Produces: `interface Project`, `interface Metric`, `interface CaseStudy`; `projects: Project[]`; `getProject(slug: string): Project | undefined`; `formatMetric(m: Metric): string`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/portfolio.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { projects, getProject, formatMetric } from './portfolio';

describe('projects data', () => {
  it('has at least 3 projects with unique slugs', () => {
    expect(projects.length).toBeGreaterThanOrEqual(3);
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every project has a hero image, at least one gallery image and at least one metric', () => {
    for (const p of projects) {
      expect(p.heroImage).toMatch(/^\/portfolio\//);
      expect(p.gallery.length).toBeGreaterThan(0);
      expect(p.metrics.length).toBeGreaterThan(0);
    }
  });

  it('has at least one featured project for the homepage teaser', () => {
    expect(projects.some((p) => p.featured)).toBe(true);
  });
});

describe('getProject', () => {
  it('returns the matching project for a known slug', () => {
    const slug = projects[0].slug;
    expect(getProject(slug)?.slug).toBe(slug);
  });

  it('returns undefined for an unknown slug', () => {
    expect(getProject('does-not-exist')).toBeUndefined();
  });
});

describe('formatMetric', () => {
  it('joins prefix, value and suffix', () => {
    expect(formatMetric({ prefix: '+', value: 140, suffix: '%', label: 'x' })).toBe('+140%');
  });

  it('omits missing prefix/suffix', () => {
    expect(formatMetric({ value: 5, label: 'x' })).toBe('5');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- portfolio`
Expected: FAIL — `Cannot find module './portfolio'`.

- [ ] **Step 3: Create the data module**

Create `src/lib/portfolio.ts`:

```ts
export interface Metric {
  prefix?: string;
  value: number;   // integer; count-up animates 0 → value
  suffix?: string;
  label: string;
}

export interface CaseStudy {
  challenge: string;
  approach: string;
  outcome: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  heroImage: string;
  gallery: string[];
  tags: string[];
  liveUrl?: string;
  featured?: boolean;
  caseStudy: CaseStudy;
  metrics: Metric[];
}

const SHOTS = ['/portfolio/placeholders/shot-1.svg', '/portfolio/placeholders/shot-2.svg'];

// NOTE: placeholder content — swap titles, copy, images and metrics for real work.
export const projects: Project[] = [
  {
    slug: 'northwind-plumbing',
    title: 'Northwind Plumbing',
    category: 'Website & Local SEO',
    year: '2026',
    summary: 'A trades website that turns local searches into booked call-outs.',
    heroImage: '/portfolio/northwind-plumbing/hero.svg',
    gallery: SHOTS,
    tags: ['SvelteKit', 'Local SEO', 'Lead Capture'],
    liveUrl: 'https://example.com',
    featured: true,
    caseStudy: {
      challenge:
        'Northwind relied on word of mouth and a dated one-page site that never showed up for "emergency plumber near me". Enquiries were unpredictable and easy to miss.',
      approach:
        'We rebuilt the site around the jobs people actually search for, wired up a quote form that lands straight in their inbox, and set up Google Business and local SEO so nearby customers find them first.',
      outcome:
        'Within three months the site ranked on page one for their core local terms and the team was fielding a steady stream of qualified call-out requests.',
    },
    metrics: [
      { prefix: '+', value: 140, suffix: '%', label: 'more enquiries in 3 months' },
      { value: 1, suffix: 'st', label: 'page Google for core terms' },
      { value: 24, suffix: '/7', label: 'quote form capture' },
    ],
  },
  {
    slug: 'cape-coffee-co',
    title: 'Cape Coffee Co.',
    category: 'Brand & Website',
    year: '2026',
    summary: 'A brand and storefront site for a growing Cape Town roastery.',
    heroImage: '/portfolio/cape-coffee-co/hero.svg',
    gallery: SHOTS,
    tags: ['Branding', 'Web Design', 'Photography'],
    liveUrl: 'https://example.com',
    featured: true,
    caseStudy: {
      challenge:
        'Great coffee, forgettable brand. Cape Coffee looked like every other roastery online and could not justify their premium price on the shelf or the screen.',
      approach:
        'We built a distinctive visual identity — logo, palette and type — then carried it into a site that tells their sourcing story and makes the beans easy to browse.',
      outcome:
        'A coherent brand that finally matches the product, with a site that lifted average order value and wholesale enquiries.',
    },
    metrics: [
      { prefix: '+', value: 32, suffix: '%', label: 'average order value' },
      { prefix: '+', value: 18, suffix: '', label: 'wholesale enquiries / mo' },
      { value: 3, suffix: 'x', label: 'time on site vs old' },
    ],
  },
  {
    slug: 'summit-legal',
    title: 'Summit Legal',
    category: 'Website & Lead Capture',
    year: '2025',
    summary: 'A credibility-first site that books consultations for a boutique firm.',
    heroImage: '/portfolio/summit-legal/hero.svg',
    gallery: SHOTS,
    tags: ['Web Design', 'Lead Capture', 'Copywriting'],
    featured: false,
    caseStudy: {
      challenge:
        'A respected firm with a website that undersold them. Prospective clients could not tell what the firm specialised in or how to start a conversation.',
      approach:
        'We restructured the site around their practice areas, sharpened the copy to speak to client problems, and added a consultation request flow with clear next steps.',
      outcome:
        'A site that reads as senior and trustworthy, with consultation requests arriving pre-qualified and ready to book.',
    },
    metrics: [
      { prefix: '+', value: 90, suffix: '%', label: 'consultation requests' },
      { value: 2, suffix: 'x', label: 'qualified leads' },
      { value: 40, suffix: '%', label: 'less admin back-and-forth' },
    ],
  },
  {
    slug: 'tasklane-app',
    title: 'TaskLane',
    category: 'Mobile App',
    year: '2025',
    summary: 'A field-service app that keeps technicians and the office in sync.',
    heroImage: '/portfolio/tasklane-app/hero.svg',
    gallery: SHOTS,
    tags: ['iOS', 'Android', 'Product Design'],
    liveUrl: 'https://example.com',
    featured: true,
    caseStudy: {
      challenge:
        'Jobs were tracked on paper and WhatsApp. Technicians double-booked, the office chased updates, and nothing was searchable after the fact.',
      approach:
        'We designed and built a cross-platform app: technicians see their day, update job status on the move, and the office gets a live view without phoning around.',
      outcome:
        'A single source of truth for every job, fewer missed appointments, and an office that finally trusts the schedule.',
    },
    metrics: [
      { value: 60, suffix: '%', label: 'fewer missed jobs' },
      { value: 4, suffix: 'hrs', label: 'admin saved / week' },
      { prefix: '+', value: 25, suffix: '%', label: 'jobs completed / day' },
    ],
  },
];

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

export const formatMetric = (m: Metric): string =>
  `${m.prefix ?? ''}${m.value}${m.suffix ?? ''}`;
```

- [ ] **Step 4: Create placeholder SVGs**

Create `static/portfolio/placeholders/shot-1.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" role="img" aria-label="Interface placeholder">
  <rect width="1200" height="750" fill="#F4F6FB"/>
  <rect x="0" y="0" width="1200" height="64" fill="#FFFFFF"/>
  <circle cx="40" cy="32" r="8" fill="#E5E8F0"/><circle cx="68" cy="32" r="8" fill="#E5E8F0"/><circle cx="96" cy="32" r="8" fill="#E5E8F0"/>
  <rect x="64" y="112" width="420" height="44" rx="8" fill="#0B0F19" opacity="0.85"/>
  <rect x="64" y="176" width="640" height="18" rx="6" fill="#7A8194" opacity="0.5"/>
  <rect x="64" y="206" width="560" height="18" rx="6" fill="#7A8194" opacity="0.35"/>
  <rect x="64" y="270" width="200" height="56" rx="28" fill="#6366F1"/>
  <rect x="64" y="380" width="340" height="300" rx="16" fill="#FFFFFF" stroke="#E5E8F0"/>
  <rect x="430" y="380" width="340" height="300" rx="16" fill="#FFFFFF" stroke="#E5E8F0"/>
  <rect x="796" y="380" width="340" height="300" rx="16" fill="#EEF0FE"/>
</svg>
```

Create `static/portfolio/placeholders/shot-2.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" role="img" aria-label="Dashboard placeholder">
  <rect width="1200" height="750" fill="#FFFFFF"/>
  <rect x="0" y="0" width="260" height="750" fill="#F4F6FB"/>
  <rect x="32" y="40" width="160" height="20" rx="6" fill="#0B0F19" opacity="0.8"/>
  <rect x="32" y="110" width="196" height="40" rx="8" fill="#EEF0FE"/>
  <rect x="32" y="162" width="196" height="40" rx="8" fill="#FFFFFF"/>
  <rect x="32" y="214" width="196" height="40" rx="8" fill="#FFFFFF"/>
  <rect x="300" y="40" width="380" height="32" rx="8" fill="#0B0F19" opacity="0.85"/>
  <rect x="300" y="120" width="260" height="160" rx="16" fill="#EEF0FE"/>
  <rect x="584" y="120" width="260" height="160" rx="16" fill="#F4F6FB"/>
  <rect x="868" y="120" width="260" height="160" rx="16" fill="#F4F6FB"/>
  <rect x="300" y="312" width="828" height="380" rx="16" fill="#F4F6FB"/>
  <rect x="332" y="540" width="80" height="120" rx="6" fill="#6366F1" opacity="0.8"/>
  <rect x="452" y="480" width="80" height="180" rx="6" fill="#6366F1" opacity="0.6"/>
  <rect x="572" y="420" width="80" height="240" rx="6" fill="#6366F1"/>
  <rect x="692" y="500" width="80" height="160" rx="6" fill="#6366F1" opacity="0.5"/>
</svg>
```

Create the four hero SVGs. Use this template, substituting the per-project `STOP-A`, `STOP-B`, and `TITLE` values below:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" role="img" aria-label="TITLE preview">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="STOP-A"/>
      <stop offset="1" stop-color="STOP-B"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="750" fill="url(#g)"/>
  <rect x="90" y="110" width="1020" height="530" rx="24" fill="#FFFFFF" opacity="0.10"/>
  <rect x="140" y="160" width="320" height="22" rx="8" fill="#FFFFFF" opacity="0.55"/>
  <text x="140" y="420" font-family="'Space Grotesk', system-ui, sans-serif" font-size="72" font-weight="700" fill="#FFFFFF">TITLE</text>
  <text x="142" y="478" font-family="system-ui, sans-serif" font-size="26" fill="#FFFFFF" opacity="0.7">Placeholder preview — replace with real screenshot</text>
</svg>
```

| File | STOP-A | STOP-B | TITLE |
|------|--------|--------|-------|
| `static/portfolio/northwind-plumbing/hero.svg` | `#6366F1` | `#06b6d4` | `Northwind Plumbing` |
| `static/portfolio/cape-coffee-co/hero.svg` | `#8b5cf6` | `#6366F1` | `Cape Coffee Co.` |
| `static/portfolio/summit-legal/hero.svg` | `#3b82f6` | `#6366F1` | `Summit Legal` |
| `static/portfolio/tasklane-app/hero.svg` | `#06b6d4` | `#8b5cf6` | `TaskLane` |

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- portfolio`
Expected: PASS (all describe blocks green).

- [ ] **Step 6: Commit**

```bash
git add src/lib/portfolio.ts src/lib/portfolio.test.ts static/portfolio
git commit -m "feat(portfolio): typed project data + placeholder content & images"
```

---

### Task 2: ProjectCard component

**Files:**
- Create: `src/lib/components/ProjectCard.svelte`

**Interfaces:**
- Consumes: `Project` from `$lib/portfolio`.
- Produces: `<ProjectCard {project} />` — a linked card to `/portfolio/<slug>` whose hero `<img>` carries `view-transition-name: hero-<slug>`.

- [ ] **Step 1: Create the component**

Create `src/lib/components/ProjectCard.svelte`:

```svelte
<script lang="ts">
  import type { Project } from '$lib/portfolio';

  let { project }: { project: Project } = $props();
  let cardEl: HTMLAnchorElement;

  function onMove(e: MouseEvent) {
    const r = cardEl.getBoundingClientRect();
    cardEl.style.setProperty('--mx', `${e.clientX - r.left}px`);
    cardEl.style.setProperty('--my', `${e.clientY - r.top}px`);
  }
</script>

<a
  class="proj-card"
  href={`/portfolio/${project.slug}`}
  bind:this={cardEl}
  onmousemove={onMove}
  aria-label={`${project.title} — ${project.category}`}
>
  <div class="card-spotlight" aria-hidden="true"></div>

  <div class="card-media">
    <img
      src={project.heroImage}
      alt={`${project.title} preview`}
      loading="lazy"
      style={`view-transition-name: hero-${project.slug}`}
    />
  </div>

  <div class="card-body">
    <div class="card-meta">
      <span class="card-cat">{project.category}</span>
      <span class="card-year">{project.year}</span>
    </div>
    <h3 class="card-title">{project.title}</h3>
    <p class="card-summary">{project.summary}</p>
    <div class="card-tags">
      {#each project.tags.slice(0, 3) as tag}
        <span class="tag">{tag}</span>
      {/each}
    </div>
    <span class="card-cta">View project →</span>
  </div>
</a>

<style>
  .proj-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    text-decoration: none;
    box-shadow: var(--shadow-sm);
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
    isolation: isolate;
  }
  .proj-card:hover {
    border-color: color-mix(in srgb, var(--indigo) 40%, transparent);
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .card-spotlight {
    position: absolute; inset: 0; z-index: 0;
    border-radius: inherit;
    background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), var(--indigo-soft), transparent 65%);
    opacity: 0; transition: opacity 0.4s; pointer-events: none;
  }
  .proj-card:hover .card-spotlight { opacity: 1; }

  .card-media {
    position: relative; z-index: 1;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
  }
  .card-media img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .proj-card:hover .card-media img { transform: scale(1.04); }

  .card-body {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; gap: 0.6rem;
    padding: 1.5rem 1.5rem 1.65rem;
  }
  .card-meta {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
    color: var(--text-muted);
  }
  .card-title {
    font-family: var(--display);
    font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em;
    color: var(--text);
  }
  .card-summary { font-size: 0.9rem; line-height: 1.6; color: var(--text-body); }
  .card-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.2rem; }
  .tag {
    font-size: 0.72rem; font-weight: 600; color: var(--text-body);
    background: var(--surface2); border: 1px solid var(--border);
    padding: 0.25rem 0.6rem; border-radius: 100px;
  }
  .card-cta {
    margin-top: 0.55rem;
    font-family: var(--display); font-size: 0.9rem; font-weight: 600;
    color: var(--indigo);
    transition: transform 0.25s;
  }
  .proj-card:hover .card-cta { transform: translateX(3px); }

  @media (prefers-reduced-motion: reduce) {
    .proj-card, .card-media img, .card-cta { transition: none !important; transform: none !important; }
    .card-spotlight { display: none; }
  }
</style>
```

- [ ] **Step 2: Verify it type-checks**

Run: `npm run check`
Expected: PASS — no errors for `ProjectCard.svelte`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/ProjectCard.svelte
git commit -m "feat(portfolio): ProjectCard with spotlight hover + view-transition hero"
```

---

### Task 3: Portfolio listing page

**Files:**
- Create: `src/routes/portfolio/+page.svelte`

**Interfaces:**
- Consumes: `projects` from `$lib/portfolio`; `<ProjectCard>`; existing `Navigation`, `AuroraBackground`, `Footer`, `Seo`.

- [ ] **Step 1: Create the listing page**

Create `src/routes/portfolio/+page.svelte`:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { projects } from '$lib/portfolio';
  import Navigation from '$lib/components/Navigation.svelte';
  import AuroraBackground from '$lib/components/AuroraBackground.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Seo from '$lib/components/Seo.svelte';

  let cardEls: HTMLElement[] = [];

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    cardEls.forEach((el, i) => {
      gsap.from(el, {
        y: 28, opacity: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%' },
        delay: (i % 3) * 0.06,
      });
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  });
</script>

<Seo
  title="Our Work | BuildSynergy Portfolio"
  description="Selected websites, apps and brands BuildSynergy has built for South African businesses — with the problem, the build and the outcome for each."
  path="/portfolio"
/>

<Navigation />
<AuroraBackground />

<main class="port">
  <header class="port-head">
    <p class="port-eyebrow">Our work</p>
    <h1 class="port-title">Projects we've shipped.</h1>
    <p class="port-sub">
      A selection of websites, apps and brands we've built for South African businesses.
      Click any project to see the problem, what we built and the outcome.
    </p>
  </header>

  <div class="port-grid">
    {#each projects as project, i}
      <div bind:this={cardEls[i]}>
        <ProjectCard {project} />
      </div>
    {/each}
  </div>
</main>

<Footer />

<style>
  .port {
    max-width: var(--container);
    margin: 0 auto;
    padding: clamp(8rem, 14vw, 11rem) var(--gutter) var(--section-pad);
    position: relative; z-index: 1;
  }
  .port-head { max-width: 720px; display: flex; flex-direction: column; gap: 1rem; margin-bottom: 3.5rem; }
  .port-eyebrow {
    font-family: var(--display); font-size: 0.85rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase; color: var(--indigo);
  }
  .port-title {
    font-size: clamp(2.4rem, 5vw, 3.6rem); font-weight: 800;
    letter-spacing: -0.04em; line-height: 1.05; color: var(--text);
  }
  .port-sub { font-size: 1.05rem; line-height: 1.7; color: var(--text-body); max-width: 600px; }

  .port-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  @media (max-width: 900px) { .port-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .port-grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 2: Verify type-check + run the page**

Run: `npm run check`
Expected: PASS.

Then start the dev server and load `/portfolio` (use the `run` skill).
Expected: header + a 3-column grid of project cards; cards reveal on scroll; hovering shows the spotlight and lift; clicking a card navigates to `/portfolio/<slug>` (will 404 until Task 9 — that's fine for now).

- [ ] **Step 3: Commit**

```bash
git add src/routes/portfolio/+page.svelte
git commit -m "feat(portfolio): listing page with animated card grid"
```

---

### Task 4: Route-aware Navigation + Work link

**Files:**
- Modify: `src/lib/components/Navigation.svelte`

**Interfaces:**
- Consumes: `page` from `$app/state`.
- Produces: nav with a `Work` route link to `/portfolio`; anchor items become real `/#id` links off the homepage.

This task replaces the `<script>` block and the `<header>` template region of `Navigation.svelte`, and adds two CSS rules. The `<style>` block is otherwise unchanged.

- [ ] **Step 1: Replace the `<script>` block**

Replace everything from `<script lang="ts">` through its closing `</script>` (lines 1–112) with:

```svelte
<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { page } from '$app/state';

  type NavItem = { name: string; id: string; type: 'anchor' | 'route'; path?: string; icon: string };

  const navItems: NavItem[] = [
    {
      name: 'Services', id: 'services', type: 'anchor',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      </svg>`,
    },
    {
      name: 'Process', id: 'process', type: 'anchor',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="5" cy="12" r="2.2" stroke="currentColor" stroke-width="1.4"/>
        <circle cx="12" cy="12" r="2.2" stroke="currentColor" stroke-width="1.4"/>
        <circle cx="19" cy="12" r="2.2" stroke="currentColor" stroke-width="1.4"/>
        <path d="M7.2 12h2.6M14.2 12h2.6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".4"/>
      </svg>`,
    },
    {
      name: 'Work', id: 'work', type: 'route', path: '/portfolio',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 6V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.5"/>
      </svg>`,
    },
    {
      name: 'Why us', id: 'why', type: 'anchor',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3l1.9 5.6L19.5 9l-4.4 3.6L16.4 18 12 14.9 7.6 18l1.3-5.4L4.5 9l5.6-.4L12 3z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
      </svg>`,
    },
  ];

  let isHome = $derived(page.url.pathname === '/');

  let activeTab = $state(navItems[0].name);
  let lampLeft  = $state(0);
  let lampWidth = $state(0);
  let pillEl:   HTMLElement;
  let linksEl:  HTMLElement;
  let itemEls:  HTMLElement[] = [];
  let scrolled  = $state(false);
  let menuOpen  = $state(false);

  function toggleMenu() { menuOpen = !menuOpen; }
  function closeMenu()  { menuOpen = false; }

  async function activate(name: string, index: number, scroll = false) {
    activeTab = name;
    if (scroll) document.querySelector(`#${navItems[index].id}`)?.scrollIntoView({ behavior: 'smooth' });
    await tick();
    moveLamp(index);
  }

  function moveLamp(index: number) {
    const el = itemEls[index];
    if (!el || !linksEl) return;
    const nr = linksEl.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    lampLeft  = er.left - nr.left;
    lampWidth = er.width;
  }

  function refreshLamp() {
    const i = navItems.findIndex(n => n.name === activeTab);
    if (i !== -1) moveLamp(i);
  }

  function go(id: string) {
    document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' });
  }

  // Keep the lamp on "Work" while on a portfolio route.
  $effect(() => {
    if (page.url.pathname.startsWith('/portfolio')) {
      activeTab = 'Work';
      tick().then(refreshLamp);
    }
  });

  onMount(() => {
    const onResize = () => requestAnimationFrame(refreshLamp);
    const onScroll = () => {
      scrolled = window.scrollY > 80;
      if (menuOpen) closeMenu();
    };
    const onDocClick = (e: MouseEvent) => {
      if (menuOpen && pillEl && !pillEl.contains(e.target as Node)) closeMenu();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu(); };

    onResize();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('click', onDocClick);
    window.addEventListener('keydown', onKey);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const i = navItems.findIndex(n => n.id === e.target.id);
          if (i !== -1) activate(navItems[i].name, i);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    tick().then(() => {
      // Scroll-spy only applies on the homepage where the sections exist.
      if (isHome) {
        moveLamp(0);
        navItems.forEach(n => {
          if (n.type !== 'anchor') return;
          const el = document.querySelector(`#${n.id}`);
          if (el) io.observe(el);
        });
      } else {
        refreshLamp();
      }
    });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('click', onDocClick);
      window.removeEventListener('keydown', onKey);
      io.disconnect();
    };
  });
</script>
```

- [ ] **Step 2: Replace the nav-links loop in the template**

Replace the `{#each navItems as item, i}` … `{/each}` block (the buttons inside `<div id="nav-links" …>`) with:

```svelte
      {#each navItems as item, i}
        {#if item.type === 'route'}
          <a
            class="nav-item"
            class:active={activeTab === item.name}
            href={item.path}
            bind:this={itemEls[i]}
            onclick={closeMenu}
            aria-current={activeTab === item.name ? 'page' : undefined}
            aria-label={item.name}
          >
            <span class="nav-icon">{@html item.icon}</span>
            <span class="nav-label">{item.name}</span>
          </a>
        {:else}
          <a
            class="nav-item"
            class:active={activeTab === item.name}
            href={`/#${item.id}`}
            bind:this={itemEls[i]}
            onclick={(e) => { if (isHome) { e.preventDefault(); activate(item.name, i, true); } closeMenu(); }}
            aria-current={activeTab === item.name ? 'page' : undefined}
            aria-label={item.name}
          >
            <span class="nav-icon">{@html item.icon}</span>
            <span class="nav-label">{item.name}</span>
          </a>
        {/if}
      {/each}
```

- [ ] **Step 3: Add link styling to `.nav-item`**

The existing `.nav-item` rule (around line 264) targets `button`. Anchors need underline removed. Add `text-decoration: none;` to the `.nav-item` rule. Find:

```css
  .nav-item {
    position: relative;
    z-index: 1;
```

Replace with:

```css
  .nav-item {
    position: relative;
    z-index: 1;
    text-decoration: none;
```

- [ ] **Step 4: Verify type-check + behaviour**

Run: `npm run check`
Expected: PASS.

Manual (run skill):
- Homepage: Services / Process / Why us still scroll-spy and scroll on click; lamp slides; `Work` appears between Process and Why us.
- Click `Work` → navigates to `/portfolio`; lamp sits on `Work`.
- On `/portfolio`, click `Services` → navigates to `/#services` (home) and scrolls to the Services section.

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/Navigation.svelte
git commit -m "feat(nav): route-aware nav with Work link to /portfolio"
```

---

### Task 5: Homepage portfolio teaser

**Files:**
- Create: `src/lib/components/PortfolioTeaser.svelte`
- Modify: `src/routes/+page.svelte`

**Interfaces:**
- Consumes: `projects` from `$lib/portfolio`; `<ProjectCard>`.

- [ ] **Step 1: Create the teaser component**

Create `src/lib/components/PortfolioTeaser.svelte`:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { projects } from '$lib/portfolio';
  import ProjectCard from './ProjectCard.svelte';

  const featured = projects.filter((p) => p.featured).slice(0, 3);

  let headingEl: HTMLElement;
  let cardEls: HTMLElement[] = [];

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(headingEl, {
      y: 18, opacity: 0, duration: 0.65, ease: 'power3.out',
      scrollTrigger: { trigger: headingEl, start: 'top 88%' },
    });
    cardEls.forEach((el, i) => {
      gsap.from(el, {
        y: 28, opacity: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
        delay: i * 0.06,
      });
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  });
</script>

<section id="work" class="teaser">
  <div class="teaser-inner">
    <div class="teaser-head" bind:this={headingEl}>
      <div>
        <p class="teaser-eyebrow">Selected work</p>
        <h2 class="teaser-title">Real businesses, real results.</h2>
      </div>
      <a class="teaser-all" href="/portfolio">View all work →</a>
    </div>

    <div class="teaser-grid">
      {#each featured as project, i}
        <div bind:this={cardEls[i]}>
          <ProjectCard {project} />
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .teaser { padding: var(--section-pad) var(--gutter); position: relative; }
  .teaser-inner { max-width: var(--container); margin: 0 auto; display: flex; flex-direction: column; gap: 3rem; }
  .teaser-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
  .teaser-eyebrow {
    font-family: var(--display); font-size: 0.85rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase; color: var(--indigo); margin-bottom: 0.6rem;
  }
  .teaser-title {
    font-size: clamp(2rem, 3.6vw, 3rem); font-weight: 800;
    letter-spacing: -0.04em; line-height: 1.06; color: var(--text);
  }
  .teaser-all {
    font-family: var(--display); font-size: 0.95rem; font-weight: 600;
    color: var(--indigo); text-decoration: none; white-space: nowrap;
    transition: transform 0.25s;
  }
  .teaser-all:hover { transform: translateX(3px); }
  .teaser-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  @media (max-width: 900px) { .teaser-grid { grid-template-columns: 1fr; } }
  @media (prefers-reduced-motion: reduce) { .teaser-all { transition: none; } }
</style>
```

- [ ] **Step 2: Insert the teaser into the homepage**

In `src/routes/+page.svelte`, add the import after the `ProcessSection` import (line 8):

```svelte
  import PortfolioTeaser  from '$lib/components/PortfolioTeaser.svelte';
```

Then in the template, find:

```svelte
  <!-- 5. Process -->
  <div class="divider"></div>
  <ProcessSection />


  <!-- 10. Why BuildSynergy -->
  <ManifestoSection />
```

Replace with:

```svelte
  <!-- 5. Process -->
  <div class="divider"></div>
  <ProcessSection />

  <!-- 6. Selected work -->
  <div class="divider"></div>
  <PortfolioTeaser />

  <!-- 10. Why BuildSynergy -->
  <ManifestoSection />
```

- [ ] **Step 3: Verify type-check + behaviour**

Run: `npm run check`
Expected: PASS.

Manual (run skill): homepage now has a "Selected work" section after Process showing 3 featured cards and a "View all work →" link to `/portfolio`; the `Work` nav lamp activates as you scroll into it.

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/PortfolioTeaser.svelte src/routes/+page.svelte
git commit -m "feat(portfolio): homepage selected-work teaser"
```

---

### Task 6: View Transitions navigation hook

**Files:**
- Modify: `src/routes/+layout.svelte`

**Interfaces:**
- Produces: native View Transition wrapping client navigations (feature-detected, reduced-motion guarded), enabling the `hero-<slug>` morph between listing and detail.

- [ ] **Step 1: Add the onNavigate hook**

In `src/routes/+layout.svelte`, update the import on line 4 from:

```svelte
  import { afterNavigate } from '$app/navigation';
```

to:

```svelte
  import { afterNavigate, onNavigate } from '$app/navigation';
```

Then after the existing `afterNavigate(...)` line (line 12), add:

```svelte
  onNavigate((navigation) => {
    if (typeof document === 'undefined' || !document.startViewTransition) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
```

- [ ] **Step 2: Verify type-check + behaviour**

Run: `npm run check`
Expected: PASS.

Manual (run skill, Chrome): from `/portfolio`, click a card — the hero image morphs/expands into the detail hero (after Task 9 exists). In a reduced-motion browser, navigation is instant with no morph. In a browser without `startViewTransition`, navigation still works normally.

- [ ] **Step 3: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "feat: enable View Transitions for portfolio hero morph"
```

---

### Task 7: OutcomeMetrics count-up component

**Files:**
- Create: `src/lib/components/OutcomeMetrics.svelte`

**Interfaces:**
- Consumes: `Metric`, `formatMetric` from `$lib/portfolio`.
- Produces: `<OutcomeMetrics {metrics} />` — a row of stats that count up once when scrolled into view (static values under reduced motion).

- [ ] **Step 1: Create the component**

Create `src/lib/components/OutcomeMetrics.svelte`:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { formatMetric, type Metric } from '$lib/portfolio';

  let { metrics }: { metrics: Metric[] } = $props();

  let rowEl: HTMLElement;
  let valueEls: HTMLElement[] = [];

  onMount(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      metrics.forEach((m, i) => { valueEls[i].textContent = formatMetric(m); });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: rowEl,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        metrics.forEach((m, i) => {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: m.value,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: () => {
              valueEls[i].textContent = `${m.prefix ?? ''}${Math.round(obj.v)}${m.suffix ?? ''}`;
            },
          });
        });
      },
    });
    return () => st.kill();
  });
</script>

<div class="metrics" bind:this={rowEl}>
  {#each metrics as m, i}
    <div class="metric">
      <span class="metric-value" bind:this={valueEls[i]}>{m.prefix ?? ''}0{m.suffix ?? ''}</span>
      <span class="metric-label">{m.label}</span>
    </div>
  {/each}
</div>

<style>
  .metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    padding: 2.5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: var(--shadow-sm);
  }
  .metric { display: flex; flex-direction: column; gap: 0.4rem; }
  .metric-value {
    font-family: var(--display);
    font-size: clamp(2.2rem, 4vw, 3rem); font-weight: 800;
    letter-spacing: -0.03em; line-height: 1; color: var(--indigo);
  }
  .metric-label { font-size: 0.9rem; line-height: 1.5; color: var(--text-body); }
  @media (max-width: 700px) { .metrics { grid-template-columns: 1fr; gap: 1.75rem; padding: 1.75rem; } }
</style>
```

- [ ] **Step 2: Verify it type-checks**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/OutcomeMetrics.svelte
git commit -m "feat(portfolio): count-up outcome metrics component"
```

---

### Task 8: ProjectLightbox component

**Files:**
- Create: `src/lib/components/ProjectLightbox.svelte`

**Interfaces:**
- Produces: `<ProjectLightbox {images} {alt} bind:open bind:index />` — full-screen gallery overlay with prev/next, keyboard (←/→/Esc), swipe, scroll-lock and initial focus.

- [ ] **Step 1: Create the component**

Create `src/lib/components/ProjectLightbox.svelte`:

```svelte
<script lang="ts">
  let {
    images,
    alt,
    open = $bindable(false),
    index = $bindable(0),
  }: { images: string[]; alt: string; open?: boolean; index?: number } = $props();

  let closeBtn: HTMLButtonElement | undefined = $state();

  function close() { open = false; }
  function next() { index = (index + 1) % images.length; }
  function prev() { index = (index - 1 + images.length) % images.length; }

  function onKey(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  }

  let startX = 0;
  function onTouchStart(e: TouchEvent) { startX = e.touches[0].clientX; }
  function onTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
  }

  $effect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
    return () => { document.body.style.overflow = ''; };
  });
</script>

<svelte:window onkeydown={onKey} />

{#if open}
  <div class="lb" role="dialog" aria-modal="true" aria-label={`${alt} gallery`}>
    <button class="lb-backdrop" aria-label="Close gallery" onclick={close}></button>

    <button class="lb-btn lb-close" bind:this={closeBtn} aria-label="Close" onclick={close}>×</button>

    {#if images.length > 1}
      <button class="lb-btn lb-prev" aria-label="Previous image" onclick={prev}>‹</button>
    {/if}

    <img
      class="lb-img"
      src={images[index]}
      alt={`${alt} — image ${index + 1} of ${images.length}`}
      ontouchstart={onTouchStart}
      ontouchend={onTouchEnd}
    />

    {#if images.length > 1}
      <button class="lb-btn lb-next" aria-label="Next image" onclick={next}>›</button>
      <div class="lb-count">{index + 1} / {images.length}</div>
    {/if}
  </div>
{/if}

<style>
  .lb {
    position: fixed; inset: 0; z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: clamp(1rem, 5vw, 4rem);
  }
  .lb-backdrop {
    position: absolute; inset: 0; border: none; cursor: zoom-out;
    background: rgba(11, 15, 25, 0.82);
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  }
  .lb-img {
    position: relative; z-index: 1;
    max-width: 100%; max-height: 100%;
    border-radius: 12px; box-shadow: var(--shadow-lg);
    object-fit: contain;
  }
  .lb-btn {
    position: absolute; z-index: 2;
    display: flex; align-items: center; justify-content: center;
    width: 48px; height: 48px; border-radius: 100px;
    background: rgba(255, 255, 255, 0.92); color: var(--text);
    border: 1px solid var(--border); cursor: pointer;
    font-size: 1.6rem; line-height: 1;
    box-shadow: var(--shadow-md);
    transition: background 0.2s, transform 0.2s;
  }
  .lb-btn:hover { background: #fff; transform: scale(1.05); }
  .lb-close { top: clamp(1rem, 3vw, 2rem); right: clamp(1rem, 3vw, 2rem); }
  .lb-prev { left: clamp(0.5rem, 3vw, 2rem); top: 50%; transform: translateY(-50%); }
  .lb-next { right: clamp(0.5rem, 3vw, 2rem); top: 50%; transform: translateY(-50%); }
  .lb-prev:hover, .lb-next:hover { transform: translateY(-50%) scale(1.05); }
  .lb-count {
    position: absolute; z-index: 2; bottom: clamp(1rem, 3vw, 2rem); left: 50%; transform: translateX(-50%);
    font-family: var(--display); font-size: 0.85rem; font-weight: 600;
    color: #fff; background: rgba(11, 15, 25, 0.6); padding: 0.35rem 0.9rem; border-radius: 100px;
  }
  @media (prefers-reduced-motion: reduce) { .lb-btn { transition: none; } }
</style>
```

- [ ] **Step 2: Verify it type-checks**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/ProjectLightbox.svelte
git commit -m "feat(portfolio): lightbox gallery overlay"
```

---

### Task 9: Project detail page (the experience)

**Files:**
- Create: `src/routes/portfolio/[slug]/+page.ts`
- Create: `src/routes/portfolio/[slug]/+page.svelte`

**Interfaces:**
- Consumes: `getProject` from `$lib/portfolio`; `<OutcomeMetrics>`, `<ProjectLightbox>`, `<FinalCTA>`, `Navigation`, `AuroraBackground`, `Footer`, `Seo`.
- Produces: `/portfolio/<slug>` route; `data.project: Project` from the load function.

- [ ] **Step 1: Create the load function**

Create `src/routes/portfolio/[slug]/+page.ts`:

```ts
import { error } from '@sveltejs/kit';
import { getProject } from '$lib/portfolio';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const project = getProject(params.slug);
  if (!project) throw error(404, 'Project not found');
  return { project };
};
```

- [ ] **Step 2: Create the detail page**

Create `src/routes/portfolio/[slug]/+page.svelte`:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import Navigation from '$lib/components/Navigation.svelte';
  import AuroraBackground from '$lib/components/AuroraBackground.svelte';
  import OutcomeMetrics from '$lib/components/OutcomeMetrics.svelte';
  import ProjectLightbox from '$lib/components/ProjectLightbox.svelte';
  import FinalCTA from '$lib/components/FinalCTA.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const project = $derived(data.project);

  // First three images drive the scroll story (hero + gallery).
  const story = $derived([project.heroImage, ...project.gallery].slice(0, 3));
  const blocks = $derived([
    { label: 'The challenge', body: project.caseStudy.challenge },
    { label: 'What we built', body: project.caseStudy.approach },
    { label: 'The outcome',   body: project.caseStudy.outcome },
  ]);

  let activeImg = $state(0);
  let csEl: HTMLElement;
  let mediaEl: HTMLElement;
  let blockEls: HTMLElement[] = [];

  // Lightbox state
  let lbOpen = $state(false);
  let lbIndex = $state(0);
  function openLightbox(i: number) { lbIndex = i; lbOpen = true; }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.create({
        trigger: csEl,
        start: 'top top',
        end: 'bottom bottom',
        pin: mediaEl,
        pinSpacing: false,
      });
      blockEls.forEach((b, i) => {
        ScrollTrigger.create({
          trigger: b,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => { if (self.isActive) activeImg = i; },
        });
      });
    });

    return () => mm.revert();
  });
</script>

<Seo
  title={`${project.title} — BuildSynergy Work`}
  description={project.summary}
  path={`/portfolio/${project.slug}`}
/>

<Navigation />
<AuroraBackground />

<main class="detail">
  <div class="detail-inner">
    <a class="back" href="/portfolio">← All work</a>

    <!-- Hero block -->
    <header class="hero">
      <div class="hero-text">
        <div class="hero-meta">
          <span>{project.category}</span><span>·</span><span>{project.year}</span>
        </div>
        <h1 class="hero-title">{project.title}</h1>
        <p class="hero-summary">{project.summary}</p>
        <div class="hero-tags">
          {#each project.tags as tag}<span class="tag">{tag}</span>{/each}
        </div>
        {#if project.liveUrl}
          <a class="visit" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit site →</a>
        {/if}
      </div>
      <div class="hero-media">
        <img src={project.heroImage} alt={`${project.title} preview`} style={`view-transition-name: hero-${project.slug}`} />
      </div>
    </header>

    <!-- Scroll-driven case study -->
    <section class="cs" bind:this={csEl}>
      <div class="cs-text">
        {#each blocks as block, i}
          <div class="cs-block" bind:this={blockEls[i]}>
            <p class="cs-label">{block.label}</p>
            <p class="cs-body">{block.body}</p>
            <img class="cs-inline-img" src={story[i] ?? story[story.length - 1]} alt={`${project.title} — ${block.label}`} />
          </div>
        {/each}
      </div>
      <div class="cs-media-col">
        <div class="cs-media" bind:this={mediaEl}>
          {#each story as src, i}
            <img class="cs-shot" class:active={activeImg === i} {src} alt={`${project.title} view ${i + 1}`} />
          {/each}
        </div>
      </div>
    </section>

    <!-- Outcome metrics -->
    <section class="metrics-wrap">
      <h2 class="section-h">The numbers</h2>
      <OutcomeMetrics metrics={project.metrics} />
    </section>

    <!-- Gallery -->
    <section class="gallery">
      <h2 class="section-h">Gallery</h2>
      <div class="gallery-grid">
        {#each project.gallery as src, i}
          <button class="gallery-item" onclick={() => openLightbox(i)} aria-label={`Open image ${i + 1}`}>
            <img {src} alt={`${project.title} screenshot ${i + 1}`} loading="lazy" />
          </button>
        {/each}
      </div>
    </section>
  </div>
</main>

<ProjectLightbox images={project.gallery} alt={project.title} bind:open={lbOpen} bind:index={lbIndex} />

<FinalCTA />
<Footer />

<style>
  .detail { position: relative; z-index: 1; }
  .detail-inner {
    max-width: var(--container); margin: 0 auto;
    padding: clamp(7rem, 12vw, 9.5rem) var(--gutter) var(--section-pad);
    display: flex; flex-direction: column; gap: clamp(4rem, 8vw, 7rem);
  }
  .back {
    font-family: var(--display); font-size: 0.9rem; font-weight: 600;
    color: var(--text-muted); text-decoration: none; width: fit-content;
    transition: color 0.2s;
  }
  .back:hover { color: var(--indigo); }

  /* Hero */
  .hero { display: grid; grid-template-columns: 1fr 1.1fr; gap: clamp(2rem, 5vw, 4rem); align-items: center; }
  .hero-text { display: flex; flex-direction: column; gap: 1.1rem; }
  .hero-meta {
    display: flex; gap: 0.5rem; font-size: 0.8rem; font-weight: 600;
    letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-muted);
  }
  .hero-title { font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.04; color: var(--text); }
  .hero-summary { font-size: 1.1rem; line-height: 1.7; color: var(--text-body); max-width: 460px; }
  .hero-tags { display: flex; flex-wrap: wrap; gap: 0.45rem; }
  .tag {
    font-size: 0.75rem; font-weight: 600; color: var(--text-body);
    background: var(--surface2); border: 1px solid var(--border);
    padding: 0.3rem 0.7rem; border-radius: 100px;
  }
  .visit {
    margin-top: 0.6rem; width: fit-content;
    font-family: var(--display); font-size: 0.95rem; font-weight: 600; color: #fff;
    background: var(--indigo); padding: 0.7rem 1.4rem; border-radius: 100px;
    text-decoration: none; transition: background 0.2s, box-shadow 0.2s;
  }
  .visit:hover { background: var(--indigo-strong); box-shadow: var(--shadow-indigo); }
  .hero-media img {
    width: 100%; border-radius: 20px; border: 1px solid var(--border);
    box-shadow: var(--shadow-lg); display: block;
  }

  /* Case study */
  .cs { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 4rem); align-items: start; }
  .cs-text { display: flex; flex-direction: column; gap: clamp(3rem, 18vh, 9rem); }
  .cs-block { display: flex; flex-direction: column; gap: 1rem; }
  .cs-label {
    font-family: var(--display); font-size: 0.8rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; color: var(--indigo);
  }
  .cs-body { font-size: clamp(1.15rem, 2vw, 1.4rem); line-height: 1.6; color: var(--text); font-weight: 500; }
  .cs-inline-img { display: none; width: 100%; border-radius: 16px; border: 1px solid var(--border); box-shadow: var(--shadow-md); }

  .cs-media-col { height: 100%; }
  .cs-media {
    position: relative; aspect-ratio: 16 / 11; width: 100%;
    border-radius: 20px; overflow: hidden; border: 1px solid var(--border);
    box-shadow: var(--shadow-lg); background: var(--surface2);
  }
  .cs-shot {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    opacity: 0; transition: opacity 0.6s ease, transform 0.6s ease; transform: scale(1.04);
  }
  .cs-shot.active { opacity: 1; transform: scale(1); }

  /* Sections */
  .section-h { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; letter-spacing: -0.03em; color: var(--text); margin-bottom: 1.75rem; }

  /* Gallery */
  .gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
  .gallery-item {
    padding: 0; border: 1px solid var(--border); border-radius: 16px; overflow: hidden;
    cursor: zoom-in; background: var(--surface2); aspect-ratio: 16 / 10;
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
  }
  .gallery-item:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: color-mix(in srgb, var(--indigo) 35%, transparent); }
  .gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* Responsive + reduced motion: drop the pinned column, show inline images */
  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; }
    .cs { grid-template-columns: 1fr; }
    .cs-text { gap: 3rem; }
    .cs-media-col { display: none; }
    .cs-inline-img { display: block; }
    .gallery-grid { grid-template-columns: 1fr; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cs-media-col { display: none; }
    .cs-inline-img { display: block; }
    .cs-shot, .gallery-item, .visit { transition: none !important; transform: none !important; }
  }
</style>
```

- [ ] **Step 3: Verify type-check + full behaviour**

Run: `npm run check`
Expected: PASS.

Manual (run skill):
- `/portfolio/northwind-plumbing` renders: back link, hero (title/category/year/tags/Visit), scroll-driven case study where the right-hand image swaps between the three shots as you scroll the three text blocks, a metrics row that counts up once on entry, a gallery grid.
- Click a gallery image → lightbox opens; ←/→ and on-screen arrows navigate; Esc/backdrop/× close; background does not scroll.
- Unknown slug `/portfolio/nope` → 404 page.
- Narrow the window below 901px (or enable reduced motion): the case study stacks with inline images (no pinning), metrics show final values immediately.

- [ ] **Step 4: Commit**

```bash
git add src/routes/portfolio/[slug]/+page.ts src/routes/portfolio/[slug]/+page.svelte
git commit -m "feat(portfolio): scroll-driven project detail page with metrics + lightbox"
```

---

### Task 10: Full-build verification

**Files:** none (verification only).

- [ ] **Step 1: Run the unit tests**

Run: `npm test`
Expected: PASS — including `src/lib/portfolio.test.ts`.

- [ ] **Step 2: Type-check the whole project**

Run: `npm run check`
Expected: PASS — no errors or warnings introduced by the new files.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds; `/portfolio` and `/portfolio/[slug]` appear in the route output with no errors.

- [ ] **Step 4: Manual smoke (run skill)**

Walk the full flow: homepage teaser → "View all work" → listing → card click (hero morph) → detail experience (pin/swap, count-up, lightbox) → "All work" back → nav "Services" from a detail page jumps home and scrolls. Confirm reduced-motion degrades gracefully.

- [ ] **Step 5: Commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix(portfolio): build/check fixes"
```

---

## Self-Review Notes

- **Spec coverage:** data model (T1), placeholder data + images (T1), listing (T3), detail with case study/gallery/tags/live link (T9), route-aware nav + Work link (T4), homepage teaser (T5), shared ProjectCard (T2), scroll-driven case study (T9), count-up metrics (T7+T9), view-transition morph (T2 names + T6 hook + T9 hero), lightbox (T8+T9), reduced-motion fallbacks (every component), verification incl. 404 + build (T9/T10). No filtering (correctly out of scope).
- **Type consistency:** `Project`/`Metric`/`CaseStudy`, `getProject`, `formatMetric`, and the `<OutcomeMetrics metrics>` / `<ProjectLightbox images alt open index>` / `<ProjectCard project>` prop names are used identically across tasks.
- **No placeholders in the plan** (project *content* is intentionally placeholder per the spec, but every step has complete, runnable code).
