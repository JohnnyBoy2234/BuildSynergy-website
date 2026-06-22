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
    // NOTE: GSAP wiring binds once on mount. If a detail->detail link (e.g. "next project")
    // is ever added, wrap the page in {#key data.project.slug} so this re-runs per slug.
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
