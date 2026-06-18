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
  <!-- One faint, static wash. No drifting orbs, no noise. -->
  <div class="hero-wash" aria-hidden="true"></div>

  <div class="hero-grid" class:ready>

    <!-- LEFT: copy -->
    <div class="hero-copy">
      <span class="hero-eyebrow">Web design studio · South Africa</span>

      <h1 class="hero-heading">
        You're better than the way customers
        <span class="accent">see you online.</span>
      </h1>

      <p class="hero-sub">
        BuildSynergy gives South African service businesses a sharper, more trustworthy
        website — with hosting, lead capture and ongoing support handled for you.
      </p>

      <div class="hero-ctas">
        <button class="cta-primary" onclick={() => scrollTo('#contact')}>
          Get a free digital presence audit
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="cta-secondary" onclick={() => scrollTo('#services')}>
          See what we do
        </button>
      </div>

      <p class="hero-trust">
        For trades, suppliers and local businesses ready to be taken seriously online.
      </p>
    </div>

    <!-- RIGHT: one honest visual — a sample of the kind of site we build -->
    <div class="hero-visual" aria-hidden="true">
      <div class="browser">
        <div class="browser-bar">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <div class="browser-url">apexplumbing.co.za</div>
        </div>

        <div class="browser-body">
          <!-- mini site nav -->
          <div class="mini-nav">
            <span class="mini-logo">Apex Plumbing</span>
            <div class="mini-links">
              <span>Services</span>
              <span>About</span>
              <span>Contact</span>
            </div>
            <span class="mini-btn">Get a Quote</span>
          </div>

          <!-- mini site hero -->
          <div class="mini-hero">
            <div class="mini-hero-copy">
              <h3 class="mini-h">Trusted plumbers in Cape Town.</h3>
              <div class="mini-line"></div>
              <div class="mini-line short"></div>
              <span class="mini-cta">Book a callout</span>
            </div>
            <div class="mini-hero-art"></div>
          </div>

          <!-- mini feature row -->
          <div class="mini-cards">
            <div class="mini-card"></div>
            <div class="mini-card"></div>
            <div class="mini-card"></div>
          </div>
        </div>
      </div>
      <span class="visual-caption">The kind of site we build.</span>
    </div>

  </div>
</section>

<style>
  /* ── Shell ─────────────────────────────────────────────────────── */
  .hero {
    position: relative;
    width: 100%;
    min-height: 100svh;
    background: var(--bg);
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 0 var(--gutter);
  }

  /* Single faint static wash — no animation */
  .hero-wash {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 55% at 75% 35%,
      rgba(99,102,241,0.14) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ── Layout ────────────────────────────────────────────────────── */
  .hero-grid {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: 5rem;
    align-items: center;
    padding: 9rem 0 5rem;
  }

  /* ── Entrance: one gentle move, no loops ───────────────────────── */
  .hero-copy > *,
  .hero-visual {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .hero-grid.ready .hero-copy > *,
  .hero-grid.ready .hero-visual { opacity: 1; transform: none; }

  .hero-grid.ready .hero-eyebrow { transition-delay: 0.05s; }
  .hero-grid.ready .hero-heading { transition-delay: 0.13s; }
  .hero-grid.ready .hero-sub     { transition-delay: 0.21s; }
  .hero-grid.ready .hero-ctas    { transition-delay: 0.29s; }
  .hero-grid.ready .hero-trust   { transition-delay: 0.37s; }
  .hero-visual { transition-delay: 0.22s; transform: translateY(28px); }

  /* ── Copy ──────────────────────────────────────────────────────── */
  .hero-copy { max-width: 540px; }

  .hero-eyebrow {
    display: inline-block;
    font-family: var(--display);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
  }

  .hero-heading {
    font-family: var(--display);
    font-size: clamp(2.5rem, 4.4vw, 3.9rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.04em;
    color: #fff;
    margin-bottom: 1.6rem;
  }
  .hero-heading .accent { display: block; color: var(--indigo); }

  .hero-sub {
    font-size: 1.05rem;
    color: var(--text-body);
    line-height: 1.7;
    margin-bottom: 2.25rem;
  }

  .hero-ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
    align-items: center;
    margin-bottom: 2rem;
  }

  .cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    background: var(--indigo);
    color: #fff;
    font-family: var(--display);
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0.9rem 1.7rem;
    border-radius: 100px;
    border: none;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }
  .cta-primary:hover { background: #5457e5; transform: translateY(-1px); }
  .cta-primary svg { transition: transform 0.2s; }
  .cta-primary:hover svg { transform: translateX(3px); }

  .cta-secondary {
    display: inline-flex;
    align-items: center;
    background: transparent;
    color: var(--text-body);
    font-family: var(--display);
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0.9rem 1.4rem;
    border-radius: 100px;
    border: 1px solid var(--border2);
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
  }
  .cta-secondary:hover { color: #fff; border-color: rgba(255,255,255,0.32); }

  .hero-trust {
    font-size: 0.82rem;
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 400px;
  }

  /* ── Visual: browser window with a light site mockup ──────────── */
  .hero-visual {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.9rem;
  }

  .browser {
    width: 100%;
    max-width: 460px;
    border-radius: 12px;
    overflow: hidden;
    background: #ffffff;
    box-shadow:
      0 30px 80px rgba(0,0,0,0.45),
      0 0 0 1px rgba(255,255,255,0.06);
  }

  .browser-bar {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 0.85rem;
    background: #f1f1f5;
    border-bottom: 1px solid #e5e5ea;
  }
  .dot { width: 9px; height: 9px; border-radius: 50%; background: #d2d2d9; }
  .browser-url {
    margin-left: 0.6rem;
    flex: 1;
    height: 20px;
    border-radius: 100px;
    background: #e6e6ec;
    font-size: 0.62rem;
    color: #8a8a96;
    display: flex;
    align-items: center;
    padding: 0 0.7rem;
  }

  .browser-body { padding: 0; background: #fff; }

  /* mini nav */
  .mini-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid #f0f0f3;
  }
  .mini-logo {
    font-family: var(--display);
    font-size: 0.72rem;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -0.01em;
  }
  .mini-links { display: flex; gap: 0.7rem; }
  .mini-links span { font-size: 0.56rem; color: #9a9aa6; font-weight: 500; }
  .mini-btn {
    font-size: 0.56rem;
    font-weight: 600;
    color: #fff;
    background: var(--indigo);
    padding: 0.28rem 0.6rem;
    border-radius: 100px;
  }

  /* mini hero */
  .mini-hero {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 0.9rem;
    align-items: center;
    padding: 1.4rem 1rem;
  }
  .mini-hero-copy { display: flex; flex-direction: column; gap: 0.5rem; }
  .mini-h {
    font-family: var(--display);
    font-size: 0.92rem;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: #15152b;
  }
  .mini-line { height: 5px; border-radius: 3px; background: #e9e9ef; width: 100%; }
  .mini-line.short { width: 70%; }
  .mini-cta {
    margin-top: 0.35rem;
    align-self: flex-start;
    font-size: 0.58rem;
    font-weight: 600;
    color: #fff;
    background: var(--indigo);
    padding: 0.35rem 0.75rem;
    border-radius: 100px;
  }
  .mini-hero-art {
    height: 84px;
    border-radius: 8px;
    background: linear-gradient(135deg, #eef0ff, #e3e8ff);
    border: 1px solid #e4e6f5;
  }

  /* mini feature cards */
  .mini-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.55rem;
    padding: 0 1rem 1.3rem;
  }
  .mini-card {
    height: 46px;
    border-radius: 7px;
    background: #f6f6f9;
    border: 1px solid #eeeef2;
  }

  .visual-caption {
    font-family: var(--display);
    font-size: 0.74rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.01em;
  }

  /* ── Responsive ────────────────────────────────────────────────── */
  @media (max-width: 980px) {
    .hero-grid {
      grid-template-columns: 1fr;
      gap: 3rem;
      padding: 8rem 0 4rem;
      justify-items: start;
    }
    .hero-visual { width: 100%; }
  }

  @media (max-width: 600px) {
    .hero-heading { font-size: clamp(2.1rem, 9vw, 2.7rem); }
    .hero-ctas { flex-direction: column; align-items: stretch; width: 100%; }
    .cta-primary, .cta-secondary { justify-content: center; }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-copy > *, .hero-visual {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }
</style>
