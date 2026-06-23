<script lang="ts">
  import '../app.css';
  import { onMount, type Snippet } from 'svelte';
  import { afterNavigate, onNavigate } from '$app/navigation';
  import ChatWidget from '$lib/components/ChatWidget.svelte';
  import { startSession, trackPage } from '$lib/chat/browsing';

  interface Props { children: Snippet }
  const { children }: Props = $props();

  onMount(() => startSession());
  afterNavigate(() => trackPage(window.location.pathname, document.title));

  onNavigate((navigation) => {
    if (typeof document === 'undefined' || !document.startViewTransition) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BuildSynergy',
    url: 'https://www.buildsynergy.co.za',
    logo: 'https://www.buildsynergy.co.za/logo.png',
    image: 'https://www.buildsynergy.co.za/og-image.png',
    description:
      'Professional websites and digital solutions that help South African businesses look more credible online, get found faster and capture more enquiries.',
    email: 'yoursupport@buildsynergy.co.za',
    areaServed: { '@type': 'Country', name: 'South Africa' },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'yoursupport@buildsynergy.co.za',
      contactType: 'customer service',
      areaServed: 'ZA',
      availableLanguage: 'en'
    }
  };
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${JSON.stringify(orgSchema)}</scr` + `ipt>`}
</svelte:head>

{@render children()}

<ChatWidget />
