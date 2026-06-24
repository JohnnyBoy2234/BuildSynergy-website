<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  const team: {
    name: string; badge: string; subtitle: string; quote: string;
    initials: string; accent: string; glow: string; photo?: string;
  }[] = [
    {
      name:     'Jonathan Theron',
      badge:    'Co-Founder',
      subtitle: 'Design & Development',
      quote:    'I believe every South African business deserves a digital presence that actually works not just looks the part. I handle the design, development and technical side of every project personally.',
      initials: 'JT',
      accent:   '#6366f1',
      glow:     'rgba(99,102,241,0.16)',
      photo:    '/team/jonathan-theron.jpg',
    },
    {
      name:     'Caleb Theron',
      badge:    'Co-Founder',
      subtitle: 'Strategy & Client Relations',
      quote:    'I focus on understanding what each client actually needs and making sure we deliver something that moves their business forward. The relationship does not end at launch.',
      initials: 'CT',
      accent:   '#06b6d4',
      glow:     'rgba(6,182,212,0.16)',
      photo:    '/team/caleb-theron.jpg',
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
        The founders behind BuildSynergy.
      </h2>
      <p class="t-sub" bind:this={subEl}>
        We are more than developers. We are strategic growth partners. We combine cutting edge
        technology, AI driven innovation and continuous optimisation to inspire confidence and drive
        measurable results. Our commitment doesn’t end at launch: proactive support and long term
        strategy keep your business scaling and ahead of the competition. Our vision is to be one of
        Africa’s leading website and app development companies, doing work that makes clients say,
        “This is exactly what you’ve been looking for.”
      </p>
    </div>

    <!-- Founders -->
    <div class="t-members">
      {#each team as member, i}
        <article
          class="t-member"
          bind:this={cardEls[i]}
          style="--accent:{member.accent}; --glow:{member.glow}"
        >
          <div class="t-avatar">
            {#if member.photo}
              <img class="t-photo" src={member.photo} alt={member.name} loading="lazy" />
            {:else}
              <svg class="t-silhouette" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="60" cy="42" r="26" fill="currentColor" opacity="0.16"/>
                <path d="M10 140 C10 100 30 82 60 82 C90 82 110 100 110 140" fill="currentColor" opacity="0.12"/>
              </svg>
              <span class="t-initials">{member.initials}</span>
            {/if}
          </div>

          <div class="t-info">
            <div class="t-name-row">
              <h3 class="t-name">{member.name}</h3>
              <span class="t-role-badge">{member.badge}</span>
            </div>
            <p class="t-role">{member.subtitle}</p>
          </div>
        </article>
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
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: clamp(2.5rem, 6vw, 6rem);
    align-items: start;
  }

  /* ── Header (left) ─────────────────────────────────────────────── */
  .t-header {
    display: flex; flex-direction: column; gap: 1.2rem;
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

  /* ── Members (right, stacked) ──────────────────────────────────── */
  .t-members { display: flex; flex-direction: column; }

  .t-member {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1.75rem;
    align-items: center;
    padding: 2rem 0;
    border-top: 1px solid var(--border);
  }
  .t-member:first-child { border-top: none; padding-top: 0; }

  /* Portrait picture */
  .t-photo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .t-avatar {
    position: relative;
    width: 200px; height: 240px;
    border-radius: 18px;
    overflow: hidden;
    flex-shrink: 0;
    background:
      radial-gradient(ellipse 85% 80% at 50% 112%, var(--glow) 0%, transparent 62%),
      var(--surface2);
    border: 1px solid var(--border);
    transition: border-color 0.3s;
  }
  .t-member:hover .t-avatar {
    border-color: color-mix(in srgb, var(--accent) 50%, transparent);
  }
  .t-silhouette {
    position: absolute;
    width: 78%;
    bottom: 0; left: 50%; transform: translateX(-50%);
    color: var(--accent);
  }
  .t-initials {
    position: absolute;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    font-family: var(--display);
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: color-mix(in srgb, var(--accent) 40%, transparent);
    user-select: none;
  }

  /* Info */
  .t-info { display: flex; flex-direction: column; gap: 0.5rem; min-width: 0; }
  .t-name-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
  .t-name {
    font-family: var(--display);
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
  }
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
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 600;
  }

  /* ── Word-split heading support ────────────────────────────────── */
  :global(.t-heading .word-outer) {
    display: inline-block; overflow: hidden; vertical-align: bottom;
  }
  :global(.t-heading .word-inner) { display: inline-block; }

  /* ── Responsive ────────────────────────────────────────────────── */
  @media (max-width: 860px) {
    .t-container { grid-template-columns: 1fr; }
    .t-header { position: static; }
  }
  @media (max-width: 480px) {
    .t-member { grid-template-columns: 1fr; gap: 1rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .t-member, .t-avatar { transition: none !important; transform: none !important; }
  }
</style>
