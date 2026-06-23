<script lang="ts">
  import { onMount, tick } from 'svelte';

  const navItems = [
    {
      name: 'Home', id: 'home',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 12L12 3l9 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    },
    {
      name: 'Services', id: 'services',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      </svg>`,
    },
    {
      name: 'Process', id: 'process',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="5" cy="12" r="2.2" stroke="currentColor" stroke-width="1.4"/>
        <circle cx="12" cy="12" r="2.2" stroke="currentColor" stroke-width="1.4"/>
        <circle cx="19" cy="12" r="2.2" stroke="currentColor" stroke-width="1.4"/>
        <path d="M7.2 12h2.6M14.2 12h2.6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".4"/>
      </svg>`,
    },
    {
      name: 'Work', id: 'work',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 6V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.5"/>
      </svg>`,
    },
    {
      name: 'Packages', id: 'packages',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" stroke-width="1.5"/>
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity=".45"/>
      </svg>`,
    },
    {
      name: 'Contact', id: 'contact',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.5"/>
        <path d="M22 6l-10 7L2 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity=".55"/>
      </svg>`,
    },
  ];

  let activeTab = $state(navItems[0].name);
  let lampLeft  = $state(0);
  let lampWidth = $state(0);
  let pillEl:   HTMLElement;
  let itemEls:  HTMLElement[] = [];
  let isMobile  = $state(false);
  let scrolled  = $state(false);

  let hideLabels = $derived(!isMobile && scrolled);

  async function activate(name: string, index: number, scroll = false) {
    activeTab = name;
    if (scroll) document.querySelector(`#${navItems[index].id}`)?.scrollIntoView({ behavior: 'smooth' });
    await tick();
    moveLamp(index);
  }

  function moveLamp(index: number) {
    const el = itemEls[index];
    if (!el || !pillEl) return;
    const nr = pillEl.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    lampLeft  = er.left - nr.left;
    lampWidth = er.width;
  }

  function refreshLamp() {
    const i = navItems.findIndex(n => n.name === activeTab);
    if (i !== -1) moveLamp(i);
  }

  // Re-measure lamp whenever collapsed state or mobile state changes
  $effect(() => {
    const _ = hideLabels;
    const t = setTimeout(() => requestAnimationFrame(refreshLamp), 360);
    return () => clearTimeout(t);
  });

  $effect(() => {
    const _ = isMobile;
    const t = setTimeout(() => requestAnimationFrame(refreshLamp), 80);
    return () => clearTimeout(t);
  });

  onMount(async () => {
    const checkMobile = () => { isMobile = window.innerWidth < 768; };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const onScroll = () => {
      scrolled = window.scrollY > 80;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    await tick();
    moveLamp(0);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const i = navItems.findIndex(n => n.id === e.target.id);
          if (i !== -1) activate(navItems[i].name, i);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    navItems.forEach(n => {
      const el = document.querySelector(`#${n.id}`);
      if (el) io.observe(el);
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  });
</script>

<!-- Mobile-only top brand bar -->
{#if isMobile}
<div class="mobile-topbar">
  <a
    class="mobile-brand"
    href="/"
    onclick={(e) => { e.preventDefault(); activate('Home', 0, true); }}
    aria-label="BuildSynergy Home"
  >
    <svg class="mobile-logo-mark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="lgMark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="#6366f1"/>
          <stop offset="50%"  stop-color="#a855f7"/>
          <stop offset="100%" stop-color="#22d3ee"/>
        </linearGradient>
      </defs>
      <path d="M12 2 L20 9 L12 22 L4 9 Z" stroke="url(#lgMark)" stroke-width="1.4" fill="none" stroke-linejoin="round"/>
      <path d="M12 6 L17 10 L12 18 L7 10 Z" fill="url(#lgMark)" opacity="0.25"/>
      <circle cx="12" cy="2"  r="1.4" fill="#6366f1"/>
      <circle cx="20" cy="9"  r="1.1" fill="#a855f7"/>
      <circle cx="4"  cy="9"  r="1.1" fill="#22d3ee"/>
      <circle cx="12" cy="22" r="1.2" fill="#22d3ee"/>
    </svg>
    <span class="mobile-brand-name">Build<span class="mobile-brand-accent">Synergy</span></span>
  </a>
  <a
    href="#contact"
    class="mobile-topbar-cta"
    onclick={(e) => { e.preventDefault(); activate('Contact', 5, true); }}
  >
    Start a Project
  </a>
</div>
{/if}

<!-- Floating nav pill -->
<header class="nav-wrap" class:mobile={isMobile}>
  <nav
    class="nav-pill"
    class:collapsed={hideLabels}
    bind:this={pillEl}
    aria-label="Main navigation"
  >
    <!-- Logo (desktop only) -->
    {#if !isMobile}
      <a
        class="nav-logo-pill"
        href="/"
        onclick={(e) => { e.preventDefault(); activate('Home', 0, true); }}
        aria-label="BuildSynergy Home"
      >
        <svg class="logo-mark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="lgMarkDesktop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stop-color="#6366f1"/>
              <stop offset="50%"  stop-color="#a855f7"/>
              <stop offset="100%" stop-color="#22d3ee"/>
            </linearGradient>
          </defs>
          <path d="M12 2 L20 9 L12 22 L4 9 Z" stroke="url(#lgMarkDesktop)" stroke-width="1.4" fill="none" stroke-linejoin="round"/>
          <path d="M12 6 L17 10 L12 18 L7 10 Z" fill="url(#lgMarkDesktop)" opacity="0.25"/>
          <circle cx="12" cy="2"  r="1.4" fill="#6366f1"/>
          <circle cx="20" cy="9"  r="1.1" fill="#a855f7"/>
          <circle cx="4"  cy="9"  r="1.1" fill="#22d3ee"/>
          <circle cx="12" cy="22" r="1.2" fill="#22d3ee"/>
        </svg>
        <span class="logo-text" class:logo-hidden={hideLabels}>
          Build<span class="logo-accent">Synergy</span>
        </span>
      </a>

      <div class="nav-sep" aria-hidden="true"></div>
    {/if}

    <!-- Sliding lamp indicator -->
    <div
      class="lamp"
      style="left: {lampLeft}px; width: {lampWidth}px"
      aria-hidden="true"
    >
      <div class="lamp-bar">
        <div class="lamp-bloom lamp-bloom--wide"></div>
        <div class="lamp-bloom lamp-bloom--mid"></div>
        <div class="lamp-bloom lamp-bloom--tight"></div>
      </div>
    </div>

    {#each navItems as item, i}
      <button
        class="nav-item"
        class:active={activeTab === item.name}
        bind:this={itemEls[i]}
        onclick={() => activate(item.name, i, true)}
        aria-current={activeTab === item.name ? 'page' : undefined}
        aria-label={item.name}
      >
        <span class="nav-icon">{@html item.icon}</span>
        <span class="nav-label">{item.name}</span>
      </button>
    {/each}

    <!-- CTA (desktop only) -->
    {#if !isMobile}
      <a
        href="#contact"
        class="nav-cta"
        class:cta-icon={hideLabels}
        onclick={(e) => { e.preventDefault(); activate('Contact', 5, true); }}
      >
        {#if hideLabels}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        {:else}
          Start a Project
        {/if}
      </a>
    {/if}
  </nav>
</header>

<style>
  /* ── Mobile top brand bar ────────────────────────────────────────── */
  .mobile-topbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 101;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    background: rgba(8, 8, 22, 0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(99, 102, 241, 0.14);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  }

  .mobile-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
  }

  .mobile-logo-mark {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    filter: drop-shadow(0 0 6px rgba(99, 102, 241, 0.45));
  }

  .mobile-brand-name {
    font-family: var(--display);
    font-size: 1.45rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: rgba(255, 255, 255, 0.92);
    white-space: nowrap;
  }

  .mobile-brand-accent {
    background: linear-gradient(135deg, #a5b4fc, #22d3ee);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .mobile-topbar-cta {
    font-family: var(--display);
    font-size: 0.78rem;
    font-weight: 600;
    color: #fff;
    text-decoration: none;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    padding: 0.45rem 0.9rem;
    border-radius: 100px;
    white-space: nowrap;
    transition: opacity 0.2s, box-shadow 0.2s;
    flex-shrink: 0;
  }
  .mobile-topbar-cta:hover {
    opacity: 0.88;
    box-shadow: 0 0 14px rgba(99, 102, 241, 0.4);
  }

  /* ── Wrapper ─────────────────────────────────────────────────────── */
  .nav-wrap {
    position: fixed;
    top: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    overflow: visible;
  }
  .nav-wrap.mobile {
    top: auto;
    bottom: 1.5rem;
  }

  /* ── Pill ─────────────────────────────────────────────────────────── */
  .nav-pill {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.1rem;
    background: rgba(8, 8, 22, 0.55);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(99,102,241,0.18);
    border-radius: 100px;
    padding: 0.3rem 0.3rem;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 4px 24px rgba(0,0,0,0.4);
    overflow: visible;
    transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ── Logo (desktop only) ──────────────────────────────────────────── */
  .nav-logo-pill {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    padding: 0.45rem 0.75rem 0.45rem 0.6rem;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  .logo-mark {
    width: 26px;
    height: 26px;
    flex-shrink: 0;
    filter: drop-shadow(0 0 6px rgba(99,102,241,0.45));
  }

  .logo-text {
    font-family: var(--display);
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: rgba(255,255,255,0.92);
    white-space: nowrap;
    overflow: hidden;
    max-width: 150px;
    opacity: 1;
    transition: max-width 0.32s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.25s ease;
  }
  .logo-text.logo-hidden {
    max-width: 0;
    opacity: 0;
  }

  .logo-accent {
    background: linear-gradient(135deg, #a5b4fc, #22d3ee);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Separator ────────────────────────────────────────────────────── */
  .nav-sep {
    width: 1px;
    height: 18px;
    background: rgba(255,255,255,0.1);
    flex-shrink: 0;
  }

  /* ── Lamp indicator ──────────────────────────────────────────────── */
  .lamp {
    position: absolute;
    top: 0;
    height: 100%;
    border-radius: 100px;
    background: rgba(99,102,241,0.12);
    transition: left 0.38s cubic-bezier(0.25, 1, 0.5, 1),
                width 0.38s cubic-bezier(0.25, 1, 0.5, 1);
    pointer-events: none;
    z-index: 0;
    overflow: visible;
  }

  .lamp-bar {
    position: absolute;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    height: 3px;
    background: linear-gradient(90deg, rgba(99,102,241,0), #a855f7, rgba(99,102,241,0));
    border-radius: 0 0 4px 4px;
  }

  .lamp-bloom {
    position: absolute;
    border-radius: 50%;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(168,85,247,0.25);
    filter: blur(6px);
  }
  .lamp-bloom--wide  { width: 48px; height: 12px; top: -6px; filter: blur(8px); }
  .lamp-bloom--mid   { width: 28px; height: 8px;  top: -4px; filter: blur(5px); }
  .lamp-bloom--tight { width: 14px; height: 6px;  top: -2px; filter: blur(3px); background: rgba(168,85,247,0.5); }

  /* ── Nav items ────────────────────────────────────────────────────── */
  .nav-item {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 0;
    font-family: var(--display);
    font-size: 0.82rem;
    font-weight: 500;
    color: rgba(255,255,255,0.52);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.45rem 0.85rem;
    border-radius: 100px;
    transition: color 0.2s, padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
  }
  .nav-item:hover  { color: rgba(255,255,255,0.85); }
  .nav-item.active { color: #fff; }

  /* Icon */
  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    opacity: 0.65;
    transition: opacity 0.2s;
  }
  .nav-item:hover .nav-icon,
  .nav-item.active .nav-icon { opacity: 1; }

  /* Label */
  .nav-label {
    overflow: hidden;
    max-width: 80px;
    margin-left: 0.35rem;
    opacity: 1;
    white-space: nowrap;
    transition: max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.22s ease,
                margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Desktop collapsed: icons only */
  .nav-pill.collapsed .nav-label {
    max-width: 0;
    opacity: 0;
    margin-left: 0;
  }
  .nav-pill.collapsed .nav-item {
    padding: 0.45rem 0.65rem;
  }

  /* ── Mobile items: stacked icon + label ──────────────────────────── */
  .nav-wrap.mobile .nav-item {
    flex-direction: column;
    gap: 0.2rem;
    padding: 0.4rem 0.9rem 0.35rem;
  }
  .nav-wrap.mobile .nav-label {
    font-size: 0.56rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    max-width: none;
    margin-left: 0;
    opacity: 1;
  }
  .nav-wrap.mobile .nav-icon {
    opacity: 0.7;
  }
  .nav-wrap.mobile .nav-item.active .nav-icon,
  .nav-wrap.mobile .nav-item:hover .nav-icon {
    opacity: 1;
  }

  /* ── CTA button (desktop only) ────────────────────────────────────── */
  .nav-cta {
    position: relative;
    z-index: 1;
    font-family: var(--display);
    font-size: 0.8rem;
    font-weight: 600;
    color: #fff;
    text-decoration: none;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    padding: 0.5rem 1.1rem;
    border-radius: 100px;
    white-space: nowrap;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s, box-shadow 0.2s, padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .nav-cta:hover {
    opacity: 0.88;
    box-shadow: 0 0 18px rgba(99,102,241,0.4);
  }
  .nav-cta.cta-icon {
    padding: 0.5rem 0.62rem;
  }
</style>
