<script lang="ts">
  import ContactSection from './ContactSection.svelte';
</script>

<ContactSection />

<style>
  /* ── CTA header ────────────────────────────────────────────────── */
  .final-cta-wrap {
    position: relative;
    padding: var(--section-pad) var(--gutter) calc(var(--section-pad) * 0.6);
    background: var(--bg2);
    overflow: hidden;
  }

  .fcta-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 70% at 50% 0%,   rgba(99,102,241,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 10% 100%, rgba(168,85,247,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 90% 80%,  rgba(34,211,238,0.05) 0%, transparent 60%);
    pointer-events: none;
  }

  .fcta-noise {
    position: absolute; inset: 0; opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px; pointer-events: none;
  }

  .fcta-glow-l {
    position: absolute; top: -10%; left: -5%;
    width: 600px; height: 600px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 65%);
    filter: blur(80px); pointer-events: none;
  }
  .fcta-glow-r {
    position: absolute; bottom: 0; right: -5%;
    width: 500px; height: 500px;
    background: radial-gradient(ellipse, rgba(168,85,247,0.07) 0%, transparent 65%);
    filter: blur(80px); pointer-events: none;
  }

  .fcta-container {
    position: relative; z-index: 1;
    max-width: var(--container);
    margin: 0 auto;
  }

  .fcta-content {
    max-width: 700px;
    display: flex; flex-direction: column; gap: 0;
  }

  .fcta-heading {
    font-size: clamp(2.4rem, 4.5vw, 4rem);
    font-weight: 800; letter-spacing: -0.04em; line-height: 1.05;
    color: rgba(255,255,255,0.96);
    margin-bottom: 1.5rem;
  }

  .fcta-sub {
    font-size: 1.05rem;
    color: rgba(255,255,255,0.5);
    line-height: 1.72;
    max-width: 520px;
    margin-bottom: 2.5rem;
  }

  /* Actions */
  .fcta-actions {
    display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;
    margin-bottom: 2rem;
  }

  .fcta-btn {
    display: inline-flex; align-items: center; gap: 0.6rem;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    color: #fff;
    font-family: var(--display); font-size: 0.95rem; font-weight: 700;
    padding: 1rem 2.25rem; border-radius: 100px;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 4px 28px rgba(99,102,241,0.3);
    white-space: nowrap;
  }
  .fcta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 40px rgba(99,102,241,0.45);
    opacity: 0.93;
  }
  .fcta-btn svg { transition: transform 0.2s; }
  .fcta-btn:hover svg { transform: translateX(3px); }

  .fcta-email {
    font-family: var(--display); font-size: 0.875rem; font-weight: 500;
    color: rgba(255,255,255,0.38);
    text-decoration: none;
    transition: color 0.2s;
  }
  .fcta-email:hover { color: var(--cyan); }

  /* Trust signals */
  .fcta-trust {
    display: flex; flex-wrap: wrap; gap: 1.25rem;
  }

  .trust-item {
    display: flex; align-items: center; gap: 0.45rem;
    font-family: var(--display); font-size: 0.72rem; font-weight: 500;
    letter-spacing: 0.04em;
    color: rgba(255,255,255,0.28);
  }

  /* Responsive */
  @media (max-width: 640px) {
    .fcta-heading { font-size: clamp(2rem, 8.5vw, 2.8rem); }
    .fcta-actions { flex-direction: column; align-items: flex-start; }
    .fcta-btn { width: 100%; justify-content: center; }
    .fcta-trust { gap: 0.85rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .fcta-btn { transition: none !important; }
  }
</style>
