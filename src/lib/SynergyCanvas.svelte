<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { SynergyCore } from './SynergyCore';

  export let scrollProgress: number = 0;
  export let isMobile: boolean = false;

  let canvas: HTMLCanvasElement;
  let core: SynergyCore | null = null;
  let observer: ResizeObserver | null = null;

  $: if (core) core.setProgress(scrollProgress);

  onMount(() => {
    if (!canvas) return;

    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;

    core = new SynergyCore();
    core.init(canvas, w, h);

    observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (core && width > 0 && height > 0) {
          core.resize(width, height);
        }
      }
    });
    observer.observe(canvas);

    return () => {
      observer?.disconnect();
      core?.dispose();
    };
  });

  onDestroy(() => {
    observer?.disconnect();
    core?.dispose();
  });
</script>

<canvas
  bind:this={canvas}
  class="synergy-canvas"
  class:mobile={isMobile}
></canvas>

<style>
  .synergy-canvas {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
  }
</style>
