<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { env } from '$env/dynamic/public';
  import { consent, initConsent, setConsent } from '$lib/consent.svelte';

  onMount(initConsent);

  function loadGA(id: string) {
    if (document.getElementById('ga-script')) return;
    const s = document.createElement('script');
    s.id = 'ga-script';
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () { w.dataLayer.push(arguments); };
    w.gtag('js', new Date());
    w.gtag('config', id, { anonymize_ip: true });
  }

  // ponytail: only Google Analytics is gated — it sets cookies and needs consent.
  // Vercel Analytics is cookieless, so it can run without consent if added later.
  $effect(() => {
    if (browser && consent.choice === 'accepted' && env.PUBLIC_GA_ID) {
      loadGA(env.PUBLIC_GA_ID);
    }
  });
</script>

{#if consent.ready && consent.choice === null}
  <div class="cookie-banner" role="dialog" aria-label="Cookie consent" aria-live="polite">
    <p>
      We use cookies and analytics to understand how visitors use our site. You can accept or
      reject non-essential cookies. See our <a href="/privacy-policy">Privacy Policy</a>.
    </p>
    <div class="cookie-actions">
      <button class="reject" onclick={() => setConsent('rejected')}>Reject</button>
      <button class="accept" onclick={() => setConsent('accepted')}>Accept</button>
    </div>
  </div>
{/if}

<style>
  .cookie-banner {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    z-index: 1000;
    max-width: 540px;
    margin: 0 auto;
    background: var(--bg, #fff);
    border: 1px solid rgba(99, 102, 241, 0.25);
    border-radius: 14px;
    padding: 1.1rem 1.25rem;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  p {
    font-size: 0.85rem;
    line-height: 1.6;
    color: var(--text-body, #333);
    margin: 0;
  }

  a {
    color: var(--indigo, #6366f1);
    text-decoration: underline;
  }

  .cookie-actions {
    display: flex;
    gap: 0.6rem;
    justify-content: flex-end;
  }

  button {
    font-family: var(--display, inherit);
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.55rem 1.1rem;
    border-radius: 9px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: opacity 0.2s, background 0.2s;
  }

  .reject {
    background: transparent;
    border-color: rgba(99, 102, 241, 0.3);
    color: var(--text-muted, #666);
  }
  .reject:hover { background: rgba(99, 102, 241, 0.06); }

  .accept {
    background: var(--indigo, #6366f1);
    color: #fff;
  }
  .accept:hover { opacity: 0.9; }

  @media (min-width: 560px) {
    .cookie-banner {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .cookie-actions { flex-shrink: 0; }
  }
</style>
