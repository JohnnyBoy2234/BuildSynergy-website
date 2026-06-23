<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { projects } from '$lib/portfolio';
  import ProjectCard from './ProjectCard.svelte';

  const featured = projects.filter((p) => p.featured).slice(0, 3);

  let headingEl: HTMLElement;
  let cardEls: HTMLElement[] = [];

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(headingEl, {
      y: 18, opacity: 0, duration: 0.65, ease: 'power3.out',
      scrollTrigger: { trigger: headingEl, start: 'top 88%' },
    });
    cardEls.forEach((el, i) => {
      gsap.from(el, {
        y: 28, opacity: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
        delay: i * 0.06,
      });
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  });
</script>

<section id="work" class="teaser">
  <div class="teaser-inner">
    <div class="teaser-head" bind:this={headingEl}>
      <div>
        <p class="teaser-eyebrow">Selected work</p>
        <h2 class="teaser-title">Real businesses, real results.</h2>
      </div>
      <a class="teaser-all" href="/portfolio">View all work →</a>
    </div>

    <div class="teaser-grid">
      {#each featured as project, i}
        <div bind:this={cardEls[i]}>
          <ProjectCard {project} />
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .teaser { padding: var(--section-pad) var(--gutter); position: relative; }
  .teaser-inner { max-width: var(--container); margin: 0 auto; display: flex; flex-direction: column; gap: 3rem; }
  .teaser-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
  .teaser-eyebrow {
    font-family: var(--display); font-size: 0.85rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase; color: var(--indigo); margin-bottom: 0.6rem;
  }
  .teaser-title {
    font-size: clamp(2rem, 3.6vw, 3rem); font-weight: 800;
    letter-spacing: -0.04em; line-height: 1.06; color: var(--text);
  }
  .teaser-all {
    font-family: var(--display); font-size: 0.95rem; font-weight: 600;
    color: var(--indigo); text-decoration: none; white-space: nowrap;
    transition: transform 0.25s;
  }
  .teaser-all:hover { transform: translateX(3px); }
  .teaser-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  @media (max-width: 900px) { .teaser-grid { grid-template-columns: 1fr; } }
  @media (prefers-reduced-motion: reduce) { .teaser-all { transition: none; } }
</style>
