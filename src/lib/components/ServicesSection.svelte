<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  const services = [
    {
      title: 'Website Design & Development',
      desc:  'Modern, mobile-ready websites built around your business, services and customers.',
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="24" height="17" rx="2" stroke="currentColor" stroke-width="1.4"/>
        <path d="M2 9h24" stroke="currentColor" stroke-width="1.2" opacity=".4"/>
        <circle cx="5.5" cy="6.5" r="1"  fill="currentColor" opacity=".4"/>
        <circle cx="8.5" cy="6.5" r="1"  fill="currentColor" opacity=".4"/>
        <circle cx="11.5" cy="6.5" r="1" fill="currentColor" opacity=".4"/>
        <path d="M8 13.5h12M8 16.5h8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".35"/>
        <path d="M10 25h8M14 21v4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg>`,
      featured: true,
    },
    {
      title: 'Managed Hosting',
      desc:  'Reliable hosting managed through BuildSynergy, using trusted third-party infrastructure providers.',
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 5c-4.4 0-8 1.8-8 4s3.6 4 8 4 8-1.8 8-4-3.6-4-8-4z" stroke="currentColor" stroke-width="1.4"/>
        <path d="M6 9v5c0 2.2 3.6 4 8 4s8-1.8 8-4V9" stroke="currentColor" stroke-width="1.4"/>
        <path d="M6 14v5c0 2.2 3.6 4 8 4s8-1.8 8-4v-5" stroke="currentColor" stroke-width="1.4"/>
        <circle cx="19.5" cy="8"  r="1.2" fill="currentColor" opacity=".6"/>
        <circle cx="19.5" cy="13" r="1.2" fill="currentColor" opacity=".6"/>
      </svg>`,
      featured: false,
    },
    {
      title: 'Lead Capture Forms',
      desc:  'Make it easy for customers to contact you, request quotes and send enquiries.',
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="3" width="20" height="22" rx="2" stroke="currentColor" stroke-width="1.4"/>
        <path d="M9 9h10M9 13h10M9 17h6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".4"/>
        <circle cx="20" cy="19" r="4.5" fill="var(--bg)" stroke="currentColor" stroke-width="1.3"/>
        <path d="M18.5 19h3M20 17.5v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      </svg>`,
      featured: false,
    },
    {
      title: 'Local SEO Setup',
      desc:  'We structure your online presence so nearby customers can find and understand your business more easily.',
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="11" r="6" stroke="currentColor" stroke-width="1.4"/>
        <path d="M14 5v6l3.5 3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity=".45"/>
        <path d="M10 17.5C8.5 19.5 8 21 8 22s1 2 6 2 6-1 6-2-0.5-2.5-2-4.5"
          stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        <circle cx="14" cy="11" r="2" fill="currentColor" opacity=".25"/>
      </svg>`,
      featured: false,
    },
    {
      title: 'Monthly Website Care',
      desc:  'Updates, support, backups, checks and improvements to keep your business looking professional.',
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="22" height="20" rx="2" stroke="currentColor" stroke-width="1.4"/>
        <path d="M3 11h22" stroke="currentColor" stroke-width="1.2" opacity=".35"/>
        <path d="M9 3v4M19 3v4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M10 16.5l2.5 2.5L18 13.5"
          stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      featured: false,
    },
  ];

  let sectionEl:   HTMLElement;
  let headerEl:    HTMLElement;
  let cardEls:     HTMLElement[] = [];
  let footerEl:    HTMLElement;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(headerEl.children, {
      y: 20, opacity: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: headerEl, start: 'top 86%' },
    });

    gsap.from(cardEls, {
      y: 26, opacity: 0, duration: 0.65, stagger: 0.09, ease: 'power3.out',
      scrollTrigger: { trigger: cardEls[0], start: 'top 88%' },
    });

    gsap.from(footerEl, {
      y: 16, opacity: 0, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: footerEl, start: 'top 92%' },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  });
</script>

<section id="services" class="svc-section" bind:this={sectionEl}>
  <div class="svc-glow-tl" aria-hidden="true"></div>
  <div class="svc-glow-br" aria-hidden="true"></div>

  <div class="svc-container">

    <!-- Header -->
    <div class="svc-header" bind:this={headerEl}>
      <div class="svc-eyebrow-row">
        <span class="managed-badge" aria-label="Fully managed service">
          <span class="managed-dot" aria-hidden="true"></span>
          Fully Managed
        </span>
      </div>
      <h2 class="svc-heading">
        Everything Your Business Needs to Look Sharp and Stay Visible.
      </h2>
    </div>

    <!-- Cards -->
    <div class="svc-grid">
      {#each services as s, i}
        <div class="svc-card" class:svc-card--featured={s.featured} bind:this={cardEls[i]}>

          <!-- Icon -->
          <div class="svc-icon-wrap">
            <span class="svc-icon">{@html s.icon}</span>
          </div>

          <!-- Text -->
          <div class="svc-text">
            <h3 class="svc-title">{s.title}</h3>
            <p class="svc-desc">{s.desc}</p>
          </div>

          <!-- Included indicator -->
          <div class="svc-included" aria-label="Included in package">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="6" stroke="rgba(99,102,241,0.3)" stroke-width="1"/>
              <path d="M4.5 7l2 2L9.5 5" stroke="rgba(99,102,241,0.65)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Included</span>
          </div>

          <!-- Corner accent visible on featured card + on hover -->
          <div class="svc-corner-accent" aria-hidden="true"></div>
        </div>
      {/each}
    </div>

    <!-- Section footer -->
    <div class="svc-footer" bind:this={footerEl}>
      <div class="svc-footer-rule" aria-hidden="true"></div>
      <p class="svc-footer-text">
        All services are handled by BuildSynergy one point of contact for your entire digital presence.
      </p>
      <div class="svc-footer-rule" aria-hidden="true"></div>
    </div>

  </div>
</section>

<style>
  /* ── Shell ─────────────────────────────────────────────────────── */
  .svc-section {
    position: relative;
    padding: var(--section-pad) var(--gutter);
    background: var(--bg2);
    overflow: hidden;
  }

  .svc-glow-tl {
    position: absolute;
    top: -5%; left: -5%;
    width: 600px; height: 600px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.09) 0%, transparent 65%);
    filter: blur(70px);
    pointer-events: none;
  }
  .svc-glow-br {
    position: absolute;
    bottom: -5%; right: -5%;
    width: 500px; height: 500px;
    background: radial-gradient(ellipse, rgba(168,85,247,0.07) 0%, transparent 65%);
    filter: blur(70px);
    pointer-events: none;
  }

  /* ── Container ─────────────────────────────────────────────────── */
  .svc-container {
    position: relative;
    z-index: 1;
    max-width: var(--container);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }

  /* ── Header ────────────────────────────────────────────────────── */
  .svc-header {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    max-width: 660px;
  }

  .svc-eyebrow-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  /* Managed badge */
  .managed-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-family: var(--display);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(74,222,128,0.85);
    background: rgba(74,222,128,0.07);
    border: 1px solid rgba(74,222,128,0.18);
    padding: 0.3rem 0.7rem;
    border-radius: 100px;
  }

  .managed-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 6px rgba(74,222,128,0.7);
    animation: managedPulse 2.4s ease-in-out infinite;
  }
  @keyframes managedPulse {
    0%, 100% { opacity: 1;   transform: scale(1);   }
    50%       { opacity: 0.5; transform: scale(0.75); }
  }

  .svc-heading {
    font-size: clamp(2rem, 3.5vw, 3.1rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.07;
    color: var(--text);
  }

  /* ── Grid ──────────────────────────────────────────────────────── */
  /*
    Desktop: featured card spans 2 of 5 col-units; other 4 each span 1.
    Implemented as 4-col grid: featured = span 2, others = span 1.
    Row 1: featured(2) + card2(1) + card3(1) = 4
    Row 2: card4(1)   + card5(1)             = 2  → use auto-fill
  */
  .svc-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  /* ── Card base ─────────────────────────────────────────────────── */
  .svc-card {
    position: relative;
    background: rgba(6, 6, 18, 0.9);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 2rem 1.85rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    cursor: default;
    overflow: hidden;
    transition: border-color 0.3s, background 0.3s, transform 0.3s;
  }

  .svc-card:hover {
    border-color: rgba(99,102,241,0.3);
    background: rgba(10, 10, 26, 0.98);
    transform: translateY(-3px);
  }

  /* Subtle inner gradient that lifts on hover */
  .svc-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 90% 60% at 15% 0%, rgba(99,102,241,0.1), transparent 65%);
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
    border-radius: inherit;
  }
  .svc-card:hover::before { opacity: 1; }

  /* Featured card: spans 2 columns, distinct treatment */
  .svc-card--featured {
    grid-column: span 2;
    background: rgba(8, 7, 22, 0.92);
    border-color: rgba(99,102,241,0.18);
    box-shadow: 0 0 40px rgba(99,102,241,0.06);
  }
  .svc-card--featured::before { opacity: 0.6; }
  .svc-card--featured:hover {
    border-color: rgba(99,102,241,0.38);
    transform: translateY(-4px);
    box-shadow: 0 8px 40px rgba(99,102,241,0.1);
  }

  /* Top-edge accent on featured; animated on others */
  .svc-corner-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--indigo), var(--violet), transparent);
    border-radius: 20px 20px 0 0;
    opacity: 0;
    transform: scaleX(0);
    transform-origin: left;
    transition: opacity 0.3s, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .svc-card--featured .svc-corner-accent {
    opacity: 1;
    transform: scaleX(1);
  }
  .svc-card:not(.svc-card--featured):hover .svc-corner-accent {
    opacity: 1;
    transform: scaleX(0.8);
  }

  /* ── Icon ──────────────────────────────────────────────────────── */
  .svc-icon-wrap {
    width: 54px; height: 54px;
    border-radius: 16px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.3s, background 0.3s;
  }
  .svc-card:hover .svc-icon-wrap {
    border-color: rgba(99,102,241,0.25);
    background: rgba(99,102,241,0.06);
  }
  .svc-card--featured .svc-icon-wrap {
    background: rgba(99,102,241,0.08);
    border-color: rgba(99,102,241,0.2);
  }

  .svc-icon {
    display: flex;
    color: rgba(255,255,255,0.45);
    transition: color 0.25s;
  }
  .svc-card:hover .svc-icon         { color: rgba(255,255,255,0.7); }
  .svc-card--featured .svc-icon     { color: rgba(165,180,252,0.8); }

  /* ── Text ──────────────────────────────────────────────────────── */
  .svc-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .svc-title {
    font-family: var(--display);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.3;
    color: rgba(255,255,255,0.78);
    transition: color 0.2s;
  }
  .svc-card:hover .svc-title         { color: rgba(255,255,255,0.95); }
  .svc-card--featured .svc-title     { font-size: 1.1rem; color: rgba(255,255,255,0.88); }

  .svc-desc {
    font-size: 0.86rem;
    color: rgba(255,255,255,0.38);
    line-height: 1.7;
    transition: color 0.2s;
  }
  .svc-card:hover .svc-desc    { color: rgba(255,255,255,0.55); }
  .svc-card--featured .svc-desc { color: rgba(255,255,255,0.48); }

  /* ── Included indicator ────────────────────────────────────────── */
  .svc-included {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: auto;
  }

  .svc-included span {
    font-family: var(--display);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(99,102,241,0.45);
    transition: color 0.2s;
  }
  .svc-card:hover .svc-included span { color: rgba(99,102,241,0.75); }

  /* ── Footer ────────────────────────────────────────────────────── */
  .svc-footer {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 2rem;
  }

  .svc-footer-rule {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07));
  }
  .svc-footer-rule:last-child {
    background: linear-gradient(90deg, rgba(255,255,255,0.07), transparent);
  }

  .svc-footer-text {
    font-family: var(--display);
    font-size: 0.8rem;
    font-weight: 500;
    color: rgba(255,255,255,0.28);
    text-align: center;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }

  /* ── Responsive ────────────────────────────────────────────────── */
  @media (max-width: 1024px) {
    .svc-grid { grid-template-columns: repeat(2, 1fr); }
    .svc-card--featured { grid-column: span 2; }
  }

  @media (max-width: 640px) {
    .svc-grid { grid-template-columns: 1fr; }
    .svc-card--featured { grid-column: span 1; }
    .svc-container { gap: 3rem; }
    .svc-footer { grid-template-columns: 1fr; gap: 0.75rem; }
    .svc-footer-rule { display: none; }
    .svc-footer-text { white-space: normal; }
    .svc-eyebrow-row { flex-wrap: wrap; }
  }

  @media (prefers-reduced-motion: reduce) {
    .managed-dot { animation: none !important; }
    .svc-card, .svc-corner-accent, .svc-card::before { transition: none !important; }
  }
</style>
