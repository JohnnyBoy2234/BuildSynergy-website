<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  const packages = [
    {
      id:          'starter',
      name:        'Starter Presence',
      tagline:     'For businesses that need to look professional and get online quickly.',
      recommended: false,
      features: [
        'Mobile-ready website',
        'Basic SEO setup',
        'Contact form',
        'Hosting setup',
        'Basic launch support',
      ],
      cta: 'Start with Starter',
    },
    {
      id:          'business',
      name:        'Business Presence',
      tagline:     'For businesses that want stronger lead capture and ongoing support.',
      recommended: true,
      features: [
        'Everything in Starter',
        'Quote request system',
        'Google visibility setup',
        'Monthly care plan',
        'Technical support',
        'Updates and backups',
      ],
      cta: 'Start with Business',
    },
    {
      id:          'growth',
      name:        'Growth System',
      tagline:     'For businesses ready for a more complete digital setup.',
      recommended: false,
      features: [
        'Everything in Business',
        'Advanced lead capture',
        'Analytics setup',
        'Ongoing improvements',
        'Priority support',
      ],
      cta: 'Start with Growth',
    },
  ];

  let sectionEl:   HTMLElement;
  let headerEl:    HTMLElement;
  let cardEls:     HTMLElement[] = [];

  function scrollToContact() {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  }

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

<section id="packages" class="pkg-section" bind:this={sectionEl}>
  <div class="pkg-glow-l" aria-hidden="true"></div>
  <div class="pkg-glow-r" aria-hidden="true"></div>

  <div class="pkg-container">

    <!-- Header -->
    <div class="pkg-header" bind:this={headerEl}>
      <h2 class="pkg-heading">
        Choose the Level of Support Your Business Needs.
      </h2>
      <p class="pkg-intro">
        Whether you need a simple professional presence or a stronger digital system with ongoing support, we'll help you choose the right setup.
      </p>
    </div>

    <!-- Cards -->
    <div class="pkg-grid">
      {#each packages as pkg, i}
        <div
          class="pkg-card"
          class:pkg-card--rec={pkg.recommended}
          bind:this={cardEls[i]}
          aria-label="{pkg.name} package"
        >
          <!-- Recommended glow border (pseudo-element trick via wrapper) -->
          {#if pkg.recommended}
            <div class="rec-border" aria-hidden="true"></div>
          {/if}

          <!-- Card inner content -->
          <div class="pkg-card-inner">

            <!-- Top section -->
            <div class="pkg-top">
              {#if pkg.recommended}
                <span class="rec-badge" role="img" aria-label="Recommended">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <circle cx="5" cy="5" r="4" fill="rgba(99,102,241,0.3)" stroke="rgba(99,102,241,0.6)" stroke-width="0.8"/>
                    <circle cx="5" cy="5" r="2" fill="#818cf8"/>
                  </svg>
                  Recommended
                </span>
              {:else}
                <span class="pkg-spacer" aria-hidden="true"></span>
              {/if}

              <h3 class="pkg-name">{pkg.name}</h3>
              <p class="pkg-tagline">{pkg.tagline}</p>
            </div>

            <!-- Divider -->
            <div class="pkg-rule" aria-hidden="true"></div>

            <!-- Feature list -->
            <ul class="pkg-features" aria-label="What's included">
              {#each pkg.features as feature}
                <li class="pkg-feature">
                  <svg class="feat-check" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                    <circle cx="7.5" cy="7.5" r="6.5"
                      stroke="{pkg.recommended ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.1)'}"
                      stroke-width="1"/>
                    <path d="M4.5 7.5l2 2L10.5 5.5"
                      stroke="{pkg.recommended ? '#a5b4fc' : 'rgba(255,255,255,0.4)'}"
                      stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{feature}</span>
                </li>
              {/each}
            </ul>

            <!-- CTA -->
            <div class="pkg-cta-wrap">
              <button
                class="pkg-cta"
                class:pkg-cta--primary={pkg.recommended}
                class:pkg-cta--ghost={!pkg.recommended}
                onclick={scrollToContact}
              >
                {pkg.cta}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

          </div>
        </div>
      {/each}
    </div>

    <!-- Comparison note -->
    <p class="pkg-note">
      Not sure which is right for you?
      <button class="pkg-note-link" onclick={scrollToContact}>Get in touch and we'll advise you →</button>
    </p>

  </div>
</section>

<style>
  /* ── Shell ─────────────────────────────────────────────────────── */
  .pkg-section {
    position: relative;
    padding: var(--section-pad) var(--gutter);
    background: var(--bg);
    overflow: hidden;
  }

  .pkg-glow-l {
    position: absolute;
    top: 10%; left: -8%;
    width: 600px; height: 600px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.09) 0%, transparent 65%);
    filter: blur(70px);
    pointer-events: none;
    animation: pkg-drift-l 24s ease-in-out infinite alternate;
  }
  .pkg-glow-r {
    position: absolute;
    bottom: 10%; right: -6%;
    width: 500px; height: 500px;
    background: radial-gradient(ellipse, rgba(168,85,247,0.07) 0%, transparent 65%);
    filter: blur(70px);
    animation: pkg-drift-r 18s ease-in-out infinite alternate;
    pointer-events: none;
  }

  @keyframes pkg-drift-l {
    from { transform: translate(0, 0) scale(1);       opacity: 1; }
    to   { transform: translate(55px, -45px) scale(1.1); opacity: 0.6; }
  }
  @keyframes pkg-drift-r {
    from { transform: translate(0, 0) scale(1);        opacity: 1; }
    to   { transform: translate(-45px, 55px) scale(0.9); opacity: 0.55; }
  }

  /* ── Container ─────────────────────────────────────────────────── */
  .pkg-container {
    position: relative;
    z-index: 1;
    max-width: var(--container);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 3.5rem;
  }

  /* ── Header ────────────────────────────────────────────────────── */
  .pkg-header {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    max-width: 640px;
  }

  .pkg-heading {
    font-size: clamp(2rem, 3.4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.06;
    color: var(--text);
  }

  .pkg-intro {
    font-size: 1rem;
    color: rgba(255,255,255,0.52);
    line-height: 1.72;
    max-width: 520px;
  }

  /* ── Grid ──────────────────────────────────────────────────────── */
  .pkg-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    align-items: stretch;
  }

  /* ── Card ──────────────────────────────────────────────────────── */
  .pkg-card {
    position: relative;
    border-radius: 22px;
  }

  /* Recommended card: gradient border via pseudo-wrapper */
  .pkg-card--rec {
    padding: 1.5px;
    background: linear-gradient(145deg, rgba(99,102,241,0.55), rgba(168,85,247,0.45), rgba(34,211,238,0.3));
    box-shadow: 0 0 50px rgba(99,102,241,0.12), 0 0 0 0 transparent;
    transform: translateY(-6px);
  }

  /* Subtle animated glow on recommended */
  .rec-border {
    position: absolute;
    inset: -1px;
    border-radius: 23px;
    background: linear-gradient(145deg, rgba(99,102,241,0.3), rgba(168,85,247,0.2), rgba(34,211,238,0.15));
    filter: blur(12px);
    z-index: -1;
    animation: recGlow 4s ease-in-out infinite alternate;
  }
  @keyframes recGlow {
    from { opacity: 0.6; }
    to   { opacity: 1; }
  }

  /* Inner content wrapper */
  .pkg-card-inner {
    background: rgba(7, 7, 20, 0.96);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 2.25rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
    transition: border-color 0.3s;
  }
  .pkg-card--rec .pkg-card-inner {
    border-color: transparent;
    background: rgba(9, 8, 24, 0.97);
  }
  .pkg-card:not(.pkg-card--rec):hover .pkg-card-inner {
    border-color: rgba(255,255,255,0.12);
    background: rgba(10, 10, 26, 0.98);
  }

  /* ── Top ───────────────────────────────────────────────────────── */
  .pkg-top {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .pkg-spacer { height: 22px; display: block; }

  /* Recommended badge */
  .rec-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-family: var(--display);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #a5b4fc;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.25);
    padding: 0.3rem 0.75rem;
    border-radius: 100px;
    width: fit-content;
  }

  .pkg-name {
    font-family: var(--display);
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: rgba(255,255,255,0.9);
    line-height: 1.2;
  }
  .pkg-card--rec .pkg-name { color: #fff; }

  .pkg-tagline {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.4);
    line-height: 1.65;
  }
  .pkg-card--rec .pkg-tagline { color: rgba(255,255,255,0.55); }

  /* ── Rule ──────────────────────────────────────────────────────── */
  .pkg-rule {
    height: 1px;
    background: rgba(255,255,255,0.06);
  }
  .pkg-card--rec .pkg-rule {
    background: linear-gradient(90deg, rgba(99,102,241,0.3), rgba(168,85,247,0.2), transparent);
  }

  /* ── Feature list ──────────────────────────────────────────────── */
  .pkg-features {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 1;
  }

  .pkg-feature {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
  }

  .feat-check { flex-shrink: 0; margin-top: 1px; }

  .pkg-feature span {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.48);
    line-height: 1.55;
    transition: color 0.2s;
  }
  .pkg-card--rec .pkg-feature span  { color: rgba(255,255,255,0.62); }
  .pkg-card:hover .pkg-feature span { color: rgba(255,255,255,0.6); }
  .pkg-card--rec:hover .pkg-feature span { color: rgba(255,255,255,0.75); }

  /* ── CTA ───────────────────────────────────────────────────────── */
  .pkg-cta-wrap { margin-top: auto; }

  .pkg-cta {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    font-family: var(--display);
    font-size: 0.875rem;
    font-weight: 700;
    padding: 0.9rem 1.5rem;
    border-radius: 100px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .pkg-cta svg { flex-shrink: 0; transition: transform 0.2s; }
  .pkg-cta:hover svg { transform: translateX(3px); }

  /* Primary (recommended) */
  .pkg-cta--primary {
    background: linear-gradient(135deg, var(--indigo), var(--violet));
    color: #fff;
    border: none;
    box-shadow: 0 4px 24px rgba(99,102,241,0.25);
  }
  .pkg-cta--primary:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(99,102,241,0.4);
  }

  /* Ghost (non-recommended) */
  .pkg-cta--ghost {
    background: transparent;
    color: rgba(255,255,255,0.6);
    border: 1px solid rgba(255,255,255,0.12);
  }
  .pkg-cta--ghost:hover {
    color: rgba(255,255,255,0.9);
    border-color: rgba(255,255,255,0.25);
    transform: translateY(-1px);
  }

  /* ── Comparison note ───────────────────────────────────────────── */
  .pkg-note {
    text-align: center;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.28);
  }

  .pkg-note-link {
    background: none;
    border: none;
    cursor: pointer;
    font-size: inherit;
    font-family: var(--display);
    font-weight: 600;
    color: rgba(99,102,241,0.6);
    padding: 0;
    transition: color 0.2s;
  }
  .pkg-note-link:hover { color: var(--indigo); }

  /* ── Responsive ────────────────────────────────────────────────── */
  @media (max-width: 1024px) {
    .pkg-card--rec { transform: translateY(0); }
  }

  @media (max-width: 860px) {
    .pkg-grid { grid-template-columns: 1fr; max-width: 480px; }
    .pkg-card--rec { transform: none; }
  }

  @media (max-width: 480px) {
    .pkg-grid { max-width: 100%; }
    .pkg-card-inner { padding: 1.75rem 1.5rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .rec-border { animation: none !important; }
    .pkg-card, .pkg-card-inner, .pkg-cta { transition: none !important; }
  }
</style>
