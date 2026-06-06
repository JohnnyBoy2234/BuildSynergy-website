<script lang="ts">
  const capabilities = [
    {
      label: 'Professional Design',
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1.5" y="2" width="13" height="9.5" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
        <path d="M5.5 14h5M8 11.5v2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M1.5 6h13" stroke="currentColor" stroke-width="1" opacity=".4"/>
      </svg>`,
    },
    {
      label: 'Managed Hosting',
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1.5" y="2.5" width="13" height="4.5" rx="1" stroke="currentColor" stroke-width="1.3"/>
        <rect x="1.5" y="9" width="13" height="4.5" rx="1" stroke="currentColor" stroke-width="1.3"/>
        <circle cx="12.5" cy="4.75"  r="0.9" fill="currentColor"/>
        <circle cx="12.5" cy="11.25" r="0.9" fill="currentColor"/>
      </svg>`,
    },
    {
      label: 'Quote Requests',
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2.5 4h11M2.5 7.5h7.5M2.5 11h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        <circle cx="12.5" cy="11" r="2.5" stroke="currentColor" stroke-width="1.2"/>
        <path d="M14.3 13l1.2 1.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg>`,
    },
    {
      label: 'SEO Basics',
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.3"/>
        <path d="M10 10l4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M4.5 6.5h4M6.5 4.5v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".55"/>
      </svg>`,
    },
    {
      label: 'Monthly Support',
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3"/>
        <path d="M8 4.5v4l2.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    },
    {
      label: 'Lead Capture',
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M1.5 3h13v8a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V3z" stroke="currentColor" stroke-width="1.3"/>
        <path d="M1.5 3l6.5 5.5L14.5 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    },
  ] as const;
</script>

<div class="trust-strip" role="region" aria-label="Capabilities">
  <!-- Accessible list for screen readers -->
  <ul class="sr-only">
    {#each capabilities as cap}<li>{cap.label}</li>{/each}
  </ul>

  <!-- Edge fade masks -->
  <div class="strip-fade strip-fade--l" aria-hidden="true"></div>
  <div class="strip-fade strip-fade--r" aria-hidden="true"></div>

  <!-- Scrolling track two copies for seamless loop -->
  <div class="strip-track" aria-hidden="true">
    {#each [0, 1] as _}
      {#each capabilities as cap}
        <div class="strip-item">
          <span class="strip-icon">{@html cap.icon}</span>
          <span class="strip-label">{cap.label}</span>
        </div>
        <span class="strip-div" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L9.8 6.2L14 8L9.8 9.8L8 14L6.2 9.8L2 8L6.2 6.2L8 2Z"
              fill="rgba(99,102,241,0.35)" stroke="none"/>
          </svg>
        </span>
      {/each}
    {/each}
  </div>
</div>

<style>
  .trust-strip {
    position: relative;
    overflow: hidden;
    background:
      linear-gradient(to bottom,
        rgba(99,102,241,0.06) 0%,
        rgba(6,6,18,0.85)     40%,
        rgba(6,6,18,0.85)     60%,
        rgba(34,211,238,0.04) 100%
      );
    border-top:    1px solid rgba(99,102,241,0.2);
    border-bottom: 1px solid rgba(34,211,238,0.12);
  }

  /* Gradient line at top indigo → cyan glow */
  .trust-strip::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(99,102,241,0.6) 25%,
      rgba(168,85,247,0.5) 50%,
      rgba(34,211,238,0.5) 75%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 3;
  }

  /* Subtle bottom line too */
  .trust-strip::after {
    content: '';
    position: absolute;
    bottom: 0; left: 15%; right: 15%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(34,211,238,0.25), transparent);
    pointer-events: none;
    z-index: 3;
  }

  .sr-only {
    position: absolute;
    width: 1px; height: 1px;
    overflow: hidden; clip: rect(0,0,0,0);
    white-space: nowrap; padding: 0; margin: 0; border: 0; list-style: none;
  }

  /* Edge masks matching the strip background */
  .strip-fade {
    position: absolute;
    top: 0; bottom: 0; width: 120px;
    z-index: 2; pointer-events: none;
  }
  .strip-fade--l { left:  0; background: linear-gradient(90deg,  #04040e 0%, transparent 100%); }
  .strip-fade--r { right: 0; background: linear-gradient(270deg, #04040e 0%, transparent 100%); }

  /* Scrolling track */
  .strip-track {
    display: flex;
    align-items: center;
    width: max-content;
    padding: 1rem 0;
    animation: marquee 32s linear infinite;
    will-change: transform;
  }

  /* Pill-tag style items */
  .strip-item {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.45rem 1.1rem;
    margin: 0 0.35rem;
    border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.03);
    white-space: nowrap;
  }

  .strip-icon {
    display: flex;
    align-items: center;
    color: rgba(99,102,241,0.65);
    flex-shrink: 0;
  }

  .strip-label {
    font-family: var(--display);
    font-size: 0.77rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: rgba(255,255,255,0.6);
    white-space: nowrap;
  }

  /* Diamond separator between items */
  .strip-div {
    display: flex;
    align-items: center;
    margin: 0 0.25rem;
    flex-shrink: 0;
  }

  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  @media (prefers-reduced-motion: reduce) {
    .strip-track { animation-play-state: paused; }
  }
</style>
