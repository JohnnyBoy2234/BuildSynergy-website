<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import SectionCanvas from './SectionCanvas.svelte';
  import LeadFunnel from './funnel/LeadFunnel.svelte';

  let panelEl:   HTMLElement;
  let headingEl: HTMLElement;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (headingEl) {
      const words = headingEl.textContent?.split(' ') ?? [];
      headingEl.innerHTML = words
        .map(w => `<span class="word-outer"><span class="word-inner">${w}</span></span>`)
        .join(' ');
      gsap.from(headingEl.querySelectorAll('.word-inner'), {
        y: '110%',
        opacity: 0,
        duration: 0.7,
        stagger: 0.04,
        ease: 'power4.out',
        scrollTrigger: { trigger: headingEl, start: 'top 82%' },
      });
    }

    if (panelEl) {
      gsap.from(panelEl, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: panelEl, start: 'top 85%' },
      });
    }

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  });
</script>

<section id="contact" class="contact-section">
  <!-- Particle network -->
  <SectionCanvas particleCount={45} opacity={0.35} />

  <!-- Atmospheric glows -->
  <div class="ct-glow ct-glow--l" aria-hidden="true"></div>
  <div class="ct-glow ct-glow--r" aria-hidden="true"></div>

  <div class="ct-inner">
    <div class="ct-header">
      <span class="eyebrow">Start a Project</span>
      <h2 bind:this={headingEl}>Ready to give your business a stronger online presence?</h2>
      <p>Tell us about your business and what you'd like to improve. We'll help you identify the right digital solution.</p>
    </div>

    <div class="ct-panel" bind:this={panelEl}>
      <LeadFunnel />
    </div>
  </div>
</section>

<style>
  .contact-section {
    position: relative;
    padding: var(--section-pad) var(--gutter);
    background: var(--bg);
    overflow: hidden;
  }

  .ct-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
  }
  .ct-glow--l {
    width: 500px; height: 500px;
    top: 10%; left: -5%;
    background: rgba(99,102,241,0.10);
  }
  .ct-glow--r {
    width: 400px; height: 400px;
    bottom: 10%; right: -5%;
    background: rgba(168,85,247,0.09);
  }

  .ct-inner {
    position: relative;
    z-index: 1;
    max-width: var(--container);
    margin: 0 auto;
  }

  .ct-header { max-width: 560px; margin-bottom: 3.5rem; }
  .ct-header h2 { margin: 0.6rem 0 1rem; }
  .ct-header p  { color: var(--text-body); font-size: 1rem; }

  /* Panel */
  .ct-panel {
    background: rgba(8,8,22,0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 3rem;
    max-width: 860px;
  }

  @media (max-width: 768px) {
    .ct-panel { padding: 2rem 1.5rem; }
  }
</style>
