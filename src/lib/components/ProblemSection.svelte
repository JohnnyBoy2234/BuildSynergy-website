<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  let sectionEl:   HTMLElement;
  let headingEl:   HTMLElement;
  let bodyEls:     HTMLElement[] = [];
  let closerEl:    HTMLElement;
  let beforeEl:    HTMLElement;
  let afterEl:     HTMLElement;
  let gapLineEl:   HTMLElement;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Heading word split
    if (headingEl) {
      const words = headingEl.textContent?.split(' ') ?? [];
      headingEl.innerHTML = words
        .map(w => `<span class="word-outer"><span class="word-inner">${w}</span></span>`)
        .join(' ');
      gsap.from(headingEl.querySelectorAll('.word-inner'), {
        y: '110%', opacity: 0, duration: 0.8, stagger: 0.04, ease: 'power4.out',
        scrollTrigger: { trigger: headingEl, start: 'top 85%' },
      });
    }

    // Body paragraphs stagger
    gsap.from(bodyEls, {
      y: 20, opacity: 0, duration: 0.65, stagger: 0.14, ease: 'power3.out',
      scrollTrigger: { trigger: bodyEls[0], start: 'top 86%' },
    });

    // Closing line
    gsap.from(closerEl, {
      y: 16, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: closerEl, start: 'top 90%' },
    });

    // Before card
    gsap.from(beforeEl, {
      y: 30, opacity: 0, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: beforeEl, start: 'top 85%' },
    });

    // Gap line draws in
    gsap.from(gapLineEl, {
      scaleY: 0, transformOrigin: 'top', duration: 0.9, ease: 'power3.inOut',
      scrollTrigger: { trigger: gapLineEl, start: 'top 85%' },
    });

    // After card
    gsap.from(afterEl, {
      y: 30, opacity: 0, duration: 0.75, ease: 'power3.out', delay: 0.18,
      scrollTrigger: { trigger: afterEl, start: 'top 85%' },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  });
</script>

<section id="problem" class="problem-section" bind:this={sectionEl}>
  <div class="prob-bg-noise" aria-hidden="true"></div>
  <div class="prob-glow" aria-hidden="true"></div>

  <div class="prob-container">

    <!-- Top: heading block -->
    <div class="prob-header">
      <h2 class="prob-heading" bind:this={headingEl}>
        The Problem Isn't That Your Business Is Small.
      </h2>
    </div>

    <!-- Middle: split layout -->
    <div class="prob-split">

      <!-- Left: body copy -->
      <div class="prob-copy">
        <p bind:this={bodyEls[0]} class="prob-lead">
          Customers decide how much they trust you <em>before they ever speak to you.</em>
        </p>

        <div class="prob-steps">
          <p bind:this={bodyEls[1]}>
            <span class="step-marker" aria-hidden="true">→</span>
            They search your name.
          </p>
          <p bind:this={bodyEls[2]}>
            <span class="step-marker" aria-hidden="true">→</span>
            They compare you to competitors.
          </p>
          <p bind:this={bodyEls[3]}>
            <span class="step-marker" aria-hidden="true">→</span>
            They check if you look professional, easy to contact and still active.
          </p>
        </div>

        <p bind:this={bodyEls[4]} class="prob-consequence">
          If your online presence feels outdated, incomplete or hard to trust, good customers move on even if your actual work is better.
        </p>

        <p bind:this={bodyEls[5]} class="prob-cost">
          That gap costs businesses enquiries every day.
        </p>
      </div>

      <!-- Right: before / after visual -->
      <div class="prob-visual" aria-hidden="true">

        <!-- BEFORE card -->
        <div class="profile-card profile-card--before" bind:this={beforeEl}>
          <div class="card-state-label card-state-label--before">Before</div>
          <div class="profile-header">
            <div class="profile-avatar profile-avatar--grey"></div>
            <div class="profile-meta">
              <div class="skeleton skeleton--name skeleton--grey"></div>
              <div class="skeleton skeleton--role skeleton--grey"></div>
            </div>
          </div>
          <div class="trust-signals">
            <div class="signal signal--bad">
              <span class="signal-dot signal-dot--red"></span>
              No website found
            </div>
            <div class="signal signal--bad">
              <span class="signal-dot signal-dot--amber"></span>
              Last updated 3 years ago
            </div>
            <div class="signal signal--bad">
              <span class="signal-dot signal-dot--red"></span>
              No contact info
            </div>
            <div class="signal signal--bad">
              <span class="signal-dot signal-dot--amber"></span>
              Not mobile friendly
            </div>
          </div>
          <div class="trust-score trust-score--low">
            <span class="score-label">Trust Score</span>
            <div class="score-track">
              <div class="score-fill score-fill--low"></div>
            </div>
            <span class="score-val score-val--low">24</span>
          </div>
        </div>

        <!-- Gap line -->
        <div class="gap-connector" bind:this={gapLineEl}>
          <div class="gap-line"></div>
          <div class="gap-label">The Gap</div>
        </div>

        <!-- AFTER card -->
        <div class="profile-card profile-card--after" bind:this={afterEl}>
          <div class="card-state-label card-state-label--after">After BuildSynergy</div>
          <div class="profile-header">
            <div class="profile-avatar profile-avatar--brand"></div>
            <div class="profile-meta">
              <div class="skeleton skeleton--name skeleton--white"></div>
              <div class="skeleton skeleton--role skeleton--muted"></div>
            </div>
          </div>
          <div class="trust-signals">
            <div class="signal signal--good">
              <span class="signal-dot signal-dot--green"></span>
              Professional website live
            </div>
            <div class="signal signal--good">
              <span class="signal-dot signal-dot--green"></span>
              SEO indexed &amp; found
            </div>
            <div class="signal signal--good">
              <span class="signal-dot signal-dot--green"></span>
              Lead forms active
            </div>
            <div class="signal signal--good">
              <span class="signal-dot signal-dot--green"></span>
              Mobile &amp; fast
            </div>
          </div>
          <div class="trust-score trust-score--high">
            <span class="score-label">Trust Score</span>
            <div class="score-track">
              <div class="score-fill score-fill--high"></div>
            </div>
            <span class="score-val score-val--high">91</span>
          </div>
        </div>

      </div>
    </div>

    <!-- Closing statement -->
    <div class="prob-closer" bind:this={closerEl}>
      <div class="closer-rule" aria-hidden="true"></div>
      <p class="closer-text">We close that gap.</p>
    </div>

  </div>
</section>

<style>
  /* ── Section ───────────────────────────────────────────────────── */
  .problem-section {
    position: relative;
    padding: var(--section-pad) var(--gutter);
    background: transparent;
    overflow: hidden;
  }

  .prob-bg-noise {
    position: absolute;
    inset: 0;
    opacity: 0.018;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px;
    pointer-events: none;
  }

  .prob-glow {
    position: absolute;
    top: -5%;
    right: -10%;
    width: 700px;
    height: 700px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 65%);
    pointer-events: none;
    animation: prob-drift 26s ease-in-out infinite alternate;
  }

  @keyframes prob-drift {
    from { transform: translate(0, 0) scale(1);        opacity: 1; }
    to   { transform: translate(-60px, 80px) scale(1.15); opacity: 0.55; }
  }

  /* ── Container ─────────────────────────────────────────────────── */
  .prob-container {
    position: relative;
    z-index: 1;
    max-width: var(--container);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .prob-header  { margin-bottom: 2.5rem; }
  .prob-split   { margin-bottom: 0.75rem; }
  .prob-closer  { margin-top: 0; }

  /* ── Header ────────────────────────────────────────────────────── */
  .prob-header {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .prob-heading {
    font-size: clamp(2.2rem, 4vw, 3.6rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.06;
    max-width: 720px;
    color: var(--text);
  }

  :global(.word-outer) { display: inline-block; overflow: hidden; vertical-align: bottom; }
  :global(.word-inner) { display: inline-block; }

  /* ── Split ─────────────────────────────────────────────────────── */
  .prob-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: start;
  }

  /* ── Copy ──────────────────────────────────────────────────────── */
  .prob-copy {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .prob-lead {
    font-size: clamp(1.05rem, 1.6vw, 1.2rem);
    color: var(--text-body);
    line-height: 1.75;
    font-weight: 400;
  }
  .prob-lead em {
    font-style: normal;
    color: var(--text);
    font-weight: 600;
    border-bottom: 1px solid var(--indigo);
    padding-bottom: 1px;
  }

  .prob-steps {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    padding-left: 0.25rem;
    border-left: 1px solid var(--border);
    padding-left: 1.5rem;
  }
  .prob-steps p {
    display: flex;
    align-items: baseline;
    gap: 0.7rem;
    font-size: 0.95rem;
    color: var(--text-body);
    line-height: 1.6;
  }
  .step-marker {
    color: var(--indigo);
    font-size: 0.8rem;
    flex-shrink: 0;
    transition: color 0.2s;
  }
  .prob-steps p:hover { color: var(--text); }
  .prob-steps p:hover .step-marker { color: var(--indigo-strong); }

  .prob-consequence {
    font-size: 1rem;
    color: var(--text-body);
    line-height: 1.75;
    max-width: 480px;
  }

  .prob-cost {
    font-family: var(--display);
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.01em;
  }

  /* ── Visual: before/after ──────────────────────────────────────── */
  .prob-visual {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    margin-top: -2.5rem;
  }

  /* Profile cards */
  .profile-card {
    width: 100%;
    max-width: 340px;
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    position: relative;
  }

  .profile-card--before {
    background: var(--surface2);
    border: 1px solid var(--border);
  }

  .profile-card--after {
    background: var(--surface);
    border: 1px solid var(--indigo);
    box-shadow: var(--shadow-md);
  }

  .card-state-label {
    font-family: var(--display);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .card-state-label--before { color: var(--text-muted); }
  .card-state-label--after  { color: var(--indigo); }

  /* Profile header */
  .profile-header {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  .profile-avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .profile-avatar--grey  { background: var(--tint); border: 1px solid var(--border); }
  .profile-avatar--brand {
    background: var(--indigo);
    border: 1px solid var(--indigo-strong);
  }

  .profile-meta { display: flex; flex-direction: column; gap: 0.4rem; flex: 1; }

  .skeleton {
    border-radius: 4px;
    height: 8px;
  }
  .skeleton--name  { width: 55%; }
  .skeleton--role  { width: 38%; height: 6px; }
  .skeleton--grey  { background: var(--border); }
  .skeleton--white { background: var(--text-muted); }
  .skeleton--muted { background: var(--border2); }

  /* Trust signals */
  .trust-signals {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .signal {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    font-size: 0.78rem;
    font-family: var(--display);
    font-weight: 500;
  }
  .signal--bad  { color: var(--text-muted); }
  .signal--good { color: var(--text-body); }

  .signal-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .signal-dot--red   { background: rgba(239,68,68,0.6); }
  .signal-dot--amber { background: rgba(251,146,60,0.55); }
  .signal-dot--green {
    background: #4ade80;
    box-shadow: 0 0 6px rgba(74,222,128,0.5);
  }

  /* Trust score bar */
  .trust-score {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-top: 0.25rem;
    border-top: 1px solid var(--border);
  }

  .score-label {
    font-family: var(--display);
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .trust-score--low  .score-label { color: var(--text-muted); }
  .trust-score--high .score-label { color: var(--text-body); }

  .score-track {
    flex: 1;
    height: 5px;
    background: var(--tint);
    border-radius: 100px;
    overflow: hidden;
  }
  .score-fill {
    height: 100%;
    border-radius: 100px;
  }
  .score-fill--low  { width: 24%; background: rgba(239,68,68,0.55); }
  .score-fill--high {
    width: 91%;
    background: var(--indigo);
  }

  .score-val {
    font-family: var(--display);
    font-size: 0.82rem;
    font-weight: 700;
    flex-shrink: 0;
    width: 1.8rem;
    text-align: right;
  }
  .score-val--low  { color: var(--text-muted); }
  .score-val--high { color: var(--text); }

  /* Gap connector */
  .gap-connector {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.45rem;
    padding: 0.75rem 0;
  }

  .gap-line {
    width: 1px;
    height: 32px;
    background: linear-gradient(to bottom, rgba(239,68,68,0.45), var(--indigo));
  }

  .gap-label {
    font-family: var(--display);
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  /* ── Closer ────────────────────────────────────────────────────── */
  .prob-closer {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .closer-rule {
    height: 1px;
    width: 80px;
    background: linear-gradient(90deg, transparent, var(--indigo));
    flex-shrink: 0;
  }

  .closer-text {
    font-family: var(--display);
    font-size: clamp(1.4rem, 2.5vw, 2.2rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--text);
    line-height: 1;
  }

  /* ── Responsive ────────────────────────────────────────────────── */
  @media (max-width: 900px) {
    .prob-split {
      grid-template-columns: 1fr;
      gap: 3.5rem;
    }
    .prob-visual {
      align-items: flex-start;
    }
    .profile-card {
      max-width: 100%;
    }
  }

  @media (max-width: 540px) {
    .prob-container { gap: 3rem; }
    .prob-heading   { font-size: clamp(2rem, 8vw, 2.4rem); }
    .prob-steps     { padding-left: 1rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
</style>
