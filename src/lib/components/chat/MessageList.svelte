<script lang="ts">
  import type { ChatMessage } from '$lib/chat/session';

  interface Props { messages: ChatMessage[]; sending: boolean }
  const { messages, sending }: Props = $props();

  let log = $state<HTMLDivElement>();
  // Autoscroll to the newest content whenever messages or typing state change.
  $effect(() => {
    void messages.length;
    void sending;
    if (log) log.scrollTop = log.scrollHeight;
  });
</script>

<div class="msglog" bind:this={log} role="log" aria-live="polite" aria-label="Conversation">
  {#each messages as m, i (i)}
    <div class="row {m.role}">
      <div class="bubble {m.role}">{m.content}</div>
    </div>
  {/each}

  {#if sending}
    <div class="row assistant">
      <div class="bubble assistant typing" aria-label="Assistant is typing">
        <span></span><span></span><span></span>
      </div>
    </div>
  {/if}
</div>

<style>
  .msglog {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    scrollbar-width: thin;
  }
  .row { display: flex; }
  .row.user { justify-content: flex-end; }
  .bubble {
    max-width: 85%;
    padding: 0.6rem 0.85rem;
    border-radius: 14px;
    font-size: 0.88rem;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .bubble.assistant {
    background: var(--glass2);
    border: 1px solid var(--border);
    color: var(--text);
    border-bottom-left-radius: 4px;
  }
  .bubble.user {
    background: linear-gradient(135deg, var(--indigo), var(--violet));
    color: #fff;
    border-bottom-right-radius: 4px;
  }
  .bubble.error {
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.4);
    color: rgba(255, 255, 255, 0.9);
  }
  .typing { display: inline-flex; gap: 4px; align-items: center; }
  .typing span {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--text-muted);
    animation: blink 1.2s infinite ease-in-out;
  }
  .typing span:nth-child(2) { animation-delay: 0.2s; }
  .typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink {
    0%, 80%, 100% { opacity: 0.25; }
    40% { opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .typing span { animation: none; opacity: 0.6; }
  }
</style>
