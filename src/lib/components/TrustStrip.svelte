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
      label: 'AI Automation',
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 1.5c.3 2.3 1.5 3.5 3.8 3.8-2.3.3-3.5 1.5-3.8 3.8-.3-2.3-1.5-3.5-3.8-3.8 2.3-.3 3.5-1.5 3.8-3.8z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M13 9.5c.18 1.3.85 2 2.15 2.2-1.3.18-2 .85-2.15 2.15-.18-1.3-.85-2-2.15-2.15 1.3-.18 2-.85 2.15-2.2z" stroke="currentColor" stroke-width="1" stroke-linejoin="round" opacity=".7"/>
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
      label: 'Quote & Contact Forms',
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2.5 4h11M2.5 7.5h7.5M2.5 11h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        <circle cx="12.5" cy="11" r="2.5" stroke="currentColor" stroke-width="1.2"/>
        <path d="M14.3 13l1.2 1.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg>`,
    },
    {
      label: 'Mobile Optimisation',
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="4" y="1.5" width="8" height="13" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
        <path d="M7 12.5h2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg>`,
    },
    {
      label: 'SEO Foundations',
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.3"/>
        <path d="M10 10l4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M4.5 6.5h4M6.5 4.5v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".55"/>
      </svg>`,
    },
    {
      label: 'Google Business Setup',
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.2 4.5 8 4.5 8s4.5-4.8 4.5-8c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
        <circle cx="8" cy="6" r="1.6" stroke="currentColor" stroke-width="1.2"/>
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

<section class="incl-strip" aria-label="Our services">
  <div class="incl-track">
    <ul class="incl-list" aria-hidden="false">
      {#each capabilities as cap}
        <li class="incl-item">
          <span class="incl-icon">{@html cap.icon}</span>
          <span class="incl-label">{cap.label}</span>
        </li>
      {/each}
    </ul>
    <ul class="incl-list" aria-hidden="true">
      {#each capabilities as cap}
        <li class="incl-item">
          <span class="incl-icon">{@html cap.icon}</span>
          <span class="incl-label">{cap.label}</span>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .incl-strip {
    position: relative;
    background: transparent;
    border-top:    1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 1.25rem 0;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
            mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
  }

  .incl-track {
    display: flex;
    width: max-content;
    animation: incl-scroll 32s linear infinite;
  }
  .incl-strip:hover .incl-track {
    animation-play-state: paused;
  }

  @keyframes incl-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  .incl-list {
    display: flex;
    flex-shrink: 0;
    gap: 0.75rem;
    list-style: none;
    margin: 0;
    padding: 0 0.375rem;
  }

  .incl-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1.1rem;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
    white-space: nowrap;
  }

  .incl-icon {
    display: flex;
    align-items: center;
    color: var(--indigo);
    flex-shrink: 0;
  }

  .incl-label {
    font-family: var(--display);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: var(--text-body);
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    .incl-track { animation: none; }
  }
</style>
