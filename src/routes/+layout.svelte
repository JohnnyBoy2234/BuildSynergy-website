<script lang="ts">
  import '../app.css';
  import { onMount, type Snippet } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import ChatWidget from '$lib/components/ChatWidget.svelte';
  import { startSession, trackPage } from '$lib/chat/browsing';

  interface Props { children: Snippet }
  const { children }: Props = $props();

  onMount(() => startSession());
  afterNavigate(() => trackPage(window.location.pathname, document.title));
</script>

{@render children()}

<ChatWidget />
