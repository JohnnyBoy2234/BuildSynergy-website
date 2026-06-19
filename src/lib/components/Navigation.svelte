<script lang="ts">
  import { onMount, tick } from 'svelte';

  const navItems = [
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
      name: 'Why us', id: 'why',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3l1.9 5.6L19.5 9l-4.4 3.6L16.4 18 12 14.9 7.6 18l1.3-5.4L4.5 9l5.6-.4L12 3z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
      </svg>`,
    },
  ];

  let activeTab = $state(navItems[0].name);
  let lampLeft  = $state(0);
  let lampWidth = $state(0);
  let pillEl:   HTMLElement;
  let linksEl:  HTMLElement;
  let itemEls:  HTMLElement[] = [];
  let scrolled  = $state(false);
  let menuOpen  = $state(false);

  function toggleMenu() { menuOpen = !menuOpen; }
  function closeMenu()  { menuOpen = false; }

  async function activate(name: string, index: number, scroll = false) {
    activeTab = name;
    if (scroll) document.querySelector(`#${navItems[index].id}`)?.scrollIntoView({ behavior: 'smooth' });
    await tick();
    moveLamp(index);
  }

  function moveLamp(index: number) {
    const el = itemEls[index];
    if (!el || !linksEl) return;
    const nr = linksEl.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    lampLeft  = er.left - nr.left;
    lampWidth = er.width;
  }

  function refreshLamp() {
    const i = navItems.findIndex(n => n.name === activeTab);
    if (i !== -1) moveLamp(i);
  }

  function go(id: string) {
    document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' });
  }

  onMount(() => {
    const onResize = () => requestAnimationFrame(refreshLamp);
    const onScroll = () => {
      scrolled = window.scrollY > 80;
      if (menuOpen) closeMenu();
    };
    const onDocClick = (e: MouseEvent) => {
      if (menuOpen && pillEl && !pillEl.contains(e.target as Node)) closeMenu();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu(); };

    onResize();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('click', onDocClick);
    window.addEventListener('keydown', onKey);

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

    tick().then(() => {
      moveLamp(0);
      navItems.forEach(n => {
        const el = document.querySelector(`#${n.id}`);
        if (el) io.observe(el);
      });
    });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('click', onDocClick);
      window.removeEventListener('keydown', onKey);
      io.disconnect();
    };
  });
</script>

<header class="nav-wrap">
  <!-- Wordmark logo, top-left -->
  <a
    class="nav-logo"
    href="/"
    onclick={(e) => { e.preventDefault(); go('home'); closeMenu(); }}
    aria-label="BuildSynergy Home"
  >
    <span class="logo-build">Build</span><span class="logo-accent">Synergy</span>
  </a>

  <!-- Nav pill, top-right: links + CTA + hamburger -->
  <nav
    class="nav-pill"
    class:scrolled
    class:menu-open={menuOpen}
    bind:this={pillEl}
    aria-label="Main navigation"
  >
    <!-- Links (inline on desktop, dropdown on mobile) -->
    <div id="nav-links" class="nav-links" class:open={menuOpen} bind:this={linksEl}>
      <!-- Sliding lamp indicator (desktop only) -->
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
          onclick={() => { activate(item.name, i, true); closeMenu(); }}
          aria-current={activeTab === item.name ? 'page' : undefined}
          aria-label={item.name}
        >
          <span class="nav-icon">{@html item.icon}</span>
          <span class="nav-label">{item.name}</span>
        </button>
      {/each}
    </div>

    <!-- CTA -->
    <a
      href="#contact"
      class="nav-cta"
      onclick={(e) => { e.preventDefault(); go('contact'); closeMenu(); }}
    >
      Get a quote
    </a>

    <!-- Hamburger (mobile only) -->
    <button
      class="nav-burger"
      class:open={menuOpen}
      onclick={toggleMenu}
      aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={menuOpen}
      aria-controls="nav-links"
    >
      <span></span>
      <span></span>
    </button>
  </nav>
</header>

<style>
  /* ── Wrapper ─────────────────────────────────────────────────────── */
  .nav-wrap {
    position: fixed;
    top: 1.5rem;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0 clamp(1.25rem, 4vw, 3rem);
    pointer-events: none;
  }
  .nav-wrap > * { pointer-events: auto; }

  /* ── Pill ─────────────────────────────────────────────────────────── */
  .nav-pill {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: rgba(8, 8, 22, 0.55);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(99,102,241,0.18);
    border-radius: 100px;
    padding: 0.45rem 0.5rem;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 4px 24px rgba(0,0,0,0.4);
    overflow: visible;
    transition: background 0.3s ease, border-color 0.3s ease;
  }
  .nav-pill.scrolled {
    background: rgba(8, 8, 22, 0.85);
    border-color: rgba(99,102,241,0.28);
  }

  /* ── Wordmark logo ────────────────────────────────────────────────── */
  .nav-logo {
    flex-shrink: 0;
    text-decoration: none;
    font-family: var(--display);
    font-size: 1.7rem;
    line-height: 1;
    letter-spacing: -0.03em;
    white-space: nowrap;
    transition: filter 0.25s ease;
  }
  .nav-logo:hover { filter: drop-shadow(0 0 14px rgba(99,102,241,0.55)); }

  .logo-build {
    font-weight: 500;
    color: rgba(255,255,255,0.9);
  }

  .logo-accent {
    font-weight: 700;
    background: linear-gradient(135deg, #a5b4fc, #22d3ee);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Links container ──────────────────────────────────────────────── */
  .nav-links {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.1rem;
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
    font-size: 1rem;
    font-weight: 500;
    color: rgba(255,255,255,0.58);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.6rem 1.15rem;
    border-radius: 100px;
    transition: color 0.2s;
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

  .nav-label {
    margin-left: 0.4rem;
    white-space: nowrap;
  }

  /* ── CTA button ───────────────────────────────────────────────────── */
  .nav-cta {
    position: relative;
    z-index: 1;
    font-family: var(--display);
    font-size: 0.95rem;
    font-weight: 600;
    color: #fff;
    text-decoration: none;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    padding: 0.65rem 1.4rem;
    border-radius: 100px;
    white-space: nowrap;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s, box-shadow 0.2s;
  }
  .nav-cta:hover {
    opacity: 0.88;
    box-shadow: 0 0 18px rgba(99,102,241,0.4);
  }

  /* ── Hamburger (mobile only) ──────────────────────────────────────── */
  .nav-burger {
    display: none;
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 10px;
  }
  .nav-burger span {
    position: absolute;
    width: 18px;
    height: 2px;
    border-radius: 2px;
    background: rgba(255,255,255,0.88);
    transition: transform 0.25s ease;
  }
  .nav-burger span:nth-child(1) { transform: translateY(-4px); }
  .nav-burger span:nth-child(2) { transform: translateY(4px); }
  .nav-burger.open span:nth-child(1) { transform: rotate(45deg); }
  .nav-burger.open span:nth-child(2) { transform: rotate(-45deg); }

  /* ── Mobile: wordmark left, CTA + hamburger pill right, dropdown ──── */
  @media (max-width: 767px) {
    .nav-wrap {
      top: 0.75rem;
      padding: 0 0.85rem;
      gap: 0.6rem;
    }
    .nav-logo { font-size: 1.35rem; }

    .nav-pill {
      border-radius: 16px;
      padding: 0.4rem 0.5rem;
      gap: 0.4rem;
    }

    .lamp { display: none; }

    .nav-cta {
      font-size: 0.85rem;
      padding: 0.55rem 1.05rem;
    }
    .nav-burger { display: inline-flex; }

    /* links collapse into a dropdown panel under the pill */
    .nav-links {
      position: absolute;
      top: calc(100% + 0.55rem);
      left: auto;
      right: 0;
      min-width: 220px;
      flex-direction: column;
      align-items: stretch;
      gap: 0.15rem;
      padding: 0.5rem;
      background: rgba(8, 8, 22, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(99,102,241,0.18);
      border-radius: 16px;
      box-shadow: 0 14px 44px rgba(0,0,0,0.5);
      opacity: 0;
      transform: translateY(-8px);
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
    }
    .nav-links.open {
      opacity: 1;
      transform: none;
      visibility: visible;
      pointer-events: auto;
    }

    .nav-item {
      flex-direction: row;
      justify-content: flex-start;
      width: 100%;
      padding: 0.7rem 0.85rem;
      border-radius: 10px;
    }
    .nav-item.active { background: rgba(99,102,241,0.14); }
    .nav-icon { opacity: 0.8; }
    .nav-label {
      margin-left: 0.65rem;
      font-size: 0.95rem;
      font-weight: 500;
      letter-spacing: 0;
    }
  }
</style>
