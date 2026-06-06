<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  const benefits = [
    {
      num:   '01',
      title: 'You Look More Credible',
      desc:  'A clean, modern online presence tells customers your business is serious before they ever speak to you.',
      accent: '#6366f1',
      glow:   'rgba(99,102,241,0.15)',
      icon: `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <path d="M13 3L5 6.5V13c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V6.5L13 3z"
          stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M9 13l2.5 2.5L17 10"
          stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    },
    {
      num:   '02',
      title: 'You Become Easier to Contact',
      desc:  'Clear contact details, enquiry forms and strong calls-to-action make it simple for customers to take the next step.',
      accent: '#22d3ee',
      glow:   'rgba(34,211,238,0.13)',
      icon: `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <path d="M4 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z"
          stroke="currentColor" stroke-width="1.4"/>
        <path d="M4 8l9 7 9-7"
          stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    },
    {
      num:   '03',
      title: 'You Stop Depending Only on Social Media',
      desc:  'Facebook and Instagram are useful, but they are not fully yours. Your own digital presence gives your business a stronger foundation.',
      accent: '#a855f7',
      glow:   'rgba(168,85,247,0.13)',
      icon: `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <circle cx="8"  cy="13" r="3.5" stroke="currentColor" stroke-width="1.4"/>
        <circle cx="18" cy="8"  r="3.5" stroke="currentColor" stroke-width="1.4"/>
        <circle cx="18" cy="18" r="3.5" stroke="currentColor" stroke-width="1.4"/>
        <path d="M11.4 11.3l3.2-2M11.4 14.7l3.2 2"
          stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M15 8h5M15 18h5" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity=".35"/>
      </svg>`,
    },
    {
      num:   '04',
      title: 'You Capture More Enquiries',
      desc:  'Your site becomes more than a brochure. It becomes a lead system designed to turn visitors into calls, emails and quote requests.',
      accent: '#6366f1',
      glow:   'rgba(99,102,241,0.15)',
      icon: `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <path d="M5 5h16l-3 8H8L5 5z"
          stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M8 13l-1.5 5h13l-1.5-5"
          stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
        <circle cx="13" cy="21" r="1.5" fill="currentColor" opacity=".5"/>
      </svg>`,
    },
    {
      num:   '05',
      title: 'You Get Ongoing Support',
      desc:  'We don\'t disappear after launch. We manage hosting, updates, technical care and improvements so your online presence stays sharp.',
      accent: '#4ade80',
      glow:   'rgba(74,222,128,0.11)',
      icon: `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <circle cx="13" cy="13" r="9" stroke="currentColor" stroke-width="1.4"/>
        <path d="M13 5.5v3M13 17.5v3M5.5 13h3M17.5 13h3"
          stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity=".4"/>
        <circle cx="13" cy="13" r="3" stroke="currentColor" stroke-width="1.4"/>
        <path d="M10.5 10.5L8 8M15.5 15.5L18 18"
          stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity=".35"/>
      </svg>`,
    },
  ];

  let sectionEl:  HTMLElement;
  let headingEl:  HTMLElement;
  let cardEls:    HTMLElement[] = [];

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (headingEl) {
      const words = headingEl.textContent?.split(' ') ?? [];
      headingEl.innerHTML = words
        .map(w => `<span class="word-outer"><span class="word-inner">${w}</span></span>`)
        .join(' ');
      gsap.from(headingEl.querySelectorAll('.word-inner'), {
        y: '110%', opacity: 0, duration: 0.75, stagger: 0.035, ease: 'power4.out',
        scrollTrigger: { trigger: headingEl, start: 'top 85%' },
      });
    }

    gsap.from(cardEls, {
      y: 28, opacity: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: cardEls[0], start: 'top 88%' },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  });
</script>

<section id="value" class="value-section" bind:this={sectionEl}>
  <div class="val-glow-l" aria-hidden="true"></div>
  <div class="val-glow-r" aria-hidden="true"></div>

  <div class="val-container">

    <div class="val-header">
      <h2 class="val-heading" bind:this={headingEl}>
        What Changes When Your Business Looks the Part.
      </h2>
    </div>

    <div class="val-grid">
      {#each benefits as b, i}
        <div
          class="val-card"
          class:val-card--wide={i >= 3}
          bind:this={cardEls[i]}
          style="--accent: {b.accent}; --glow: {b.glow}"
        >
          <!-- Top: icon + number -->
          <div class="card-top">
            <div class="card-icon-wrap">
              <div class="card-icon-glow" aria-hidden="true"></div>
              <span class="card-icon">{@html b.icon}</span>
            </div>
            <span class="card-num" aria-hidden="true">{b.num}</span>
          </div>

          <!-- Content -->
          <div class="card-content">
            <h3 class="card-title">{b.title}</h3>
            <p class="card-desc">{b.desc}</p>
          </div>

          <!-- Bottom accent line reveals on hover -->
          <div class="card-line" aria-hidden="true"></div>
        </div>
      {/each}
    </div>

  </div>
</section>

<style>
  /* ── Shell ─────────────────────────────────────────────────────── */
  .value-section {
    position: relative;
    padding: var(--section-pad) var(--gutter);
    background: var(--bg);
    overflow: hidden;
  }

  .val-glow-l {
    position: absolute;
    bottom: 5%; left: -8%;
    width: 550px; height: 550px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 65%);
    filter: blur(70px);
    pointer-events: none;
  }
  .val-glow-r {
    position: absolute;
    top: 5%; right: -6%;
    width: 450px; height: 450px;
    background: radial-gradient(ellipse, rgba(168,85,247,0.07) 0%, transparent 65%);
    filter: blur(70px);
    pointer-events: none;
  }

  /* ── Container ─────────────────────────────────────────────────── */
  .val-container {
    position: relative;
    z-index: 1;
    max-width: var(--container);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }

  /* ── Header ────────────────────────────────────────────────────── */
  .val-header {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    max-width: 600px;
  }

  .val-heading {
    font-size: clamp(2rem, 3.5vw, 3.1rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.07;
    color: var(--text);
  }

  /* ── Grid ──────────────────────────────────────────────────────── */
  /* Row 1: 3 equal cards. Row 2: 2 wider cards. */
  .val-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  /* Last 2 cards span wider in a sub-grid row */
  .val-card--wide {
    grid-column: span 1;
  }
  /* Reflow last 2 onto their own row at 2-col */
  .val-grid::after {
    content: '';
    display: none;
  }

  /* ── Card ──────────────────────────────────────────────────────── */
  .val-card {
    position: relative;
    background: rgba(7, 7, 20, 0.85);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 2rem 1.85rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    cursor: default;
    overflow: hidden;
    transition: border-color 0.3s, background 0.3s, transform 0.3s;
  }

  .val-card:hover {
    border-color: color-mix(in srgb, var(--accent) 35%, transparent);
    background: rgba(10, 10, 26, 0.95);
    transform: translateY(-3px);
  }

  /* Ambient glow that blooms on hover */
  .val-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 20% 0%, var(--glow), transparent 65%);
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
    border-radius: inherit;
  }
  .val-card:hover::before { opacity: 1; }

  /* ── Card top ──────────────────────────────────────────────────── */
  .card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .card-icon-wrap {
    position: relative;
    width: 48px; height: 48px;
    border-radius: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.3s;
    flex-shrink: 0;
  }
  .val-card:hover .card-icon-wrap {
    border-color: color-mix(in srgb, var(--accent) 30%, transparent);
  }

  .card-icon-glow {
    position: absolute;
    inset: -6px;
    border-radius: 18px;
    background: var(--glow);
    filter: blur(8px);
    opacity: 0;
    transition: opacity 0.35s;
  }
  .val-card:hover .card-icon-glow { opacity: 1; }

  .card-icon {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    color: var(--accent);
    opacity: 0.7;
    transition: opacity 0.25s;
  }
  .val-card:hover .card-icon { opacity: 1; }

  .card-num {
    font-family: var(--display);
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    color: rgba(255,255,255,0.15);
    padding-top: 0.15rem;
    transition: color 0.2s;
  }
  .val-card:hover .card-num {
    color: color-mix(in srgb, var(--accent) 50%, transparent);
  }

  /* ── Card content ──────────────────────────────────────────────── */
  .card-content {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    flex: 1;
  }

  .card-title {
    font-family: var(--display);
    font-size: 1.02rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.3;
    color: rgba(255,255,255,0.78);
    transition: color 0.2s;
  }
  .val-card:hover .card-title { color: rgba(255,255,255,0.95); }

  .card-desc {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.38);
    line-height: 1.7;
    transition: color 0.2s;
  }
  .val-card:hover .card-desc { color: rgba(255,255,255,0.56); }

  /* ── Bottom accent line ────────────────────────────────────────── */
  .card-line {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), transparent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 0 0 20px 20px;
  }
  .val-card:hover .card-line { transform: scaleX(0.7); }

  /* ── Responsive ────────────────────────────────────────────────── */

  /* Force last 2 cards into a 2-col row on desktop */
  @media (min-width: 901px) {
    .val-grid {
      grid-template-columns: repeat(6, 1fr);
    }
    /* First 3 cards: 2 cols each (out of 6) */
    .val-card:nth-child(1),
    .val-card:nth-child(2),
    .val-card:nth-child(3) { grid-column: span 2; }
    /* Last 2 cards: 3 cols each */
    .val-card:nth-child(4),
    .val-card:nth-child(5) { grid-column: span 3; }
  }

  @media (max-width: 900px) {
    .val-grid { grid-template-columns: repeat(2, 1fr); }
    .val-card--wide { grid-column: span 1; }
  }

  @media (max-width: 560px) {
    .val-grid { grid-template-columns: 1fr; }
    .val-container { gap: 3rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .val-card, .card-icon-glow, .card-line, .val-card::before {
      transition: none !important; animation: none !important;
    }
  }
</style>
