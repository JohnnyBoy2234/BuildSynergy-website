<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  const questions = [
    { num: '01', text: 'Does this business look professional?'      },
    { num: '02', text: 'Can I trust them?'                         },
    { num: '03', text: 'Are they still active?'                    },
    { num: '04', text: 'Do they look better than the competitor?'  },
    { num: '05', text: 'Is it easy to contact them?'               },
    { num: '06', text: 'Can I quickly understand what they offer?' },
  ];

  /* Per-card float rhythm duration + negative delay to start mid-cycle */
  const floatParams = [
    { dur: 3.8, del: 0.0  },
    { dur: 4.4, del: 1.35 },
    { dur: 3.5, del: 2.1  },
    { dur: 4.1, del: 0.75 },
    { dur: 3.9, del: 1.9  },
    { dur: 4.6, del: 0.45 },
  ];

  let sectionEl: HTMLElement;
  let headingEl: HTMLElement;
  let orbEl:     HTMLElement;
  let leftEls:   HTMLElement[] = [];
  let rightEls:  HTMLElement[] = [];
  let verdictEl: HTMLElement;
  let rule1El:   HTMLElement;
  let rule2El:   HTMLElement;

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

    gsap.from(orbEl, {
      scale: 0.75, opacity: 0, duration: 1.1, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: orbEl, start: 'top 82%' },
    });

    gsap.from(leftEls, {
      x: -36, opacity: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: leftEls[0], start: 'top 84%' },
    });

    gsap.from(rightEls, {
      x: 36, opacity: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: rightEls[0], start: 'top 84%' },
    });

    gsap.from([rule1El, rule2El], {
      scaleX: 0, transformOrigin: 'left', duration: 0.9, stagger: 0.1, ease: 'power3.inOut',
      scrollTrigger: { trigger: verdictEl, start: 'top 88%' },
    });

    gsap.from(verdictEl, {
      y: 22, opacity: 0, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: verdictEl, start: 'top 88%' },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  });
</script>

<section id="judging" class="judging-section" bind:this={sectionEl}>
  <div class="jdg-noise"  aria-hidden="true"></div>
  <div class="jdg-glow-l" aria-hidden="true"></div>
  <div class="jdg-glow-r" aria-hidden="true"></div>

  <div class="jdg-container">

    <!-- Header -->
    <div class="jdg-header">
      <h2 class="jdg-heading" bind:this={headingEl}>
        Customers Are Judging More Than You Think.
      </h2>
    </div>

    <!-- Orbital zone: questions float around a central evaluator orb -->
    <div class="jdg-orbit">

      <!-- Left: questions 01–03 -->
      <div class="jdg-side jdg-left">
        {#each questions.slice(0, 3) as q, i}
          <div
            class="q-card q-card--left"
            bind:this={leftEls[i]}
            style="animation-duration:{floatParams[i].dur}s; animation-delay:-{floatParams[i].del}s"
          >
            <span class="q-num">{q.num}</span>
            <p class="q-text">{q.text}</p>
            <div class="q-cursor" aria-hidden="true"><div class="cursor-bar"></div></div>
          </div>
        {/each}
      </div>

      <!-- Centre: the evaluator orb -->
      <div class="jdg-orb-wrap" bind:this={orbEl}>
        <!-- Outer halo ring spins slowly -->
        <div class="orb-halo" aria-hidden="true">
          <div class="halo-tick halo-tick-1"></div>
          <div class="halo-tick halo-tick-2"></div>
          <div class="halo-tick halo-tick-3"></div>
          <div class="halo-tick halo-tick-4"></div>
        </div>

        <div class="jdg-orb" aria-hidden="true">
          <!-- Radar sweep -->
          <div class="orb-radar"></div>
          <!-- Concentric rings -->
          <div class="orb-ring orb-ring--mid"></div>
          <div class="orb-ring orb-ring--inner"></div>
          <!-- Pulse animation ring -->
          <div class="orb-pulse"></div>
          <!-- Eye represents the customer watching -->
          <div class="orb-core">
            <svg class="orb-eye" width="48" height="32" viewBox="0 0 48 32" fill="none" aria-hidden="true">
              <path d="M2 16 C10 3 38 3 46 16 C38 29 10 29 2 16Z"
                stroke="rgba(99,102,241,0.45)" stroke-width="1.3" fill="none" stroke-linejoin="round"/>
              <circle cx="24" cy="16" r="7.5" stroke="rgba(99,102,241,0.65)" stroke-width="1.2" fill="none"/>
              <circle cx="24" cy="16" r="3" fill="rgba(99,102,241,0.9)"/>
              <circle cx="27" cy="13" r="1.2" fill="rgba(255,255,255,0.5)"/>
              <!-- Scan glint line across eye -->
              <line x1="8" y1="16" x2="40" y2="16" stroke="rgba(99,102,241,0.08)" stroke-width="0.8"/>
            </svg>
          </div>
        </div>

        <p class="orb-label" aria-hidden="true">EVALUATING</p>
      </div>

      <!-- Right: questions 04–06 -->
      <div class="jdg-side jdg-right">
        {#each questions.slice(3, 6) as q, i}
          <div
            class="q-card q-card--right"
            bind:this={rightEls[i]}
            style="animation-duration:{floatParams[i + 3].dur}s; animation-delay:-{floatParams[i + 3].del}s"
          >
            <span class="q-num">{q.num}</span>
            <p class="q-text">{q.text}</p>
            <div class="q-cursor" aria-hidden="true"><div class="cursor-bar"></div></div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Verdict -->
    <div class="jdg-verdict" bind:this={verdictEl}>
      <div class="verdict-rule" bind:this={rule1El} aria-hidden="true"></div>
      <div class="verdict-body">
        <p class="verdict-headline">If the answer is unclear, they leave.</p>
        <p class="verdict-sub">
          Not because your service is bad.<br/>
          Because your first impression did not do its job.
        </p>
      </div>
      <div class="verdict-rule" bind:this={rule2El} aria-hidden="true"></div>
    </div>

  </div>
</section>

<style>
  /* ── Shell ─────────────────────────────────────────────────────── */
  .judging-section {
    position: relative;
    padding: var(--section-pad) var(--gutter);
    background: var(--bg);
    overflow: hidden;
  }

  .jdg-noise {
    position: absolute; inset: 0; opacity: 0.016;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px; pointer-events: none;
  }
  .jdg-glow-l {
    position: absolute; top: 15%; left: -8%;
    width: 520px; height: 520px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 65%);
    filter: blur(60px); pointer-events: none;
  }
  .jdg-glow-r {
    position: absolute; bottom: 10%; right: -6%;
    width: 420px; height: 420px;
    background: radial-gradient(ellipse, rgba(168,85,247,0.07) 0%, transparent 65%);
    filter: blur(60px); pointer-events: none;
  }

  /* ── Container ─────────────────────────────────────────────────── */
  .jdg-container {
    position: relative; z-index: 1;
    max-width: var(--container);
    margin: 0 auto;
    display: flex; flex-direction: column;
    gap: 4rem;
  }

  /* ── Header ────────────────────────────────────────────────────── */
  .jdg-header { max-width: 640px; }

  .jdg-heading {
    font-size: clamp(2rem, 3.8vw, 3.4rem);
    font-weight: 800; letter-spacing: -0.04em; line-height: 1.06;
    color: var(--text);
  }

  :global(.word-outer) { display: inline-block; overflow: hidden; vertical-align: bottom; }
  :global(.word-inner) { display: inline-block; }

  /* ── Orbital layout ────────────────────────────────────────────── */
  .jdg-orbit {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 3rem;
    align-items: center;
  }

  .jdg-side {
    display: flex; flex-direction: column;
    gap: 1rem;
  }

  /* ── Question cards ────────────────────────────────────────────── */
  .q-card {
    background: rgba(7, 7, 20, 0.75);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 1rem 1.25rem;
    display: flex; align-items: flex-start;
    gap: 0.75rem;
    cursor: default;
    animation: float-card linear infinite;
    transition: border-color 0.25s, background 0.25s;
    /* Soften the animation with ease-in-out via custom cubic */
    animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1);
  }
  .q-card:hover {
    border-color: rgba(99,102,241,0.25);
    background: rgba(12, 12, 30, 0.9);
  }

  .q-card--left  { border-left:  2px solid rgba(99,102,241,0.22); }
  .q-card--right { border-right: 2px solid rgba(99,102,241,0.22); }

  .q-num {
    font-family: var(--display);
    font-size: 0.57rem; font-weight: 800;
    letter-spacing: 0.14em;
    color: rgba(99,102,241,0.5);
    flex-shrink: 0; padding-top: 0.2rem;
    transition: color 0.2s;
  }
  .q-card:hover .q-num { color: var(--indigo); }

  .q-text {
    font-family: var(--display);
    font-size: 0.875rem; font-weight: 600;
    color: rgba(255,255,255,0.55);
    line-height: 1.45; letter-spacing: -0.01em;
    flex: 1;
    transition: color 0.2s;
  }
  .q-card:hover .q-text { color: rgba(255,255,255,0.82); }

  /* Blinking cursor that appears on hover */
  .q-cursor {
    display: flex; align-items: center;
    flex-shrink: 0; padding-top: 0.2rem;
    opacity: 0; transition: opacity 0.2s;
  }
  .q-card:hover .q-cursor { opacity: 1; }

  .cursor-bar {
    width: 2px; height: 13px;
    background: rgba(99,102,241,0.7);
    border-radius: 1px;
    animation: blink 1.1s step-end infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }

  @keyframes float-card {
    0%   { transform: translateY(0px) rotate(0deg); }
    28%  { transform: translateY(-7px) rotate(-0.6deg); }
    55%  { transform: translateY(-4px) rotate(0.3deg); }
    80%  { transform: translateY(-9px) rotate(-0.4deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }

  /* ── Central orb ────────────────────────────────────────────────── */
  .jdg-orb-wrap {
    position: relative;
    display: flex; flex-direction: column;
    align-items: center; gap: 1rem;
  }

  /* Outer halo: a larger ring with tick marks that slowly rotates */
  .orb-halo {
    position: absolute;
    top: -17px; left: 50%;
    width: 238px; height: 238px;
    margin-left: -119px;
    border-radius: 50%;
    border: 1px dashed rgba(99,102,241,0.16);
    animation: spin-slow 28s linear infinite;
    pointer-events: none;
  }

  /* Small accent ticks on the halo ring */
  .halo-tick {
    position: absolute;
    width: 5px; height: 2px;
    background: rgba(99,102,241,0.5);
    border-radius: 1px;
  }
  .halo-tick-1 { top: 50%; left: -3px;  transform: translateY(-50%); }
  .halo-tick-2 { top: 50%; right: -3px; transform: translateY(-50%); }
  .halo-tick-3 { left: 50%; top: -3px;  transform: translateX(-50%) rotate(90deg); }
  .halo-tick-4 { left: 50%; bottom: -3px; transform: translateX(-50%) rotate(90deg); }

  /* Main orb circle */
  .jdg-orb {
    position: relative;
    width: 204px; height: 204px;
    border-radius: 50%;
    background: radial-gradient(circle at 42% 38%, rgba(20,20,48,0.97), rgba(6,6,16,0.99));
    border: 1px solid rgba(99,102,241,0.22);
    box-shadow:
      0 0 60px rgba(99,102,241,0.12),
      0 0 0 1px rgba(99,102,241,0.04) inset,
      inset 0 0 40px rgba(99,102,241,0.04);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  /* Radar sweep conic gradient rotating */
  .orb-radar {
    position: absolute; inset: 0;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      transparent           62%,
      rgba(99,102,241,0.04) 75%,
      rgba(99,102,241,0.16) 88%,
      rgba(99,102,241,0.03) 96%,
      transparent           100%
    );
    animation: radar-sweep 3.5s linear infinite;
    pointer-events: none;
  }

  /* Concentric guide rings */
  .orb-ring {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(99,102,241,0.1);
    pointer-events: none;
  }
  .orb-ring--mid   { inset: 30px; }
  .orb-ring--inner { inset: 58px; }

  /* Pulse ring that breathes */
  .orb-pulse {
    position: absolute;
    inset: 48px;
    border-radius: 50%;
    border: 1px solid rgba(99,102,241,0.2);
    animation: pulse-ring 2.8s ease-in-out infinite;
    pointer-events: none;
  }

  /* Eye at center */
  .orb-core {
    position: relative; z-index: 2;
    display: flex; align-items: center; justify-content: center;
  }

  .orb-eye {
    filter: drop-shadow(0 0 10px rgba(99,102,241,0.55));
    animation: eye-blink 5s ease-in-out infinite;
  }

  /* Label below the orb */
  .orb-label {
    font-family: 'Courier New', monospace;
    font-size: 0.55rem;
    letter-spacing: 0.24em;
    color: rgba(99,102,241,0.45);
    text-transform: uppercase;
    animation: label-pulse 2.4s ease-in-out infinite;
  }

  @keyframes spin-slow    { to { transform: rotate(360deg); } }
  @keyframes radar-sweep  { to { transform: rotate(360deg); } }

  @keyframes pulse-ring {
    0%, 100% { transform: scale(1);    opacity: 0.4; }
    50%       { transform: scale(1.12); opacity: 1;   }
  }

  @keyframes eye-blink {
    0%, 40%, 60%, 100% { transform: scaleY(1); }
    50%                 { transform: scaleY(0.08); }
  }

  @keyframes label-pulse {
    0%, 100% { opacity: 0.35; }
    50%       { opacity: 0.75; }
  }

  /* ── Verdict ───────────────────────────────────────────────────── */
  .jdg-verdict {
    display: grid;
    grid-template-columns: 80px 1fr 80px;
    align-items: center; gap: 2.5rem;
    padding: 1rem 0;
  }

  .verdict-rule {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1));
  }
  .verdict-rule:last-child {
    background: linear-gradient(90deg, rgba(255,255,255,0.1), transparent);
  }

  .verdict-body { text-align: center; display: flex; flex-direction: column; gap: 0.75rem; }

  .verdict-headline {
    font-family: var(--display);
    font-size: clamp(1.5rem, 2.6vw, 2.2rem);
    font-weight: 700; letter-spacing: -0.03em;
    color: rgba(255,255,255,0.92); line-height: 1.1;
  }

  .verdict-sub {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.38);
    line-height: 1.7;
  }

  /* ── Responsive ────────────────────────────────────────────────── */
  @media (max-width: 860px) {
    .jdg-orbit {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .jdg-orb-wrap { order: -1; margin: 0 auto; }
    .jdg-side { gap: 0.85rem; }
    .q-card { animation-play-state: paused; } /* Stop float on mobile for performance */
  }

  @media (max-width: 540px) {
    .jdg-container { gap: 3rem; }
    .jdg-verdict { grid-template-columns: 30px 1fr 30px; gap: 1rem; }
    .verdict-headline { font-size: clamp(1.3rem, 6vw, 1.7rem); }
  }

  @media (prefers-reduced-motion: reduce) {
    .q-card, .orb-radar, .orb-pulse, .orb-halo, .orb-eye, .orb-label, .cursor-bar {
      animation: none !important;
    }
  }
</style>
