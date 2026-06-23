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

<section class="incl-strip" aria-label="What every site includes">
  <div class="incl-inner">
    <span class="incl-heading">Every site includes</span>
    <ul class="incl-list">
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
    padding: 1.5rem var(--gutter);
  }

  .incl-inner {
    max-width: var(--container);
    margin: 0 auto;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
  }

  .incl-heading {
    font-family: var(--display);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .incl-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 0.6rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .incl-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.95rem;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
  }

  .incl-icon {
    display: flex;
    align-items: center;
    color: var(--indigo);
    flex-shrink: 0;
  }

  .incl-label {
    font-family: var(--display);
    font-size: 0.76rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: var(--text-body);
    white-space: nowrap;
  }
</style>
