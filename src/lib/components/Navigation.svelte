<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { page } from '$app/state';

  type NavItem = { name: string; id: string; type: 'anchor' | 'route'; path?: string; icon: string };

  const navItems: NavItem[] = [
    {
      name: 'Services', id: 'services', type: 'anchor',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      </svg>`,
    },
    {
      name: 'AI', id: 'ai', type: 'anchor',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" stroke-width="1.5"/>
        <path d="M12 8.5c.25 2 1.3 3 3.3 3.3-2 .25-3 1.3-3.3 3.3-.25-2-1.3-3-3.3-3.3 2-.25 3-1.3 3.3-3.3z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
      </svg>`,
    },
    {
      name: 'Process', id: 'process', type: 'anchor',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="5" cy="12" r="2.2" stroke="currentColor" stroke-width="1.4"/>
        <circle cx="12" cy="12" r="2.2" stroke="currentColor" stroke-width="1.4"/>
        <circle cx="19" cy="12" r="2.2" stroke="currentColor" stroke-width="1.4"/>
        <path d="M7.2 12h2.6M14.2 12h2.6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".4"/>
      </svg>`,
    },
    {
      name: 'Work', id: 'work', type: 'route', path: '/portfolio',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 6V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.5"/>
      </svg>`,
    },
    {
      name: 'Why us', id: 'why', type: 'anchor',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3l1.9 5.6L19.5 9l-4.4 3.6L16.4 18 12 14.9 7.6 18l1.3-5.4L4.5 9l5.6-.4L12 3z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
      </svg>`,
    },
  ];

  let isHome = $derived(page.url.pathname === '/');

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

  // Keep the lamp on "Work" while on a portfolio route.
  $effect(() => {
    if (page.url.pathname.startsWith('/portfolio')) {
      activeTab = 'Work';
      tick().then(refreshLamp);
    }
  });

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
      // Scroll-spy only applies on the homepage where the sections exist.
      if (isHome) {
        moveLamp(0);
        navItems.forEach(n => {
          if (n.type !== 'anchor') return;
          const el = document.querySelector(`#${n.id}`);
          if (el) io.observe(el);
        });
      } else {
        refreshLamp();
      }
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
    onclick={(e) => { if (isHome) { e.preventDefault(); go('home'); } closeMenu(); }}
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
      ></div>

      {#each navItems as item, i}
        {#if item.type === 'route'}
          <a
            class="nav-item"
            class:active={activeTab === item.name}
            href={item.path}
            bind:this={itemEls[i]}
            onclick={closeMenu}
            aria-current={activeTab === item.name ? 'page' : undefined}
            aria-label={item.name}
          >
            <span class="nav-icon">{@html item.icon}</span>
            <span class="nav-label">{item.name}</span>
          </a>
        {:else}
          <a
            class="nav-item"
            class:active={activeTab === item.name}
            href={`/#${item.id}`}
            bind:this={itemEls[i]}
            onclick={(e) => { if (isHome) { e.preventDefault(); activate(item.name, i, true); } closeMenu(); }}
            aria-current={activeTab === item.name ? 'page' : undefined}
            aria-label={item.name}
          >
            <span class="nav-icon">{@html item.icon}</span>
            <span class="nav-label">{item.name}</span>
          </a>
        {/if}
      {/each}
    </div>

    <!-- CTA -->
    <a
      href="/#contact"
      class="nav-cta"
      onclick={(e) => { if (isHome) { e.preventDefault(); go('contact'); } closeMenu(); }}
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
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 0.45rem 0.5rem;
    box-shadow: var(--shadow-md);
    overflow: visible;
    transition: background 0.3s ease, border-color 0.3s ease;
  }
  .nav-pill.scrolled {
    background: rgba(255,255,255,0.9);
    border-color: var(--border2);
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

  .logo-build {
    font-weight: 500;
    color: var(--text);
  }

  .logo-accent {
    font-weight: 700;
    color: var(--indigo);
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
    background: var(--indigo-soft);
    transition: left 0.38s cubic-bezier(0.25, 1, 0.5, 1),
                width 0.38s cubic-bezier(0.25, 1, 0.5, 1);
    pointer-events: none;
    z-index: 0;
    overflow: visible;
  }

  /* ── Nav items ────────────────────────────────────────────────────── */
  .nav-item {
    position: relative;
    z-index: 1;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0;
    font-family: var(--display);
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-muted);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.6rem 1.15rem;
    border-radius: 100px;
    transition: color 0.2s;
    white-space: nowrap;
  }
  .nav-item:hover  { color: var(--text); }
  .nav-item.active { color: var(--text); }

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
    background: var(--indigo);
    padding: 0.65rem 1.4rem;
    border-radius: 100px;
    white-space: nowrap;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, box-shadow 0.2s;
  }
  .nav-cta:hover {
    background: var(--indigo-strong);
    box-shadow: var(--shadow-indigo);
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
    background: var(--text);
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
      background: var(--surface);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border);
      border-radius: 16px;
      box-shadow: var(--shadow-lg);
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
    .nav-item.active { background: var(--indigo-soft); }
    .nav-icon { opacity: 0.8; }
    .nav-label {
      margin-left: 0.65rem;
      font-size: 0.95rem;
      font-weight: 500;
      letter-spacing: 0;
    }
  }
</style>
