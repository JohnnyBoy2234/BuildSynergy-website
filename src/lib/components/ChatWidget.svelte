<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import MessageList from './chat/MessageList.svelte';
  import ChatInput from './chat/ChatInput.svelte';
  import { getBrowsing } from '$lib/chat/browsing';
  import {
    getOrCreateSessionId, loadTranscript, saveTranscript, type ChatMessage,
  } from '$lib/chat/session';
  import { analytics, greeting as fetchGreeting, chat as sendChat } from '$lib/chat/api';

  const ESCALATION_NOTE = "I've flagged this for the team — they'll follow up with you directly.";

  let open = $state(false);
  let messages = $state<ChatMessage[]>([]);
  let sending = $state(false);
  let greeted = $state(false);
  let escalated = $state(false);
  let sessionId = '';

  onMount(() => {
    sessionId = getOrCreateSessionId();
    messages = loadTranscript();
    greeted = messages.length > 0;
  });

  function persist() {
    saveTranscript(messages);
  }

  async function toggle() {
    open = !open;
    if (open && !greeted) await runGreeting();
  }

  async function runGreeting() {
    greeted = true;
    sending = true;
    try {
      const browsing = getBrowsing();
      await analytics(sessionId, browsing);
      const { greeting } = await fetchGreeting(sessionId, browsing);
      messages = [...messages, { role: 'assistant', content: greeting }];
    } catch {
      messages = [...messages, { role: 'error', content: "I couldn't start the chat. Please try again." }];
    } finally {
      sending = false;
      persist();
    }
  }

  async function handleSend(text: string) {
    messages = [...messages, { role: 'user', content: text }];
    persist();
    sending = true;
    try {
      const r = await sendChat(sessionId, text);
      messages = [...messages, { role: 'assistant', content: r.reply }];
      if (r.escalate && !escalated) {
        escalated = true;
        messages = [...messages, { role: 'assistant', content: ESCALATION_NOTE }];
      }
    } catch {
      messages = [...messages, { role: 'error', content: 'Something went wrong — please try again.' }];
    } finally {
      sending = false;
      persist();
    }
  }

  function panelIn(node: HTMLElement) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
    background: linear-gradient(135deg, var(--indigo), var(--violet));
    color: #fff;
    cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.45);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .launcher:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(99, 102, 241, 0.6); }

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
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55);
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
    background: var(--cyan);
    box-shadow: 0 0 8px var(--cyan);
  }
  .close {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted);
    display: inline-flex; padding: 0.25rem;
    transition: color 0.2s;
  }
  .close:hover { color: var(--text); }

  /* Lift above the bottom-docked mobile nav (matches Navigation's 767px breakpoint) */
  @media (max-width: 767px) {
    .launcher {
      bottom: 6rem;
    }
    .panel {
      width: auto;
      left: 0.75rem; right: 0.75rem;
      top: 1rem;
      bottom: 10.5rem;
      height: auto;
      max-height: none;
    }
  }
</style>
