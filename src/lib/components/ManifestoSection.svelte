<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  const team = [
    {
      name:     'Jonathan Theron',
      badge:    'Co-Founder',
      subtitle: 'Design & Development',
      quote:    'I believe every South African business deserves a digital presence that actually works not just looks the part. I handle the design, development and technical side of every project personally.',
      initials: 'JT',
      accent:   '#6366f1',
      glow:     'rgba(99,102,241,0.16)',
    },
    {
      name:     'Caleb Theron',
      badge:    'Co-Founder',
      subtitle: 'Strategy & Client Relations',
      quote:    'I focus on understanding what each client actually needs and making sure we deliver something that moves their business forward. The relationship does not end at launch.',
      initials: 'CT',
      accent:   '#06b6d4',
      glow:     'rgba(6,182,212,0.16)',
    },
  ];

  let sectionEl:  HTMLElement;
  let headingEl:  HTMLElement;
  let subEl:      HTMLElement;
  let cardEls:    HTMLElement[] = [];

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (headingEl) {
      const words = headingEl.textContent?.split(' ') ?? [];
      headingEl.innerHTML = words
        .map(w => `<span class="word-outer"><span class="word-inner">${w}</span></span>`)
        .join(' ');
      gsap.from(headingEl.querySelectorAll('.word-inner'), {
        y: '110%', opacity: 0, duration: 0.85, stagger: 0.04, ease: 'power4.out',
        scrollTrigger: { trigger: headingEl, start: 'top 85%' },
      });
    }

    gsap.from(subEl, {
      y: 16, opacity: 0, duration: 0.65, ease: 'power3.out',
      scrollTrigger: { trigger: subEl, start: 'top 88%' },
    });

    gsap.from(cardEls, {
      y: 32, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: cardEls[0], start: 'top 88%' },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  });
</script>

<section id="why" class="team-section" bind:this={sectionEl}>
  <div class="t-glow-l" aria-hidden="true"></div>
  <div class="t-glow-r" aria-hidden="true"></div>

  <div class="t-container">

    <!-- Header -->
    <div class="t-header">
      <h2 class="t-heading" bind:this={headingEl}>
        The team behind BuildSynergy.
      </h2>
      <p class="t-sub" bind:this={subEl}>
        Two brothers. One focused on building, one on business.
        Together we handle every project end to end from the first conversation to ongoing support.
      </p>
    </div>

    <!-- Cards -->
    <div class="t-grid">
      {#each team as member, i}
        <div
          class="t-card"
          bind:this={cardEls[i]}
          style="--accent:{member.accent}; --glow:{member.glow}"
        >
          <!-- Beam on hover -->
          <div class="t-beam" aria-hidden="true"></div>

          <!-- Photo placeholder -->
          <div class="t-photo" aria-hidden="true">
            <div class="t-photo-glow"></div>
            <!-- Silhouette SVG -->
            <svg class="t-silhouette" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <!-- Head -->
              <circle cx="60" cy="42" r="26" fill="currentColor" opacity="0.13"/>
              <!-- Shoulders -->
              <path d="M10 140 C10 100 30 82 60 82 C90 82 110 100 110 140" fill="currentColor" opacity="0.1"/>
            </svg>
            <!-- Initials fallback -->
            <span class="t-initials">{member.initials}</span>
          </div>

          <!-- Info -->
          <div class="t-info">
            <div class="t-name-row">
              <h3 class="t-name">{member.name}</h3>
              <span class="t-role-badge">{member.badge}</span>
            </div>
            <p class="t-role">{member.subtitle}</p>

          </div>

        </div>
      {/each}
    </div>

  </div>
</section>

<style>
  /* ── Shell ─────────────────────────────────────────────────────── */
  .team-section {
    position: relative;
    padding: var(--section-pad) var(--gutter);
    background: transparent;
    overflow: hidden;
  }

  .t-glow-l {
    position: absolute;
    top: 10%; left: -8%;
    width: 600px; height: 600px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 65%);
    pointer-events: none;
    animation: team-drift-l 20s ease-in-out infinite alternate;
  }
  .t-glow-r {
    position: absolute;
    bottom: 10%; right: -6%;
    width: 500px; height: 500px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 65%);
    pointer-events: none;
    animation: team-drift-r 16s ease-in-out infinite alternate;
  }

  @keyframes team-drift-l {
    from { transform: translate(0, 0) scale(1);    opacity: 1; }
    to   { transform: translate(50px, 60px) scale(1.1); opacity: 0.6; }
  }
  @keyframes team-drift-r {
    from { transform: translate(0, 0) scale(1);     opacity: 1; }
    to   { transform: translate(-40px, -50px) scale(0.9); opacity: 0.55; }
  }

  /* ── Container ─────────────────────────────────────────────────── */
  .t-container {
    position: relative; z-index: 1;
    max-width: var(--container);
    margin: 0 auto;
    display: flex; flex-direction: column; gap: 4rem;
  }

  /* ── Header ────────────────────────────────────────────────────── */
  .t-header {
    display: flex; flex-direction: column; gap: 1.2rem;
    max-width: 640px;
  }

  .t-heading {
    font-family: var(--display);
    font-size: clamp(2.2rem, 4vw, 3.8rem);
    font-weight: 800;
    letter-spacing: -0.04em; line-height: 1.05;
    color: var(--text);
  }

  .t-sub {
    font-size: 1rem;
    color: var(--text-body);
    line-height: 1.78;
    max-width: 520px;
  }

  /* ── Grid ──────────────────────────────────────────────────────── */
  .t-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
    max-width: 860px;
    margin: 0 auto;
    width: 100%;
  }

  /* ── Card ──────────────────────────────────────────────────────── */
  .t-card {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
    display: flex; flex-direction: column;
    box-shadow: var(--shadow-sm);
    transition: border-color 0.35s, transform 0.35s, box-shadow 0.35s;
    cursor: default;
    isolation: isolate;
  }
  .t-card:hover {
    border-color: color-mix(in srgb, var(--accent) 40%, transparent);
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }

  /* Top beam sweeps on hover */
  .t-beam {
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none; z-index: 1;
  }
  .t-card:hover .t-beam { transform: scaleX(1); }

  /* ── Photo placeholder ─────────────────────────────────────────── */
  .t-photo {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3;
    background:
      radial-gradient(ellipse 70% 80% at 50% 100%, var(--glow) 0%, transparent 65%),
      var(--surface2);
    display: flex; align-items: flex-end; justify-content: center;
    overflow: hidden;
    border-bottom: 1px solid var(--border);
  }

  .t-photo-glow {
    position: absolute;
    bottom: -30px; left: 50%; transform: translateX(-50%);
    width: 160px; height: 160px;
    border-radius: 50%;
    background: var(--indigo-soft);
    opacity: 0.6;
    transition: opacity 0.35s;
    pointer-events: none;
  }
  .t-card:hover .t-photo-glow { opacity: 1; }

  .t-silhouette {
    width: 72%;
    max-width: 200px;
    position: absolute;
    bottom: 0; left: 50%; transform: translateX(-50%);
    color: var(--accent);
  }

  .t-initials {
    position: absolute;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    font-family: var(--display);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    color: color-mix(in srgb, var(--accent) 35%, transparent);
    user-select: none;
    z-index: 1;
  }

  /* ── Info block ────────────────────────────────────────────────── */
  .t-info {
    display: flex; flex-direction: column; gap: 0.7rem;
    padding: 1.75rem 1.85rem 2rem;
    flex: 1;
  }

  .t-name-row {
    display: flex; align-items: center; gap: 0.75rem;
    flex-wrap: wrap;
  }

  .t-name {
    font-family: var(--display);
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    transition: color 0.2s;
  }
  .t-card:hover .t-name { color: var(--text); }

  .t-role-badge {
    font-family: var(--display);
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
    color: var(--indigo-strong);
    background: var(--indigo-soft);
    border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
    white-space: nowrap;
  }

  .t-role {
    font-size: 0.78rem;
    color: var(--text-muted);
    letter-spacing: 0.01em;
    margin-top: -0.2rem;
  }

  /* ── Word-split heading support ────────────────────────────────── */
  :global(.t-heading .word-outer) {
    display: inline-block; overflow: hidden; vertical-align: bottom;
  }
  :global(.t-heading .word-inner) { display: inline-block; }

  /* ── Responsive ────────────────────────────────────────────────── */
  @media (max-width: 720px) {
    .t-grid { grid-template-columns: 1fr; max-width: 440px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .t-card { transition: none !important; transform: none !important; }
    .t-beam, .t-photo-glow { display: none; }
  }
</style>
