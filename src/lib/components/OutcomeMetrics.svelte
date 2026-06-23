<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { formatMetric, type Metric } from '$lib/portfolio';

  let { metrics }: { metrics: Metric[] } = $props();

  let rowEl: HTMLElement;
  let valueEls: HTMLElement[] = [];

  onMount(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      metrics.forEach((m, i) => { valueEls[i].textContent = formatMetric(m); });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: rowEl,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        metrics.forEach((m, i) => {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: m.value,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: () => {
              valueEls[i].textContent = `${m.prefix ?? ''}${Math.round(obj.v)}${m.suffix ?? ''}`;
            },
          });
        });
      },
    });
    return () => st.kill();
  });
</script>

<div class="metrics" bind:this={rowEl}>
  {#each metrics as m, i}
    <div class="metric">
      <span class="metric-value" bind:this={valueEls[i]}>{m.prefix ?? ''}0{m.suffix ?? ''}</span>
      <span class="metric-label">{m.label}</span>
    </div>
  {/each}
</div>

<style>
  .metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    padding: 2.5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: var(--shadow-sm);
  }
  .metric { display: flex; flex-direction: column; gap: 0.4rem; }
  .metric-value {
    font-family: var(--display);
    font-size: clamp(2.2rem, 4vw, 3rem); font-weight: 800;
    letter-spacing: -0.03em; line-height: 1; color: var(--indigo);
  }
  .metric-label { font-size: 0.9rem; line-height: 1.5; color: var(--text-body); }
  @media (max-width: 700px) { .metrics { grid-template-columns: 1fr; gap: 1.75rem; padding: 1.75rem; } }
</style>
