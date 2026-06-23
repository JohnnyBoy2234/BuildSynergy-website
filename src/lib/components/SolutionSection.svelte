<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  const pillars = [
    {
      label: 'Website Design & Development',
      desc:  'A complete, professional website built around your business with managed hosting and monthly care included as standard.',
      accent: '#6366f1',
      glow:   'rgba(99,102,241,0.16)',
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="2" y="3.5" width="24" height="16" rx="2" stroke="currentColor" stroke-width="1.4"/>
        <path d="M2 9h24" stroke="currentColor" stroke-width="1.2" opacity=".4"/>
        <circle cx="5.5" cy="6.25" r="1" fill="currentColor" opacity=".45"/>
        <circle cx="8.5" cy="6.25" r="1" fill="currentColor" opacity=".45"/>
        <path d="M7 13h8M7 16h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".4"/>
        <path d="M10 24h8M14 19.5V24" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>`,
    },
    {
      label: 'Mobile App Development',
      desc:  'Custom iOS and Android apps that give your business its own presence directly on your customers\' devices.',
      accent: '#8b5cf6',
      glow:   'rgba(139,92,246,0.16)',
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="8" y="2" width="12" height="24" rx="2.5" stroke="currentColor" stroke-width="1.4"/>
        <path d="M8 7h12M8 21h12" stroke="currentColor" stroke-width="1.1" opacity=".4"/>
        <circle cx="14" cy="23.5" r="0.9" fill="currentColor" opacity=".5"/>
        <path d="M11 13h6M13 10.5l2.5 2.5-2.5 2.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/>
      </svg>`,
    },
    {
      label: 'Lead Capture & Quote Systems',
      desc:  'Smart enquiry forms and quote request flows that turn website visitors into real customers.',
      accent: '#3b82f6',
      glow:   'rgba(59,130,246,0.16)',
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M3 5h22v14a1.5 1.5 0 0 1-1.5 1.5h-19A1.5 1.5 0 0 1 3 19V5z" stroke="currentColor" stroke-width="1.4"/>
        <path d="M3 5l11 8.5L25 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="20.5" cy="21.5" r="4.5" fill="var(--bg2,#F7F9FC)" stroke="currentColor" stroke-width="1.3"/>
        <path d="M19 21.5h3M20.5 20v3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg>`,
    },
    {
      label: 'Google Visibility & SEO',
      desc:  'Local SEO setup and Google presence so nearby customers can find your business and understand what you offer.',
      accent: '#06b6d4',
      glow:   'rgba(6,182,212,0.16)',
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="12.5" cy="12.5" r="8.5" stroke="currentColor" stroke-width="1.4"/>
        <path d="M19 19l5.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12.5 6.5c0 0-4 2.5-4 6s4 6 4 6" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity=".45"/>
        <path d="M8.5 10h8M8.5 14.5h6" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity=".4"/>
      </svg>`,
    },
    {
      label: 'E-Commerce',
      desc:  'Online stores that make it easy for customers to browse, buy and pay, with secure checkout built in.',
      accent: '#6366f1',
      glow:   'rgba(99,102,241,0.16)',
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M6 8h16l-1.5 11.5a1.5 1.5 0 0 1-1.5 1.5H9a1.5 1.5 0 0 1-1.5-1.5L6 8z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M9.5 8V6.5a4.5 4.5 0 0 1 9 0V8" stroke="currentColor" stroke-width="1.4"/>
        <circle cx="11.5" cy="14" r="1" fill="currentColor" opacity=".55"/>
        <circle cx="16.5" cy="14" r="1" fill="currentColor" opacity=".55"/>
      </svg>`,
    },
    {
      label: 'AI Development & Integration',
      desc:  'Custom AI tools and integrations that automate repetitive tasks and add intelligent features to the systems your business already uses.',
      accent: '#8b5cf6',
      glow:   'rgba(139,92,246,0.16)',
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="6.5" y="6.5" width="15" height="15" rx="4" stroke="currentColor" stroke-width="1.4"/>
        <path d="M11 3.5V6M17 3.5V6M11 22v2.5M17 22v2.5M3.5 11H6M3.5 17H6M22 11h2.5M22 17h2.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".4"/>
        <path d="M14 9.5c.3 2.7 1.8 4.2 4.5 4.5-2.7.3-4.2 1.8-4.5 4.5-.3-2.7-1.8-4.2-4.5-4.5 2.7-.3 4.2-1.8 4.5-4.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
      </svg>`,
    },
  ];

  let sectionEl: HTMLElement;
  let headingEl: HTMLElement;
  let subEl:     HTMLElement;
  let cardEls:   HTMLElement[] = [];
  let closerEl:  HTMLElement;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (headingEl) {
      const words = headingEl.textContent?.split(' ') ?? [];
      headingEl.innerHTML = words
        .map(w => `<span class="word-outer"><span class="word-inner">${w}</span></span>`)
        .join(' ');
      gsap.from(headingEl.querySelectorAll('.word-inner'), {
        y: '110%', opacity: 0, duration: 0.8, stagger: 0.035, ease: 'power4.out',
        scrollTrigger: { trigger: headingEl, start: 'top 85%' },
      });
    }

    gsap.from(subEl, {
      y: 16, opacity: 0, duration: 0.65, ease: 'power3.out',
      scrollTrigger: { trigger: subEl, start: 'top 88%' },
    });

    /* Each card enters from a slightly different direction */
    const directions = [
      { x: -28, y: 24 },
      { x:   0, y: 20 },
      { x:  28, y: 24 },
      { x: -28, y: 32 },
      { x:   0, y: 32 },
      { x:  28, y: 32 },
    ];
    cardEls.forEach((el, i) => {
      gsap.from(el, {
        x: directions[i].x, y: directions[i].y, opacity: 0,
        duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
        delay: i * 0.06,
      });
    });

    gsap.from(closerEl, {
      y: 14, opacity: 0, duration: 0.65, ease: 'power3.out',
      scrollTrigger: { trigger: closerEl, start: 'top 92%' },
    });

    /* Spotlight: track cursor position per card via CSS custom props */
    const cleanup: Array<() => void> = [];
    cardEls.forEach(el => {
      const handler = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      };
      el.addEventListener('mousemove', handler);
      cleanup.push(() => el.removeEventListener('mousemove', handler));
    });

    return () => {
      cleanup.forEach(fn => fn());
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  });
</script>

<section id="services" class="sol-section" bind:this={sectionEl}>
  <div class="sol-glow-l" aria-hidden="true"></div>
  <div class="sol-glow-r" aria-hidden="true"></div>

  <div class="sol-container">

    <!-- Header -->
    <div class="sol-header">
      <h2 class="sol-heading" bind:this={headingEl}>
        Digital Solutions
      </h2>
      <p class="sol-sub" bind:this={subEl}>
        BuildSynergy creates modern digital systems that help customers find you, trust you and contact you faster without you having to manage the technical side.
      </p>
    </div>

    <!-- Uniform card grid -->
    <div class="sol-grid">
      {#each pillars as p, i}
        <div
          class="sol-card"
          bind:this={cardEls[i]}
          style="--accent:{p.accent}; --glow:{p.glow}"
        >
          <!-- Spotlight glow that follows the cursor -->
          <div class="card-spotlight" aria-hidden="true"></div>

          <!-- Top edge beam that sweeps in on hover -->
          <div class="card-beam" aria-hidden="true"></div>

          <!-- Large faded number in the background -->
          <span class="card-num" aria-hidden="true">0{i + 1}</span>

          <!-- Icon -->
          <div class="card-icon-wrap">
            <div class="card-icon-glow" aria-hidden="true"></div>
            <span class="card-icon">{@html p.icon}</span>
          </div>

          <!-- Text -->
          <div class="card-body">
            <h3 class="card-label">{p.label}</h3>
            <p class="card-desc">{p.desc}</p>
          </div>

        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  /* ── Shell ─────────────────────────────────────────────────────── */
  .sol-section {
    position: relative;
    padding: var(--section-pad) var(--gutter);
    background: transparent;
    overflow: hidden;
  }

  .sol-glow-l {
    position: absolute; top: 0; left: -8%;
    width: 600px; height: 600px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 65%);
    pointer-events: none;
    animation: sol-drift-l 18s ease-in-out infinite alternate;
  }
  .sol-glow-r {
    position: absolute; bottom: 0; right: -6%;
    width: 500px; height: 500px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 65%);
    pointer-events: none;
    animation: sol-drift-r 22s ease-in-out infinite alternate;
  }

  @keyframes sol-drift-l {
    from { transform: translate(0, 0) scale(1);       opacity: 1; }
    to   { transform: translate(45px, 70px) scale(1.12); opacity: 0.65; }
  }
  @keyframes sol-drift-r {
    from { transform: translate(0, 0) scale(1);        opacity: 1; }
    to   { transform: translate(-35px, -55px) scale(0.88); opacity: 0.6; }
  }

  /* ── Container ─────────────────────────────────────────────────── */
  .sol-container {
    position: relative; z-index: 1;
    max-width: var(--container);
    margin: 0 auto;
    display: flex; flex-direction: column; gap: 3.5rem;
  }

  /* ── Header ────────────────────────────────────────────────────── */
  .sol-header { display: flex; flex-direction: column; gap: 1.2rem; max-width: 700px; }

  .sol-heading {
    font-size: clamp(2rem, 3.6vw, 3.2rem);
    font-weight: 800; letter-spacing: -0.04em; line-height: 1.06;
    color: var(--text);
  }

  .sol-sub {
    font-size: 1rem; color: var(--text-body);
    line-height: 1.75; max-width: 560px;
  }

  /* ── Card grid 3 columns × 2 rows ───────────────────────────── */
  .sol-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.875rem;
  }

  /* ── Card ──────────────────────────────────────────────────────── */
  .sol-card {
    position: relative;
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: 20px;
    padding: 2rem 1.85rem;
    display: flex; flex-direction: column; gap: 1.5rem;
    cursor: default;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
    isolation: isolate;
  }

  .sol-card:hover {
    border-color: color-mix(in srgb, var(--accent) 75%, transparent);
    transform: translateY(-12px) scale(1.035);
    box-shadow:
      var(--shadow-lg),
      0 28px 60px color-mix(in srgb, var(--accent) 40%, transparent);
  }

  /* Spotlight follows cursor via --mx / --my CSS vars */
  .card-spotlight {
    position: absolute; inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      260px circle at var(--mx, 50%) var(--my, 50%),
      var(--glow),
      transparent 65%
    );
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
    z-index: 0;
  }
  .sol-card:hover .card-spotlight { opacity: 1; }

  /* Top beam that sweeps left → right on hover */
  .card-beam {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    z-index: 1;
  }
  .sol-card:hover .card-beam { transform: scaleX(1); }

  /* Large faded number purely decorative depth */
  .card-num {
    position: absolute;
    bottom: -0.6rem; right: 1.2rem;
    font-family: var(--display);
    font-size: clamp(4rem, 7vw, 6.5rem);
    font-weight: 900;
    letter-spacing: -0.06em;
    color: var(--accent);
    opacity: 0.045;
    line-height: 1;
    pointer-events: none;
    z-index: 0;
    transition: opacity 0.3s;
    user-select: none;
  }
  .sol-card:hover .card-num { opacity: 0.08; }

  /* Icon wrapper */
  .card-icon-wrap {
    position: relative;
    z-index: 2;
    width: 52px; height: 52px;
    border-radius: 15px;
    background: var(--surface2);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.3s, background 0.3s;
  }
  .sol-card:hover .card-icon-wrap {
    border-color: color-mix(in srgb, var(--accent) 35%, transparent);
    background: color-mix(in srgb, var(--accent) 8%, transparent);
  }

  .card-icon-glow {
    position: absolute; inset: -6px;
    border-radius: 20px;
    background: var(--indigo-soft);
    opacity: 0;
    transition: opacity 0.35s;
  }
  .sol-card:hover .card-icon-glow { opacity: 1; }

  .card-icon {
    position: relative; z-index: 1;
    display: flex; align-items: center;
    color: var(--accent);
    opacity: 0.7;
    transition: opacity 0.25s;
  }
  .sol-card:hover .card-icon { opacity: 1; }

  /* Text */
  .card-body {
    position: relative; z-index: 2;
    display: flex; flex-direction: column; gap: 0.6rem;
    flex: 1;
  }

  .card-label {
    font-family: var(--display);
    font-size: 1.05rem; font-weight: 700; letter-spacing: -0.02em;
    color: var(--text);
    line-height: 1.25;
    transition: color 0.2s;
  }
  .sol-card:hover .card-label { color: var(--text); }

  .card-desc {
    font-size: 0.875rem; color: var(--text-body);
    line-height: 1.7;
    transition: color 0.2s;
  }
  .sol-card:hover .card-desc { color: var(--text-body); }

  /* ── Closer ────────────────────────────────────────────────────── */
  .sol-closer {
    font-family: var(--display);
    font-size: clamp(1rem, 1.5vw, 1.1rem);
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: -0.01em;
  }
  .sol-closer span { color: var(--text); font-weight: 600; }

  /* ── Responsive ────────────────────────────────────────────────── */
  @media (max-width: 900px) {
    .sol-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 540px) {
    .sol-grid { grid-template-columns: 1fr; }
  }

  @media (prefers-reduced-motion: reduce) {
    .sol-card { transition: none !important; transform: none !important; }
    .card-beam, .card-spotlight, .card-icon-glow { display: none; }
  }
</style>
