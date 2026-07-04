<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import MessageList from './chat/MessageList.svelte';
  import ChatInput from './chat/ChatInput.svelte';
  import { getBrowsing } from '$lib/chat/browsing';
  import {
    getOrCreateSessionId, loadTranscript, saveTranscript, type ChatMessage,
  } from '$lib/chat/session';
  import { analytics, chatStream } from '$lib/chat/api';

  const ESCALATION_NOTE = "I've flagged this for the team — they'll follow up with you directly.";
  const GREETING = "Hi 👋 I'm the BuildSynergy assistant. Tell me a bit about your business and what you'd like to improve online — I'll point you in the right direction.";

  let open = $state(false);
  // Greeting is part of the initial state, so it renders instantly — no fetch, no loading.
  let messages = $state<ChatMessage[]>([{ role: 'assistant', content: GREETING }]);
  let sending = $state(false);
  let escalated = $state(false);
  let analyticsSent = false;
  let userSentSinceOpen = false;
  let sessionId = '';

  onMount(() => {
    sessionId = getOrCreateSessionId();
    const saved = loadTranscript();
    if (saved.length > 0) messages = saved; // resume a prior conversation if there is one
  });

  function persist() {
    saveTranscript(messages);
  }

  function toggle() {
    open = !open;
    if (open && !analyticsSent) {
      analyticsSent = true;
      userSentSinceOpen = false;
      void analytics(sessionId, getBrowsing())
        .then((r) => {
          // Server thread is authoritative; don't clobber an in-flight turn or a fresh visitor.
          if (userSentSinceOpen || !r.messages?.length) return;
          const mapped = r.messages.map(
            (m): ChatMessage => ({ role: m.type === 'human' ? 'user' : 'assistant', content: m.content }),
          );
          messages = [{ role: 'assistant', content: GREETING }, ...mapped];
          persist();
        })
        .catch(() => {});
    }
  }

  async function handleSend(text: string) {
    messages = [...messages, { role: 'user', content: text }];
    userSentSinceOpen = true;
    persist();
    sending = true;
    messages = [...messages, { role: 'assistant', content: '' }];
    const idx = messages.length - 1;
    try {
      await chatStream(sessionId, text, {
        onToken: (v) => {
          messages[idx] = { ...messages[idx], content: messages[idx].content + v };
          messages = [...messages];
        },
        onReset: () => {
          messages[idx] = { ...messages[idx], content: '' };
          messages = [...messages];
        },
        onDone: (_sid, escalate) => {
          if (escalate && !escalated) {
            escalated = true;
            messages = [...messages, { role: 'assistant', content: ESCALATION_NOTE }];
          }
        },
        onError: () => {
          messages[idx] = { role: 'error', content: 'Something went wrong — please try again.' };
          messages = [...messages];
        },
      });
    } finally {
      sending = false;
      persist();
    }
  }

  function panelIn(node: HTMLElement) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 767px)').matches) {
      // Full-screen panel slides up from the bottom.
      gsap.fromTo(node, { y: '12%', opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' });
      return;
    }
    gsap.fromTo(
      node,
      { opacity: 0, y: 16, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'power2.out', transformOrigin: 'bottom right' },
    );
  }

  function onWindowKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) open = false;
  }
</script>

<svelte:window onkeydown={onWindowKey} />

{#if open}
  <section class="panel" use:panelIn role="dialog" aria-label="Chat with BuildSynergy">
    <header class="phead">
      <div class="brand">
        <span class="dot" aria-hidden="true"></span>
        BuildSynergy
      </div>
      <button class="close" onclick={() => (open = false)} aria-label="Close chat">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </header>

    <MessageList {messages} {sending} />
    <ChatInput disabled={sending} onsend={handleSend} />
  </section>
{/if}

<button class="launcher" class:open onclick={toggle} aria-label={open ? 'Close chat' : 'Open chat'} aria-expanded={open}>
  {#if open}
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  {:else}
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 11.5a8.5 8.5 0 01-12.4 7.55L3 20.5l1.45-5.6A8.5 8.5 0 1121 11.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  {/if}
</button>

<style>
  .launcher {
    position: fixed;
    bottom: 1.5rem; right: 1.5rem;
    z-index: 1000;
    width: 56px; height: 56px;
    border: none;
    border-radius: 50%;
    background: #ec4899;
    color: #fff;
    cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 24px rgba(236, 72, 153, 0.35);
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .launcher:hover { transform: translateY(-2px); background: #db2777; box-shadow: 0 12px 36px rgba(236, 72, 153, 0.45); }

  .panel {
    position: fixed;
    bottom: 5.75rem; right: 1.5rem;
    z-index: 1000;
    width: 380px;
    max-width: calc(100vw - 3rem);
    height: 70vh;
    max-height: 560px;
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    backdrop-filter: blur(12px);
  }
  .phead {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg2);
  }
  .brand {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-family: var(--display);
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text);
  }
  .dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #ec4899;
    box-shadow: 0 0 8px rgba(236, 72, 153, 0.7);
  }
  .close {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted);
    display: inline-flex; padding: 0.25rem;
    transition: color 0.2s;
  }
  .close:hover { color: var(--text); }

  /* Mobile: full-screen chat window */
  @media (max-width: 767px) {
    .panel {
      top: 0; left: 0; right: 0; bottom: auto;
      width: auto;
      height: 100dvh;
      max-width: none;
      max-height: none;
      border: none;
      border-radius: 0;
    }
    /* the full-screen panel closes from its own header button */
    .launcher.open { display: none; }

    .phead {
      padding: max(0.95rem, env(safe-area-inset-top)) 1.1rem 0.95rem;
    }
    .brand { font-size: 1.05rem; }
    .close { padding: 0.5rem; }
    .input {
      padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
    }
  }
</style>
