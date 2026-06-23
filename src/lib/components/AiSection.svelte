<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  type Solution = { label: string; desc: string; icon: string; badge?: string };

  const solutions: Solution[] = [
    {
      label: 'AI Chatbots & Assistants',
      desc: "An always on assistant that answers questions and captures leads on your site, exactly like the one you're chatting with right now.",
      badge: 'Live on this site',
      icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 16.5H9l-4 3.5v-3.5H4A1.5 1.5 0 0 1 2.5 15V7A1.5 1.5 0 0 1 4 5.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M7 10h10M7 13h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>
      </svg>`,
    },
    {
      label: 'Document Processing',
      desc: 'Turn invoices, forms, IDs and PDFs into clean, structured data automatically, with no more manual capture.',
      icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 2.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V2.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M14 2.5V6.5h4" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M9 12h6M9 15h6M9 18h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>
      </svg>`,
    },
    {
      label: 'Workflow Automation',
      desc: 'Hand off repetitive admin like quotes, follow ups and data entry to AI that works across the tools you already use.',
      icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="18" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="12" cy="18" r="2.5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8.2 7.2 10.8 16M15.8 7.2 13.2 16M8.5 6h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>
      </svg>`,
    },
    {
      label: 'Custom AI Integrations',
      desc: 'Bespoke AI features built into your existing website or systems, tailored to how your business actually runs.',
      icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="6" y="6" width="12" height="12" rx="3" stroke="currentColor" stroke-width="1.5"/>
        <path d="M9 3.5V6M15 3.5V6M9 18v2.5M15 18v2.5M3.5 9H6M3.5 15H6M18 9h2.5M18 15h2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".5"/>
        <path d="M11 11.5c.2 1.5 1 2.3 2.5 2.5-1.5.2-2.3 1-2.5 2.5-.2-1.5-1-2.3-2.5-2.5 1.5-.2 2.3-1 2.5-2.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
      </svg>`,
    },
  ];

  let headingEl: HTMLElement;
  let headingTextEl: HTMLElement;
  let subEl: HTMLElement;
  let cardEls: HTMLElement[] = [];

  function scrollToContact() {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(headingTextEl.querySelectorAll('.word-inner'), {
      y: '110%', opacity: 0, duration: 0.85, stagger: 0.045, ease: 'power4.out',
      scrollTrigger: { trigger: headingEl, start: 'top 85%' },
    });
    gsap.from(subEl, {
      y: 16, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.25,
      scrollTrigger: { trigger: headingEl, start: 'top 85%' },
    });
    cardEls.forEach((el, i) => {
      gsap.from(el, {
        y: 26, opacity: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
        delay: i * 0.07,
      });
    });

    // Cursor spotlight per card (listeners avoid a11y warnings on non-interactive divs)
    const cleanup: Array<() => void> = [];
    cardEls.forEach((el) => {
      const handler = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      };
      el.addEventListener('mousemove', handler);
      cleanup.push(() => el.removeEventListener('mousemove', handler));
    });

    return () => {
      cleanup.forEach((fn) => fn());
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  });
</script>

<section id="ai" class="ai-section" data-nav-dark>
  <div class="ai-glow ai-glow--1" aria-hidden="true"></div>
  <div class="ai-glow ai-glow--2" aria-hidden="true"></div>

  <div class="ai-inner">
    <div class="ai-header" bind:this={headingEl}>
      <h2 class="ai-heading" bind:this={headingTextEl}>
        <span class="word-outer"><span class="word-inner">The</span></span>
        <span class="word-outer"><span class="word-inner">world</span></span>
        <span class="word-outer"><span class="word-inner">of</span></span>
        <span class="word-outer"><span class="word-inner ai-word-glow">AI.</span></span>
        <br />
        <span class="word-outer"><span class="word-inner">Don't</span></span>
        <span class="word-outer"><span class="word-inner">become</span></span>
        <span class="word-outer"><span class="word-inner ai-word-warn">outdated.</span></span>
      </h2>
      <p class="ai-sub" bind:this={subEl}>
        We design and build practical AI solutions that handle real work, so your team
        spends less time on the repetitive and more on your customers.
      </p>
    </div>

    <div class="ai-grid">
      {#each solutions as s, i}
        <div class="ai-card" bind:this={cardEls[i]}>
          <div class="ai-card-spot" aria-hidden="true"></div>
          <div class="ai-card-icon">{@html s.icon}</div>
          <div class="ai-card-body">
            <div class="ai-card-top">
              <h3 class="ai-card-label">{s.label}</h3>
              {#if s.badge}
                <span class="ai-badge"><span class="ai-badge-dot"></span>{s.badge}</span>
              {/if}
            </div>
            <p class="ai-card-desc">{s.desc}</p>
          </div>
        </div>
      {/each}
    </div>

    <div class="ai-cta-wrap">
      <button class="ai-cta" onclick={scrollToContact}>Get an AI solution →</button>
    </div>
  </div>
</section>

<style>
  .ai-section {
    position: relative;
    padding: var(--section-pad) var(--gutter);
    background:
      radial-gradient(ellipse 70% 60% at 50% 0%, #1a2138 0%, transparent 60%),
      linear-gradient(165deg, #0b0f19 0%, #11152a 55%, #0b0f19 100%);
    overflow: hidden;
    isolation: isolate;
  }

  .ai-glow {
    position: absolute; border-radius: 50%; filter: blur(90px);
    pointer-events: none; z-index: 0;
  }
  .ai-glow--1 {
    top: -10%; left: 8%; width: 420px; height: 420px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.30), transparent 65%);
  }
  .ai-glow--2 {
    bottom: -15%; right: 6%; width: 480px; height: 480px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.24), transparent 65%);
  }

  .ai-inner {
    position: relative; z-index: 1;
    max-width: var(--container); margin: 0 auto;
    display: flex; flex-direction: column; gap: 3rem;
  }

  .ai-header { max-width: 680px; display: flex; flex-direction: column; gap: 1.1rem; }
  .ai-heading {
    font-size: clamp(2rem, 3.8vw, 3.2rem); font-weight: 800;
    letter-spacing: -0.04em; line-height: 1.05; color: #fff;
  }
  .ai-word-glow {
    background: linear-gradient(100deg, #818cf8 0%, #a78bfa 45%, #22d3ee 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
    color: #818cf8;
  }
  .ai-word-warn {
    background: linear-gradient(100deg, #fb923c 0%, #f472b6 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
    color: #fb923c;
  }
  .ai-sub { font-size: 1.05rem; line-height: 1.75; color: rgba(255, 255, 255, 0.7); max-width: 600px; }

  .ai-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
  @media (max-width: 1000px) { .ai-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px)  { .ai-grid { grid-template-columns: 1fr; } }

  .ai-card {
    position: relative; overflow: hidden; isolation: isolate;
    display: flex; flex-direction: column; gap: 1.25rem;
    padding: 1.75rem 1.6rem;
    background: rgba(255, 255, 255, 0.04);
    border: 2px solid rgba(255, 255, 255, 0.12);
    border-radius: 18px;
    transition: border-color 0.3s, transform 0.3s, background 0.3s, box-shadow 0.3s;
  }
  .ai-card:hover {
    border-color: rgba(129, 140, 248, 0.75);
    transform: translateY(-12px) scale(1.035);
    background: rgba(255, 255, 255, 0.07);
    box-shadow: 0 28px 60px rgba(99, 102, 241, 0.45);
  }

  .ai-card-spot {
    position: absolute; inset: 0; z-index: 0; border-radius: inherit; pointer-events: none;
    background: radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(99, 102, 241, 0.22), transparent 65%);
    opacity: 0; transition: opacity 0.4s;
  }
  .ai-card:hover .ai-card-spot { opacity: 1; }

  .ai-card-icon {
    position: relative; z-index: 1;
    width: 50px; height: 50px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(99, 102, 241, 0.14);
    border: 1px solid rgba(129, 140, 248, 0.30);
    color: #c7d2fe;
  }

  .ai-card-body { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 0.55rem; }
  .ai-card-top { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
  .ai-card-label {
    font-family: var(--display); font-size: 1.05rem; font-weight: 700;
    letter-spacing: -0.02em; color: #fff;
  }
  .ai-card-desc { font-size: 0.875rem; line-height: 1.65; color: rgba(255, 255, 255, 0.62); }

  .ai-badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.65rem; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase;
    color: #6ee7b7; background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.30);
    padding: 0.2rem 0.5rem; border-radius: 100px;
  }
  .ai-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #34d399; box-shadow: 0 0 6px #34d399;
    animation: ai-pulse 2s ease-in-out infinite;
  }
  @keyframes ai-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }

  .ai-cta-wrap { display: flex; }
  .ai-cta {
    font-family: var(--display); font-size: 1rem; font-weight: 600; color: #0b0f19;
    background: #fff; border: none; cursor: pointer;
    padding: 0.85rem 1.7rem; border-radius: 100px;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .ai-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.40);
    background: #eef0fe;
  }

  @media (prefers-reduced-motion: reduce) {
    .ai-card, .ai-cta { transition: none !important; transform: none !important; }
    .ai-card-spot { display: none; }
    .ai-badge-dot { animation: none; }
  }
</style>
