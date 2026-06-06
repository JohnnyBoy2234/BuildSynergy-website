<script lang="ts">
  import { onMount } from 'svelte';

  let ready = $state(false);

  onMount(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => { ready = true; }));
  });

  function scrollTo(id: string) {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }
</script>

<section id="home" class="hero">
  <!-- Background atmosphere -->
  <div class="hero-bg" aria-hidden="true">
    <div class="bg-orb bg-orb--1"></div>
    <div class="bg-orb bg-orb--2"></div>
    <div class="bg-orb bg-orb--3"></div>
    <div class="bg-noise"></div>
  </div>

  <div class="hero-container" class:ready>

    <!-- LEFT: Copy -->
    <div class="hero-left">
<h1 class="hero-heading">
        You're Better Than the Way Customers
        <span class="heading-accent">See You Online.</span>
      </h1>

      <p class="hero-sub">
        BuildSynergy helps South African businesses create a sharper, more trustworthy digital presence with modern design, lead capture, hosting and ongoing support.
      </p>

      <p class="hero-support">
        Look professional. Get found. Turn interest into enquiries.
      </p>

      <div class="hero-ctas">
        <button class="cta-primary" onclick={() => scrollTo('#contact')}>
          <span>Get My Free Digital Presence Audit</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="cta-secondary" onclick={() => scrollTo('#services')}>
          See What We Do
        </button>
      </div>

      <p class="hero-trust">
        <span class="trust-line" aria-hidden="true"></span>
        For service businesses, trades, suppliers and local companies ready to be taken seriously online.
      </p>
    </div>

    <!-- RIGHT: Abstract digital presence visual -->
    <div class="hero-right" aria-hidden="true">

      <!-- Central presence orb -->
      <div class="presence-orb">
        <div class="orb-core">
          <div class="orb-ring orb-ring--1"></div>
          <div class="orb-ring orb-ring--2"></div>
          <div class="orb-ring orb-ring--3"></div>
          <div class="orb-pulse"></div>
          <!-- Central icon: network/web symbol -->
          <div class="orb-icon">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="5" stroke="rgba(255,255,255,0.9)" stroke-width="1.5"/>
              <circle cx="6"  cy="9"  r="3" stroke="rgba(99,102,241,0.8)" stroke-width="1.2"/>
              <circle cx="30" cy="9"  r="3" stroke="rgba(34,211,238,0.8)"  stroke-width="1.2"/>
              <circle cx="6"  cy="27" r="3" stroke="rgba(168,85,247,0.8)"  stroke-width="1.2"/>
              <circle cx="30" cy="27" r="3" stroke="rgba(34,211,238,0.8)"  stroke-width="1.2"/>
              <line x1="9"  y1="10" x2="14" y2="15" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
              <line x1="27" y1="10" x2="22" y2="15" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
              <line x1="9"  y1="26" x2="14" y2="21" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
              <line x1="27" y1="26" x2="22" y2="21" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
            </svg>
          </div>
        </div>

        <!-- Floating connection lines (SVG) -->
        <svg class="orb-lines" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="120" stroke="rgba(99,102,241,0.08)" stroke-width="1" stroke-dasharray="4 8"/>
          <circle cx="200" cy="200" r="160" stroke="rgba(99,102,241,0.05)" stroke-width="1" stroke-dasharray="2 12"/>
        </svg>
      </div>

      <!-- Floating status cards -->
      <div class="float-card float-card--enquiry">
        <div class="fc-indicator fc-indicator--blue"></div>
        <div class="fc-body">
          <div class="fc-label">New Enquiry</div>
          <div class="fc-value">Plumbing Services, JHB</div>
        </div>
        <div class="fc-badge fc-badge--new">New</div>
      </div>

      <div class="float-card float-card--seo">
        <div class="fc-indicator fc-indicator--green"></div>
        <div class="fc-body">
          <div class="fc-label">SEO Status</div>
          <div class="fc-value">Indexed &amp; Ready</div>
        </div>
        <svg class="fc-check" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="8" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.4)" stroke-width="1"/>
          <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <div class="float-card float-card--hosting">
        <div class="fc-pulse-dot" aria-hidden="true">
          <span class="pulse-ring"></span>
        </div>
        <div class="fc-body">
          <div class="fc-label">Hosting</div>
          <div class="fc-value">Active · 99.9% uptime</div>
        </div>
      </div>

      <div class="float-card float-card--quote">
        <div class="fc-icon-wrap">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 3h10M2 6h7M2 9h5" stroke="#a78bfa" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="fc-body">
          <div class="fc-label">Quote Request</div>
          <div class="fc-value">Received · 2 min ago</div>
        </div>
      </div>

      <!-- Score card -->
      <div class="score-card">
        <div class="score-label">Digital Presence Score</div>
        <div class="score-bar-wrap">
          <div class="score-bar">
            <div class="score-fill"></div>
          </div>
          <span class="score-num">94</span>
        </div>
        <div class="score-sublabel">↑ from 31 before BuildSynergy</div>
      </div>

    </div>
  </div>

  <!-- Scroll hint -->
  <div class="scroll-hint" class:ready aria-hidden="true">
    <span class="scroll-line"></span>
    Scroll
  </div>
</section>

<style>
  /* ── Section shell ─────────────────────────────────────────────── */
  .hero {
    position: relative;
    width: 100%;
    min-height: 100svh;
    background: var(--bg);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 var(--gutter);
  }

  /* ── Background atmosphere ─────────────────────────────────────── */
  .hero-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
  }
  .bg-orb--1 {
    width: 600px; height: 600px;
    top: -15%; right: 5%;
    background: radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%);
    animation: driftSlow 18s ease-in-out infinite alternate;
  }
  .bg-orb--2 {
    width: 500px; height: 500px;
    bottom: -10%; left: -5%;
    background: radial-gradient(ellipse, rgba(168,85,247,0.12) 0%, transparent 70%);
    animation: driftSlow 22s ease-in-out infinite alternate-reverse;
  }
  .bg-orb--3 {
    width: 300px; height: 300px;
    top: 40%; left: 40%;
    background: radial-gradient(ellipse, rgba(34,211,238,0.07) 0%, transparent 70%);
    animation: driftSlow 14s ease-in-out infinite alternate;
  }
  @keyframes driftSlow {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(30px, -20px) scale(1.08); }
  }

  /* Subtle noise texture overlay */
  .bg-noise {
    position: absolute;
    inset: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  /* ── Container ─────────────────────────────────────────────────── */
  .hero-container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    padding: 8rem 0 5rem;
  }

  /* ── Entry animations ──────────────────────────────────────────── */
  .hero-left > * {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.75s ease, transform 0.75s ease;
  }
  .hero-left .eyebrow-wrap  { transition-delay: 0.05s; }
  .hero-left .hero-heading  { transition-delay: 0.18s; }
  .hero-left .hero-sub      { transition-delay: 0.32s; }
  .hero-left .hero-support  { transition-delay: 0.42s; }
  .hero-left .hero-ctas     { transition-delay: 0.54s; }
  .hero-left .hero-trust    { transition-delay: 0.66s; }
  .hero-right               { opacity: 0; transform: translateX(24px); transition: opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s; }

  .hero-container.ready .hero-left > * { opacity: 1; transform: translateY(0); }
  .hero-container.ready .hero-right    { opacity: 1; transform: translateX(0); }

  /* ── Left: Copy ────────────────────────────────────────────────── */
  .hero-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  .eyebrow-wrap { margin-bottom: 1.5rem; }

  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    font-family: var(--display);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    border: 1px solid var(--border);
    padding: 0.4rem 0.9rem;
    border-radius: 100px;
    background: rgba(255,255,255,0.03);
  }

  .eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--cyan);
    box-shadow: 0 0 8px rgba(34,211,238,0.7);
    animation: dotPulse 2.4s ease-in-out infinite;
  }
  @keyframes dotPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.7); }
  }

  .hero-heading {
    font-family: var(--display);
    font-size: clamp(2.4rem, 4.2vw, 3.8rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.04em;
    color: #fff;
    margin-bottom: 1.75rem;
    max-width: 580px;
  }

  .heading-accent {
    display: block;
    background: linear-gradient(135deg, #a5b4fc 0%, #22d3ee 60%, #e879f9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-sub {
    font-size: clamp(0.95rem, 1.4vw, 1.05rem);
    color: rgba(255,255,255,0.6);
    line-height: 1.75;
    max-width: 500px;
    margin-bottom: 1rem;
  }

  .hero-support {
    font-family: var(--display);
    font-size: 0.9rem;
    font-weight: 600;
    color: rgba(255,255,255,0.45);
    letter-spacing: 0.02em;
    margin-bottom: 2.5rem;
  }

  /* CTAs */
  .hero-ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
    align-items: center;
    margin-bottom: 2.25rem;
  }

  .cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    color: #fff;
    font-family: var(--display);
    font-size: 0.9rem;
    font-weight: 700;
    padding: 0.95rem 2rem;
    border-radius: 100px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 0 0 0 rgba(99,102,241,0);
    white-space: nowrap;
  }
  .cta-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(99,102,241,0.45), 0 0 0 1px rgba(99,102,241,0.25);
    opacity: 0.95;
  }
  .cta-primary svg { flex-shrink: 0; transition: transform 0.2s; }
  .cta-primary:hover svg { transform: translateX(3px); }

  .cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    color: rgba(255,255,255,0.7);
    font-family: var(--display);
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.95rem 1.6rem;
    border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.12);
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s, transform 0.2s;
    white-space: nowrap;
  }
  .cta-secondary:hover {
    color: #fff;
    border-color: rgba(255,255,255,0.28);
    transform: translateY(-1px);
  }

  /* Trust line */
  .hero-trust {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.32);
    line-height: 1.6;
    max-width: 440px;
  }

  .trust-line {
    flex-shrink: 0;
    width: 24px;
    height: 1px;
    background: rgba(255,255,255,0.2);
    margin-top: 0.6rem;
  }

  /* ── Right: Visual ─────────────────────────────────────────────── */
  .hero-right {
    position: relative;
    height: 520px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Central orb */
  .presence-orb {
    position: relative;
    width: 180px;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .orb-core {
    position: relative;
    width: 110px;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: radial-gradient(ellipse at 35% 35%, rgba(99,102,241,0.35), rgba(4,4,14,0.9));
    border: 1px solid rgba(99,102,241,0.3);
    box-shadow:
      0 0 40px rgba(99,102,241,0.2),
      0 0 80px rgba(99,102,241,0.08),
      inset 0 1px 0 rgba(255,255,255,0.1);
  }

  .orb-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(99,102,241,0.15);
    animation: orbSpin 12s linear infinite;
  }
  .orb-ring--1 { width: 140px; height: 140px; border-color: rgba(99,102,241,0.12); }
  .orb-ring--2 { width: 170px; height: 170px; border-color: rgba(168,85,247,0.08); animation-duration: 18s; animation-direction: reverse; }
  .orb-ring--3 { width: 200px; height: 200px; border-color: rgba(34,211,238,0.06); animation-duration: 24s; }
  @keyframes orbSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .orb-pulse {
    position: absolute;
    inset: -20px;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%);
    animation: orbPulse 3s ease-in-out infinite;
  }
  @keyframes orbPulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50%       { transform: scale(1.15); opacity: 1; }
  }

  .orb-icon { position: relative; z-index: 1; }

  .orb-lines {
    position: absolute;
    inset: -110px;
    pointer-events: none;
    animation: linesSpin 40s linear infinite;
  }
  @keyframes linesSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* Floating cards shared */
  .float-card {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    background: rgba(8, 8, 24, 0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px;
    padding: 0.75rem 1rem;
    box-shadow:
      0 4px 24px rgba(0,0,0,0.35),
      0 0 0 1px rgba(255,255,255,0.04) inset;
    white-space: nowrap;
    min-width: 180px;
    animation: floatUp 4s ease-in-out infinite;
  }

  .fc-body { display: flex; flex-direction: column; gap: 0.1rem; }
  .fc-label {
    font-family: var(--display);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }
  .fc-value {
    font-family: var(--display);
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(255,255,255,0.88);
  }

  /* Card positions */
  .float-card--enquiry {
    top: 3%;
    right: 0%;
    animation-delay: 0s;
    animation-duration: 5s;
  }
  .float-card--seo {
    bottom: 12%;
    left: -2%;
    animation-delay: 1.2s;
    animation-duration: 6s;
    animation-direction: alternate-reverse;
  }
  .float-card--hosting {
    top: 20%;
    left: -4%;
    animation-delay: 0.6s;
    animation-duration: 4.5s;
    animation-direction: alternate;
  }
  .float-card--quote {
    bottom: 3%;
    right: 2%;
    animation-delay: 1.8s;
    animation-duration: 5.5s;
  }

  @keyframes floatUp {
    0%, 100% { transform: translateY(0px);  }
    50%       { transform: translateY(-8px); }
  }

  /* Card indicators */
  .fc-indicator {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .fc-indicator--blue  { background: #6366f1; box-shadow: 0 0 8px rgba(99,102,241,0.7); }
  .fc-indicator--green { background: #4ade80; box-shadow: 0 0 8px rgba(74,222,128,0.6); }

  .fc-badge {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.2rem 0.5rem;
    border-radius: 100px;
    margin-left: auto;
  }
  .fc-badge--new {
    background: rgba(99,102,241,0.18);
    color: #a5b4fc;
    border: 1px solid rgba(99,102,241,0.3);
  }

  .fc-check { flex-shrink: 0; margin-left: auto; }

  /* Pulse dot for Hosting */
  .fc-pulse-dot {
    position: relative;
    width: 8px; height: 8px;
    flex-shrink: 0;
  }
  .fc-pulse-dot::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 6px rgba(74,222,128,0.7);
  }
  .pulse-ring {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1px solid rgba(74,222,128,0.4);
    animation: pulseRing 2s ease-out infinite;
  }
  @keyframes pulseRing {
    0%   { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }

  /* Quote icon */
  .fc-icon-wrap {
    width: 28px; height: 28px;
    border-radius: 8px;
    background: rgba(168,85,247,0.12);
    border: 1px solid rgba(168,85,247,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* Score card */
  .score-card {
    position: absolute;
    bottom: 22%;
    right: -2%;
    background: rgba(8, 8, 24, 0.88);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 14px;
    padding: 0.9rem 1.1rem;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 30px rgba(99,102,241,0.08);
    animation: floatUp 7s ease-in-out infinite;
    animation-delay: 2.5s;
  }

  .score-label {
    font-family: var(--display);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }

  .score-bar-wrap {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .score-bar {
    flex: 1;
    height: 6px;
    background: rgba(255,255,255,0.07);
    border-radius: 100px;
    overflow: hidden;
  }

  .score-fill {
    height: 100%;
    width: 94%;
    border-radius: 100px;
    background: linear-gradient(90deg, #6366f1, #22d3ee);
    box-shadow: 0 0 10px rgba(99,102,241,0.5);
    animation: fillIn 2s cubic-bezier(0.4, 0, 0.2, 1) 1s both;
  }
  @keyframes fillIn {
    from { width: 0%; }
    to   { width: 94%; }
  }

  .score-num {
    font-family: var(--display);
    font-size: 0.9rem;
    font-weight: 700;
    color: #fff;
  }

  .score-sublabel {
    font-size: 0.68rem;
    color: rgba(74,222,128,0.75);
    font-family: var(--display);
    font-weight: 500;
  }

  /* ── Scroll hint ───────────────────────────────────────────────── */
  .scroll-hint {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    opacity: 0;
    transition: opacity 0.6s ease 1.2s;
  }
  .scroll-hint.ready { opacity: 1; }

  .scroll-line {
    width: 24px; height: 1px;
    background: rgba(255,255,255,0.2);
    animation: lineBreath 2.5s ease-in-out infinite;
  }
  @keyframes lineBreath {
    0%, 100% { transform: scaleX(1); opacity: 0.3; }
    50%       { transform: scaleX(1.5); opacity: 0.7; }
  }

  /* ── Responsive ────────────────────────────────────────────────── */
  @media (max-width: 1024px) {
    .hero-container {
      grid-template-columns: 1fr;
      padding: 8rem 0 4rem;
      gap: 4rem;
    }
    .hero-right {
      height: 400px;
    }
    .float-card--enquiry { top: 0%; right: 5%; }
    .float-card--seo     { bottom: 5%; left: 2%; }
    .float-card--hosting { top: 15%; left: 2%; }
    .float-card--quote   { bottom: 0%; right: 5%; }
    .score-card          { right: 5%; bottom: 18%; }
  }

  @media (max-width: 640px) {
    .hero-heading { font-size: clamp(2.1rem, 8vw, 2.8rem); }
    .hero-ctas { flex-direction: column; align-items: stretch; }
    .cta-primary, .cta-secondary { text-align: center; justify-content: center; }
    .hero-right { height: 340px; }
    .float-card { min-width: 150px; font-size: 0.75rem; }
    .score-card { min-width: 170px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .bg-orb, .orb-ring, .orb-pulse, .orb-lines,
    .float-card, .score-card, .eyebrow-dot,
    .scroll-line, .pulse-ring, .score-fill {
      animation: none !important;
    }
    .hero-left > *, .hero-right {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }
</style>
