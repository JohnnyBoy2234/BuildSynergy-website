<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { team } from '$lib/data/team.js';

  let sectionEl: HTMLElement;
  let headingEl: HTMLElement;
  let cardEls:   HTMLElement[] = [];

  // Each role gets a distinct accent from the abstract bg palette
  const accents = [
    { from: '#6366f1', to: '#a855f7' },
    { from: '#a855f7', to: '#e879f9' },
    { from: '#22d3ee', to: '#6366f1' },
    { from: '#e879f9', to: '#22d3ee' },
    { from: '#6366f1', to: '#22d3ee' },
    { from: '#a855f7', to: '#6366f1' },
  ];

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Heading word reveal
    if (headingEl) {
      const words = headingEl.textContent?.split(' ') ?? [];
      headingEl.innerHTML = words
        .map(w => `<span class="word-outer"><span class="word-inner">${w}</span></span>`)
        .join(' ');
      gsap.from(headingEl.querySelectorAll('.word-inner'), {
        y: '110%',
        opacity: 0,
        duration: 0.7,
        stagger: 0.055,
        ease: 'power4.out',
        scrollTrigger: { trigger: headingEl, start: 'top 82%' },
      });
    }

    // Cards clip-path reveal
    if (cardEls.length) {
      gsap.from(cardEls, {
        clipPath: 'inset(0 0 100% 0)',
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionEl, start: 'top 72%' },
      });
    }

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  });
</script>

<section id="team" class="team-section" bind:this={sectionEl}>
  <!-- Violet gradient fill -->
  <div class="team-bg" aria-hidden="true"></div>
  <div class="team-grid-bg" aria-hidden="true"></div>

  <div class="team-inner">
    <div class="team-header">
      <span class="eyebrow">Our Team</span>
      <h2 bind:this={headingEl}>The people behind the work.</h2>
      <p>Strategy, design, development, content, and support a focused team helping businesses show up better online.</p>
    </div>

    <div class="team-grid">
      {#each team as member, i}
        <div class="team-card" bind:this={cardEls[i]}>
          <!-- Gradient top border -->
          <div
            class="card-top-line"
            style="background: linear-gradient(90deg, {accents[i].from}, {accents[i].to})"
            aria-hidden="true"
          ></div>

          <div class="card-avatar"
            style="background: linear-gradient(135deg, {accents[i].from}22, {accents[i].to}15)"
          >
            <span
              class="av-initials"
              style="background: linear-gradient(135deg, {accents[i].from}, {accents[i].to}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
            >{member.initials}</span>
          </div>

          <div class="card-body">
            <div class="card-role">{member.role}</div>
            <p class="card-desc">{member.description}</p>
          </div>

          <!-- Hover glow -->
          <div
            class="card-glow"
            style="background: radial-gradient(ellipse 80% 60% at 50% 0%, {accents[i].from}12, transparent 70%)"
            aria-hidden="true"
          ></div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .team-section {
    position: relative;
    padding: var(--section-pad) var(--gutter);
    background: var(--bg2);
    overflow: hidden;
  }

  .team-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 90% 10%, rgba(168,85,247,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 10% 90%, rgba(99,102,241,0.10) 0%, transparent 60%);
    pointer-events: none;
  }

  .team-grid-bg {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px);
    background-size: 48px 48px;
    opacity: 0.5;
    pointer-events: none;
  }

  .team-inner {
    position: relative;
    z-index: 1;
    max-width: var(--container);
    margin: 0 auto;
  }

  .team-header {
    max-width: 540px;
    margin-bottom: 3.5rem;
  }
  .team-header h2 { margin: 0.6rem 0 1rem; }
  .team-header p  { color: var(--text-body); font-size: 1rem; }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .team-card {
    position: relative;
    background: rgba(10,10,26,0.85);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 2rem 1.75rem;
    overflow: hidden;
    transition: border-color 0.3s, transform 0.3s;
  }
  .team-card:hover {
    border-color: rgba(99,102,241,0.35);
    transform: translateY(-5px);
  }
  .team-card:hover .card-glow { opacity: 1; }

  .card-top-line {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: 0 0 2px 2px;
    opacity: 0.7;
    transition: opacity 0.3s;
  }
  .team-card:hover .card-top-line { opacity: 1; }

  .card-avatar {
    width: 64px; height: 64px;
    border-radius: 50%;
    border: 1px solid rgba(99,102,241,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .team-card:hover .card-avatar {
    border-color: rgba(99,102,241,0.45);
    box-shadow: 0 0 20px rgba(99,102,241,0.18);
  }

  .av-initials {
    font-family: var(--display);
    font-size: 1.1rem;
    font-weight: 700;
  }

  .card-role {
    font-family: var(--display);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  .card-desc {
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: 1.6;
  }

  .card-glow {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
  }

  @media (max-width: 900px) { .team-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 540px) { .team-grid { grid-template-columns: 1fr; } }
</style>
