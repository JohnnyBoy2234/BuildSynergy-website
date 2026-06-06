<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  const steps = [
    {
      num: '01',
      label: 'Discover',
      desc: 'We review your business, goals and what customers need to see before they trust you.',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M15.5 15.5l4.5 4.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
        <path d="M8 10.5h5M10.5 8v5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity=".45"/>
      </svg>`,
    },
    {
      num: '02',
      label: 'Design',
      desc: 'We create your site structure, messaging and visual direction refined together.',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2H9L6 9l6 13 6-13-3-7h-3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M8.5 9h7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".4"/>
        <path d="M12 22V13" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity=".35"/>
      </svg>`,
    },
    {
      num: '03',
      label: 'Build',
      desc: 'We develop your website, connect lead tools, optimise for mobile and prepare for launch.',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 6L2 12l5 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17 6l5 6-5 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 4l-4 16" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity=".4"/>
      </svg>`,
    },
    {
      num: '04',
      label: 'Launch & Grow',
      desc: 'We go live and keep your presence sharp through hosting, updates and monthly care.',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2C12 2 6.5 8 6.5 13.5h11C17.5 8 12 2 12 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M12 13.5V19" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M9 19h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M6.5 13.5L4 15.5v2l3.5-1M17.5 13.5L20 15.5v2l-3.5-1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>
      </svg>`,
    },
  ];

  let sectionEl:  HTMLElement;
  let headingEl:  HTMLElement;
  let subEl:      HTMLElement;
  let lineEl:     HTMLElement;
  let stepEls:    HTMLElement[] = [];

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (headingEl) {
      const words = headingEl.textContent?.split(' ') ?? [];
      headingEl.innerHTML = words
        .map(w => `<span class="word-outer"><span class="word-inner">${w}</span></span>`)
        .join(' ');
      gsap.from(headingEl.querySelectorAll('.word-inner'), {
        y: '110%', opacity: 0, duration: 0.75, stagger: 0.04, ease: 'power4.out',
        scrollTrigger: { trigger: headingEl, start: 'top 85%' },
      });
    }

    gsap.from(subEl, {
      y: 14, opacity: 0, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: subEl, start: 'top 88%' },
    });

    gsap.from(lineEl, {
      scaleX: 0, transformOrigin: 'left', duration: 1.4, ease: 'power2.inOut',
      scrollTrigger: { trigger: lineEl, start: 'top 80%' },
    });

    gsap.from(stepEls, {
      y: 28, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: stepEls[0], start: 'top 88%' },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  });
</script>

<section id="process" class="process-section" bind:this={sectionEl}>
  <div class="proc-glow-c" aria-hidden="true"></div>

  <div class="proc-container">

    <!-- Header -->
    <div class="proc-header">
      <h2 class="proc-heading" bind:this={headingEl}>
        Simple steps. Most of the work is ours.
      </h2>
      <p class="proc-sub" bind:this={subEl}>
        We handle strategy, design, development and ongoing care.
        Your only job is to review and approve before we go live.
      </p>
    </div>

    <!-- Timeline -->
    <div class="proc-track-wrap">
      <!-- Connecting line -->
      <div class="proc-line" bind:this={lineEl} aria-hidden="true"></div>

      <!-- Step nodes -->
      <div class="proc-track" role="list" aria-label="How it works">
        {#each steps as step, i}
          <div class="proc-step" bind:this={stepEls[i]} role="listitem">

            <div class="step-node-wrap">
              <span class="step-num" aria-hidden="true">{step.num}</span>
              <div class="step-node">
                <div class="node-glow" aria-hidden="true"></div>
                <span class="node-icon">{@html step.icon}</span>
              </div>
            </div>

            <div class="step-text">
              <h3 class="step-label">{step.label}</h3>
              <p class="step-desc">{step.desc}</p>
            </div>

          </div>
        {/each}
      </div>
    </div>

    <p class="proc-note">Most clients are live within 2–4 weeks of getting started.</p>

  </div>
</section>

<style>
  /* ── Shell ─────────────────────────────────────────────────────── */
  .process-section {
    position: relative;
    padding: var(--section-pad) var(--gutter);
    background: var(--bg2);
    overflow: hidden;
  }

  .proc-glow-c {
    position: absolute;
    top: 30%; left: 50%;
    width: 800px; height: 500px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 65%);
    filter: blur(90px);
    pointer-events: none;
    animation: proc-breathe 9s ease-in-out infinite;
  }

  @keyframes proc-breathe {
    0%, 100% { transform: translateX(-50%) scale(1);    opacity: 1; }
    50%       { transform: translateX(-50%) scale(1.25); opacity: 0.45; }
  }

  /* ── Container ─────────────────────────────────────────────────── */
  .proc-container {
    position: relative; z-index: 1;
    max-width: var(--container);
    margin: 0 auto;
    display: flex; flex-direction: column; gap: 4.5rem;
  }

  /* ── Header ────────────────────────────────────────────────────── */
  .proc-header {
    display: flex; flex-direction: column;
    align-items: center; gap: 1.2rem;
    text-align: center;
  }

  .proc-heading {
    font-size: clamp(2rem, 3.5vw, 3.2rem);
    font-weight: 800;
    letter-spacing: -0.04em; line-height: 1.06;
    color: var(--text);
    max-width: 640px;
  }

  .proc-sub {
    font-size: 1rem;
    color: rgba(255,255,255,0.46);
    line-height: 1.75; max-width: 500px;
  }

  /* ── Track wrapper anchors the connecting line ───────────────── */
  .proc-track-wrap {
    position: relative;
  }

  /* Horizontal line connecting step centres */
  .proc-line {
    position: absolute;
    top: 32px; /* half of the 64px node */
    left: 12.5%; right: 12.5%; /* from centre of step 1 to centre of step 4 */
    height: 1px;
    background: linear-gradient(90deg,
      rgba(99,102,241,0.55) 0%,
      rgba(168,85,247,0.4)  50%,
      rgba(34,211,238,0.45) 100%
    );
    pointer-events: none;
  }

  /* ── Steps row ─────────────────────────────────────────────────── */
  .proc-track {
    display: flex;
    align-items: flex-start;
  }

  /* ── Single step ───────────────────────────────────────────────── */
  .proc-step {
    flex: 1;
    display: flex; flex-direction: column; align-items: center;
    gap: 1.5rem;
    cursor: default;
  }

  /* ── Node wrapper ──────────────────────────────────────────────── */
  .step-node-wrap {
    position: relative;
    display: flex; align-items: center; justify-content: center;
  }

  /* Step number small badge top-right of the circle */
  .step-num {
    position: absolute;
    top: -10px; right: -10px;
    font-family: var(--display);
    font-size: 0.52rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.22);
    z-index: 3;
    transition: color 0.25s;
  }
  .proc-step:hover .step-num { color: rgba(99,102,241,0.7); }

  /* Icon circle */
  .step-node {
    position: relative;
    z-index: 2;
    width: 64px; height: 64px;
    border-radius: 50%;
    border: 1px solid rgba(99,102,241,0.22);
    background: rgba(255,255,255,0.025);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.35s, background 0.35s, box-shadow 0.35s;
  }
  .proc-step:hover .step-node {
    border-color: rgba(99,102,241,0.55);
    background: rgba(99,102,241,0.07);
    box-shadow:
      0 0 28px rgba(99,102,241,0.18),
      0 0 0 5px rgba(99,102,241,0.05);
  }

  /* Glow behind the node on hover */
  .node-glow {
    position: absolute; inset: -10px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%);
    opacity: 0;
    transition: opacity 0.35s;
    pointer-events: none;
  }
  .proc-step:hover .node-glow { opacity: 1; }

  /* Icon inside */
  .node-icon {
    display: flex; align-items: center;
    color: rgba(99,102,241,0.65);
    transition: color 0.25s;
  }
  .proc-step:hover .node-icon { color: var(--indigo); }

  /* ── Text block ────────────────────────────────────────────────── */
  .step-text {
    display: flex; flex-direction: column; gap: 0.45rem;
    text-align: center;
    padding: 0 0.75rem;
  }

  .step-label {
    font-family: var(--display);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: rgba(255,255,255,0.75);
    transition: color 0.2s;
  }
  .proc-step:hover .step-label { color: rgba(255,255,255,0.95); }

  .step-desc {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.32);
    line-height: 1.65;
    max-width: 180px;
    margin: 0 auto;
    transition: color 0.2s;
  }
  .proc-step:hover .step-desc { color: rgba(255,255,255,0.54); }

  /* ── Footer note ───────────────────────────────────────────────── */
  .proc-note {
    font-family: var(--display);
    font-size: 0.78rem; font-weight: 500;
    color: rgba(255,255,255,0.18);
    text-align: center;
    letter-spacing: 0.02em;
  }

  /* ── Word-split heading support ────────────────────────────────── */
  :global(.proc-heading .word-outer) {
    display: inline-block; overflow: hidden; vertical-align: bottom;
  }
  :global(.proc-heading .word-inner) { display: inline-block; }

  /* ── Responsive ────────────────────────────────────────────────── */
  @media (max-width: 720px) {
    .proc-track {
      flex-direction: column;
      align-items: stretch;
      gap: 2rem;
    }

    /* Vertical line on mobile */
    .proc-line {
      top: 0; bottom: 0;
      left: 32px; right: auto;
      width: 1px; height: auto;
      background: linear-gradient(to bottom,
        rgba(99,102,241,0.5) 0%,
        rgba(34,211,238,0.4) 100%
      );
    }

    .proc-step {
      flex-direction: row;
      align-items: flex-start;
      gap: 1.5rem;
      padding-left: 0;
    }
    .step-node-wrap { flex-shrink: 0; }
    .step-text { text-align: left; padding: 0; }
    .step-desc { max-width: none; margin: 0; }
    .proc-header { text-align: left; align-items: flex-start; }
    .proc-sub { text-align: left; }
  }

  @media (prefers-reduced-motion: reduce) {
    .proc-line { transform: none !important; }
    .proc-step, .step-node, .node-glow, .node-icon { transition: none !important; }
  }
</style>
