<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  const projects = [
    {
      id:          'mzanzihomes',
      name:        'MzanziHomes',
      status:      'In Testing',
      url:         'https://mzanzihomes.com',
      image:       '/mzanzihomes-preview.png',
      category:    'Real Estate · Two-Sided Marketplace',
      tagline:     'Find Your Perfect Home in South Africa',
      description:
        'A full-build rental marketplace connecting tenants directly with landlords — verified listings, zero agent fees, and a simpler, safer way to rent. Currently in final testing ahead of public launch.',
      tags: ['Full Website Build', 'Zero Agent Fees', 'Verified Listings', 'Landlord Tools'],
    },
  ];

  let sectionEl: HTMLElement;
  let headerEl:  HTMLElement;
  let cardEls:   HTMLElement[] = [];

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(headerEl.children, {
      y: 18, opacity: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: headerEl, start: 'top 86%' },
    });

    gsap.from(cardEls, {
      y: 32, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: cardEls[0], start: 'top 88%' },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  });
</script>

<section id="work" class="proj-section" bind:this={sectionEl}>
  <div class="proj-glow-l" aria-hidden="true"></div>
  <div class="proj-glow-r" aria-hidden="true"></div>

  <div class="proj-container">

    <!-- Header -->
    <div class="proj-header" bind:this={headerEl}>
      <span class="eyebrow">Our Work</span>
      <h2 class="proj-heading">
        Real Builds for Real Businesses.
      </h2>
      <p class="proj-intro">
        A look at what we've built. More case studies are on the way as our projects go live.
      </p>
    </div>

    <!-- Grid -->
    <div class="proj-grid">
      {#each projects as proj, i}
        <a
          class="proj-card"
          href={proj.url}
          target="_blank"
          rel="noopener noreferrer"
          bind:this={cardEls[i]}
          aria-label="View {proj.name}"
        >
          <div class="proj-media">
            <img src={proj.image} alt="{proj.name} website preview" loading="lazy" />
            <span class="proj-status">{proj.status}</span>
          </div>

          <div class="proj-body">
            <span class="proj-category">{proj.category}</span>
            <h3 class="proj-name">{proj.name}</h3>
            <p class="proj-tagline">{proj.tagline}</p>
            <p class="proj-desc">{proj.description}</p>

            <ul class="proj-tags" aria-label="Project highlights">
              {#each proj.tags as tag}
                <li>{tag}</li>
              {/each}
            </ul>

            <span class="proj-link">
              Preview the build
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
        </a>
      {/each}
    </div>

  </div>
</section>

<style>
  /* ── Shell ─────────────────────────────────────────────────────── */
  .proj-section {
    position: relative;
    padding: var(--section-pad) var(--gutter);
    background: var(--bg);
    overflow: hidden;
  }

  .proj-glow-l {
    position: absolute;
    top: 5%; left: -8%;
    width: 550px; height: 550px;
    background: radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 65%);
    filter: blur(70px);
    pointer-events: none;
  }
  .proj-glow-r {
    position: absolute;
    bottom: 5%; right: -6%;
    width: 480px; height: 480px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.09) 0%, transparent 65%);
    filter: blur(70px);
    pointer-events: none;
  }

  /* ── Container ─────────────────────────────────────────────────── */
  .proj-container {
    position: relative;
    z-index: 1;
    max-width: var(--container);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  /* ── Header ────────────────────────────────────────────────────── */
  .proj-header {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    max-width: 640px;
  }

  .proj-heading {
    font-size: clamp(2rem, 3.4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.06;
    color: var(--text);
  }

  .proj-intro {
    font-size: 1rem;
    color: rgba(255,255,255,0.52);
    line-height: 1.72;
    max-width: 520px;
  }

  /* ── Grid ──────────────────────────────────────────────────────── */
  .proj-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  /* ── Card ──────────────────────────────────────────────────────── */
  .proj-card {
    display: flex;
    flex-direction: column;
    background: rgba(7, 7, 20, 0.96);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 22px;
    overflow: hidden;
    text-decoration: none;
    transition: border-color 0.3s, transform 0.25s, box-shadow 0.3s;
  }
  .proj-card:hover {
    border-color: rgba(99,102,241,0.3);
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.15);
  }

  .proj-media {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: var(--surface);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .proj-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    transition: transform 0.4s ease;
  }
  .proj-card:hover .proj-media img {
    transform: scale(1.03);
  }

  .proj-status {
    position: absolute;
    top: 0.9rem;
    right: 0.9rem;
    font-family: var(--display);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #fcd34d;
    background: rgba(8, 8, 22, 0.85);
    border: 1px solid rgba(252,211,77,0.3);
    padding: 0.35rem 0.75rem;
    border-radius: 100px;
    backdrop-filter: blur(8px);
  }

  /* ── Body ──────────────────────────────────────────────────────── */
  .proj-body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.75rem 1.85rem 2rem;
  }

  .proj-category {
    font-family: var(--display);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--cyan);
  }

  .proj-name {
    font-family: var(--display);
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #fff;
  }

  .proj-tagline {
    font-size: 0.9rem;
    font-weight: 600;
    color: rgba(255,255,255,0.55);
  }

  .proj-desc {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.48);
    line-height: 1.65;
  }

  .proj-tags {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0.4rem 0 0.6rem;
    padding: 0;
  }
  .proj-tags li {
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(255,255,255,0.6);
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 0.3rem 0.7rem;
    border-radius: 100px;
  }

  .proj-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--display);
    font-size: 0.85rem;
    font-weight: 700;
    color: #a5b4fc;
    margin-top: auto;
  }
  .proj-link svg { transition: transform 0.2s; }
  .proj-card:hover .proj-link svg { transform: translateX(3px); }

  /* ── Responsive ────────────────────────────────────────────────── */
  @media (max-width: 640px) {
    .proj-grid { grid-template-columns: 1fr; }
    .proj-body { padding: 1.5rem 1.4rem 1.75rem; }
  }
</style>
