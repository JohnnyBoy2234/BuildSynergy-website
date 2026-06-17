<script lang="ts">
  interface Props { disabled: boolean; onsend: (text: string) => void }
  const { disabled, onsend }: Props = $props();

  let text = $state('');
  let ta = $state<HTMLTextAreaElement>();

  function submit() {
    const t = text.trim();
    if (!t || disabled) return;
    onsend(t);
    text = '';
    ta?.focus();
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  // Focus the field when the panel (and this input) mount on open.
  function autofocus(node: HTMLTextAreaElement) {
    node.focus();
  }
</script>

<form class="input" onsubmit={(e) => { e.preventDefault(); submit(); }}>
  <textarea
    bind:this={ta}
    bind:value={text}
    {onkeydown}
    use:autofocus
    rows="1"
    placeholder="Type a message…"
    aria-label="Message"
  ></textarea>
  <button type="submit" class="send" disabled={disabled || !text.trim()} aria-label="Send message">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.5 12h15m0 0l-6-6m6 6l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</form>

<style>
  .input {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    padding: 0.75rem;
    border-top: 1px solid var(--border);
    background: var(--bg2);
  }
  textarea {
    flex: 1;
    resize: none;
    max-height: 120px;
    background: rgba(6, 6, 18, 0.9);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0.6rem 0.8rem;
    color: var(--text);
    font-family: var(--sans);
    font-size: 0.88rem;
    line-height: 1.4;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  textarea::placeholder { color: var(--text-muted); }
  textarea:focus {
    border-color: rgba(99, 102, 241, 0.55);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  .send {
    flex-shrink: 0;
    width: 40px; height: 40px;
    display: inline-flex; align-items: center; justify-content: center;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--indigo), var(--violet));
    color: #fff;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
  }
  .send:hover:not(:disabled) { transform: translateY(-1px); }
  .send:disabled { opacity: 0.4; cursor: default; }
</style>
