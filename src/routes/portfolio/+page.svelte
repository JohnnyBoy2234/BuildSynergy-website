<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { projects } from '$lib/portfolio';
  import Navigation from '$lib/components/Navigation.svelte';
  import AuroraBackground from '$lib/components/AuroraBackground.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Seo from '$lib/components/Seo.svelte';

  let cardEls: HTMLElement[] = [];

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    cardEls.forEach((el, i) => {
      gsap.from(el, {
        y: 28, opacity: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%' },
        delay: (i % 3) * 0.06,
      });
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  });
</script>

<Seo
  title="Our Work | BuildSynergy Portfolio"
  description="Selected websites, apps and brands BuildSynergy has built for South African businesses — with the problem, the build and the outcome for each."
  path="/portfolio"
/>

<Navigation />
<AuroraBackground />

<main class="port">
  <header class="port-head">
    <p class="port-eyebrow">Our work</p>
    <h1 class="port-title">Projects we've shipped.</h1>
    <p class="port-sub">
      A selection of websites, apps and brands we've built for South African businesses.
      Click any project to see the problem, what we built and the outcome.
    </p>
  </header>

  <div class="port-grid">
    {#each projects as project, i}
      <div bind:this={cardEls[i]}>
        <ProjectCard {project} />
      </div>
    {/each}
  </div>
</main>

<Footer />

<style>
  .port {
    max-width: var(--container);
    margin: 0 auto;
    padding: clamp(8rem, 14vw, 11rem) var(--gutter) var(--section-pad);
    position: relative; z-index: 1;
  }
  .port-head { max-width: 720px; display: flex; flex-direction: column; gap: 1rem; margin-bottom: 3.5rem; }
  .port-eyebrow {
    font-family: var(--display); font-size: 0.85rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase; color: var(--indigo);
  }
  .port-title {
    font-size: clamp(2.4rem, 5vw, 3.6rem); font-weight: 800;
    letter-spacing: -0.04em; line-height: 1.05; color: var(--text);
  }
  .port-sub { font-size: 1.05rem; line-height: 1.7; color: var(--text-body); max-width: 600px; }

  .port-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  @media (max-width: 900px) { .port-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .port-grid { grid-template-columns: 1fr; } }
</style>
