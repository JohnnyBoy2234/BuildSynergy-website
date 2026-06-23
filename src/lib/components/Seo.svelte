<script lang="ts">
  const SITE_URL = 'https://www.buildsynergy.co.za';

  interface Props {
    title: string;
    description: string;
    /** Path including leading slash, e.g. "/terms". Home is "". */
    path?: string;
    noindex?: boolean;
  }
  let { title, description, path = '', noindex = false }: Props = $props();

  const url = $derived(SITE_URL + path);
  const image = `${SITE_URL}/og-image.png`;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />
  {#if noindex}<meta name="robots" content="noindex, follow" />{/if}

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="BuildSynergy" />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="en_ZA" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
</svelte:head>
