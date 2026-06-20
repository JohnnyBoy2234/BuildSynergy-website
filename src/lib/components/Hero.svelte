<script lang="ts">
  import { onMount } from 'svelte';

  let ready = $state(false);
  let canvas: HTMLCanvasElement;

  function scrollTo(id: string) {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  onMount(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => { ready = true; }));

    // Synergy network: drifting nodes that link to each other (and the cursor)
    // when close. Indigo only, kept faint so the headline stays legible.
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LINK = 155;
    let w = 0, h = 0, raf = 0;
    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const pointer = { x: -9999, y: -9999 };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (w * h) / 13000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
      }));
      if (reduce) draw();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(79,70,229,${(1 - d / LINK) * 0.14})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const pd = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (pd < LINK * 1.5) {
          ctx.strokeStyle = `rgba(79,70,229,${(1 - pd / (LINK * 1.5)) * 0.30})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = 'rgba(79,70,229,0.45)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function step() {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      draw();
      raf = requestAnimationFrame(step);
    }

    function onPointer(e: PointerEvent) {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    }
    function onLeave() { pointer.x = -9999; pointer.y = -9999; }

    resize();
    window.addEventListener('resize', resize);
    if (reduce) {
      draw();
    } else {
      step();
      window.addEventListener('pointermove', onPointer, { passive: true });
      window.addEventListener('pointerleave', onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerleave', onLeave);
    };
  });
</script>

<section id="home" class="hero">
  <canvas class="hero-net" bind:this={canvas} aria-hidden="true"></canvas>
  <div class="hero-wash" aria-hidden="true"></div>

  <div class="hero-inner" class:ready>
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
      <button class="btn" onclick={() => scrollTo('#contact')}>
        Get a quote
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="btn btn--ghost" onclick={() => scrollTo('#services')}>
        See what we do
      </button>
    </div>

    <p class="hero-trust">
      For trades, suppliers and local businesses ready to be taken seriously online.
    </p>
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
    justify-content: center;
    padding: 0 var(--gutter);
  }

  /* Synergy network — fades out toward the edges so it blends into the section */
  .hero-net {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    -webkit-mask-image: radial-gradient(ellipse 82% 72% at 50% 46%, #000 28%, transparent 80%);
            mask-image: radial-gradient(ellipse 82% 72% at 50% 46%, #000 28%, transparent 80%);
  }

  /* Fine dot-grid + faint cool radial, masked to fade at the edges */
  .hero-wash {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(circle at 1px 1px, rgba(99,102,241,0.10) 1px, transparent 0) 0 0 / 26px 26px,
      radial-gradient(ellipse 50% 45% at 50% 40%, rgba(99,102,241,0.05) 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse 75% 65% at 50% 42%, #000 30%, transparent 80%);
            mask-image: radial-gradient(ellipse 75% 65% at 50% 42%, #000 30%, transparent 80%);
  }

  /* ── Layout ────────────────────────────────────────────────────── */
  .hero-inner {
    position: relative;
    z-index: 1;
    max-width: 780px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8rem 0 4rem;
  }

  /* ── Entrance: one gentle move, no loops ───────────────────────── */
  .hero-inner > * {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .hero-inner.ready > * { opacity: 1; transform: none; }
  .hero-inner.ready .hero-eyebrow { transition-delay: 0.05s; }
  .hero-inner.ready .hero-heading { transition-delay: 0.13s; }
  .hero-inner.ready .hero-sub     { transition-delay: 0.21s; }
  .hero-inner.ready .hero-ctas    { transition-delay: 0.29s; }
  .hero-inner.ready .hero-trust   { transition-delay: 0.37s; }

  /* ── Copy ──────────────────────────────────────────────────────── */
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
    font-size: clamp(2.7rem, 5.6vw, 4.6rem);
    font-weight: 800;
    line-height: 1.04;
    letter-spacing: -0.04em;
    color: var(--text);
    margin-bottom: 1.6rem;
    max-width: 15ch;
  }
  .hero-heading .accent { display: block; color: var(--indigo); }

  .hero-sub {
    font-size: 1.08rem;
    color: var(--text-body);
    line-height: 1.7;
    margin-bottom: 2.25rem;
    max-width: 560px;
  }

  .hero-ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .hero-trust {
    font-size: 0.82rem;
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 420px;
  }

  /* ── Responsive ────────────────────────────────────────────────── */
  @media (max-width: 600px) {
    .hero-heading { font-size: clamp(2.1rem, 9vw, 2.9rem); max-width: 100%; }
    .hero-ctas { flex-direction: column; align-items: stretch; width: 100%; }
    .hero-ctas :global(.btn) { justify-content: center; }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-inner > * {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }
</style>
