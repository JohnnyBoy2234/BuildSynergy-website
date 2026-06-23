<!--
  Persistent page backdrop. Soft indigo glows drift in the corners for warmth
  over a very light cool base. Fixed and pointer-transparent, sits below all
  content (z-index:-1). White base is on <html> (app.css) so this negative-z
  layer is always visible. Glows stay light so text on top keeps contrast.
  CSS-only; animation freezes under prefers-reduced-motion.
-->
<div class="aurora" aria-hidden="true">
  <span class="blob blob--1"></span>
  <span class="blob blob--2"></span>
  <span class="blob blob--3"></span>
</div>

<style>
  .aurora {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
    /* Very light cool base — tinted, not a colour field */
    background:
      radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99, 102, 241, 0.06) 0%, transparent 60%),
      linear-gradient(180deg, #FDFDFF 0%, #F5F7FD 100%);
  }

  .blob {
    position: absolute;
    width: 55vmax;
    height: 55vmax;
    border-radius: 50%;
    filter: blur(80px);
    will-change: transform;
  }

  /* Indigo — top left corner */
  .blob--1 {
    top: -24vmax;
    left: -18vmax;
    background: radial-gradient(circle at center, rgba(99, 102, 241, 0.22) 0%, transparent 60%);
    animation: drift-1 28s ease-in-out infinite alternate;
  }

  /* Violet — top right corner */
  .blob--2 {
    top: -20vmax;
    right: -20vmax;
    background: radial-gradient(circle at center, rgba(139, 92, 246, 0.20) 0%, transparent 60%);
    animation: drift-2 34s ease-in-out infinite alternate;
  }

  /* Cyan — bottom, low and wide */
  .blob--3 {
    bottom: -28vmax;
    left: 20%;
    width: 70vmax;
    height: 50vmax;
    background: radial-gradient(ellipse at center, rgba(6, 182, 212, 0.16) 0%, transparent 60%);
    animation: drift-3 40s ease-in-out infinite alternate;
  }

  @keyframes drift-1 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(9vmax, 7vmax) scale(1.12); }
  }
  @keyframes drift-2 {
    from { transform: translate(0, 0) scale(1.05); }
    to   { transform: translate(-8vmax, 9vmax) scale(0.94); }
  }
  @keyframes drift-3 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(-10vmax, -6vmax) scale(1.1); }
  }

  @media (prefers-reduced-motion: reduce) {
    .blob { animation: none !important; }
  }
</style>
