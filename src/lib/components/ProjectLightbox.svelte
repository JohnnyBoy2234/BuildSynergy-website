<script lang="ts">
  let {
    images,
    alt,
    open = $bindable(false),
    index = $bindable(0),
  }: { images: string[]; alt: string; open?: boolean; index?: number } = $props();

  let closeBtn: HTMLButtonElement | undefined = $state();

  function close() { open = false; }
  function next() { index = (index + 1) % images.length; }
  function prev() { index = (index - 1 + images.length) % images.length; }

  function onKey(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  }

  let startX = 0;
  function onTouchStart(e: TouchEvent) { startX = e.touches[0].clientX; }
  function onTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
  }

  $effect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
    return () => { document.body.style.overflow = ''; };
  });
</script>

<svelte:window onkeydown={onKey} />

{#if open}
  <div class="lb" role="dialog" aria-modal="true" aria-label={`${alt} gallery`}>
    <button class="lb-backdrop" aria-label="Close gallery" onclick={close}></button>

    <button class="lb-btn lb-close" bind:this={closeBtn} aria-label="Close" onclick={close}>×</button>

    {#if images.length > 1}
      <button class="lb-btn lb-prev" aria-label="Previous image" onclick={prev}>‹</button>
    {/if}

    <img
      class="lb-img"
      src={images[index]}
      alt={`${alt} — image ${index + 1} of ${images.length}`}
      ontouchstart={onTouchStart}
      ontouchend={onTouchEnd}
    />

    {#if images.length > 1}
      <button class="lb-btn lb-next" aria-label="Next image" onclick={next}>›</button>
      <div class="lb-count">{index + 1} / {images.length}</div>
    {/if}
  </div>
{/if}

<style>
  .lb {
    position: fixed; inset: 0; z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: clamp(1rem, 5vw, 4rem);
  }
  .lb-backdrop {
    position: absolute; inset: 0; border: none; cursor: zoom-out;
    background: rgba(11, 15, 25, 0.82);
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  }
  .lb-img {
    position: relative; z-index: 1;
    max-width: 100%; max-height: 100%;
    border-radius: 12px; box-shadow: var(--shadow-lg);
    object-fit: contain;
  }
  .lb-btn {
    position: absolute; z-index: 2;
    display: flex; align-items: center; justify-content: center;
    width: 48px; height: 48px; border-radius: 100px;
    background: rgba(255, 255, 255, 0.92); color: var(--text);
    border: 1px solid var(--border); cursor: pointer;
    font-size: 1.6rem; line-height: 1;
    box-shadow: var(--shadow-md);
    transition: background 0.2s, transform 0.2s;
  }
  .lb-btn:hover { background: #fff; transform: scale(1.05); }
  .lb-close { top: clamp(1rem, 3vw, 2rem); right: clamp(1rem, 3vw, 2rem); }
  .lb-prev { left: clamp(0.5rem, 3vw, 2rem); top: 50%; transform: translateY(-50%); }
  .lb-next { right: clamp(0.5rem, 3vw, 2rem); top: 50%; transform: translateY(-50%); }
  .lb-prev:hover, .lb-next:hover { transform: translateY(-50%) scale(1.05); }
  .lb-count {
    position: absolute; z-index: 2; bottom: clamp(1rem, 3vw, 2rem); left: 50%; transform: translateX(-50%);
    font-family: var(--display); font-size: 0.85rem; font-weight: 600;
    color: #fff; background: rgba(11, 15, 25, 0.6); padding: 0.35rem 0.9rem; border-radius: 100px;
  }
  @media (prefers-reduced-motion: reduce) { .lb-btn { transition: none; } }
</style>
