<script lang="ts">
  import { onMount } from 'svelte';

  let scrolled = $state(false);
  let activeSection = $state('home');
  let menuOpen = $state(false);

  const links = [
    { href: '#home',     label: 'Home' },
    { href: '#services', label: 'Services' },
    { href: '#team',     label: 'Team' },
    { href: '#contact',  label: 'Contact' },
  ];

  onMount(() => {
    const onScroll = () => { scrolled = window.scrollY > 40; };
    window.addEventListener('scroll', onScroll, { passive: true });

    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) activeSection = e.target.id; });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => observer.observe(s));

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  });

  function scrollTo(href: string) {
    menuOpen = false;
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  }
</script>

<header class="nav-wrap" class:scrolled>
  <nav class="nav" aria-label="Main navigation">
    <a class="logo" href="/" onclick={(e) => { e.preventDefault(); scrollTo('#home'); }}>
      Build<span>Synergy</span>
    </a>

    <ul class="nav-links" role="list">
      {#each links as { href, label }}
        <li>
          <a
            {href}
            class:active={activeSection === href.slice(1)}
            onclick={(e) => { e.preventDefault(); scrollTo(href); }}
          >{label}</a>
        </li>
      {/each}
    </ul>

    <a
      href="#contact"
      class="btn-primary nav-cta"
      onclick={(e) => { e.preventDefault(); scrollTo('#contact'); }}
    >Start a Project</a>

    <button
      class="menu-toggle"
      onclick={() => (menuOpen = !menuOpen)}
      aria-expanded={menuOpen}
      aria-label="Toggle menu"
    >
      <span></span><span></span><span></span>
    </button>
  </nav>

  {#if menuOpen}
    <div class="mobile-menu" aria-hidden={!menuOpen}>
      {#each links as { href, label }}
        <a {href} onclick={(e) => { e.preventDefault(); scrollTo(href); }}>{label}</a>
      {/each}
      <a href="#contact" class="btn-primary" onclick={(e) => { e.preventDefault(); scrollTo('#contact'); }}>
        Start a Project
      </a>
    </div>
  {/if}
</header>

<style>
  .nav-wrap {
    position: fixed;
    top: 1.25rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    width: calc(100% - 2.5rem);
    max-width: 1100px;
    animation: navDrop 0.7s ease both;
  }
  @keyframes navDrop {
    from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 0;
    background: rgba(5,5,5,0.65);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 0.45rem 0.45rem 0.45rem 1.5rem;
    transition: background 0.4s, border-color 0.3s;
  }
  .nav-wrap.scrolled .nav {
    background: rgba(5,5,5,0.88);
    border-color: var(--border2);
  }

  .logo {
    font-family: var(--display);
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text);
    text-decoration: none;
    margin-right: 1.5rem;
    flex-shrink: 0;
    letter-spacing: -0.02em;
  }
  .logo span { color: var(--cyan); }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    list-style: none;
    flex: 1;
  }
  .nav-links a {
    font-size: 0.82rem;
    font-weight: 400;
    color: var(--text-body);
    text-decoration: none;
    padding: 0.4rem 0.8rem;
    border-radius: 100px;
    transition: color 0.2s, background 0.2s;
  }
  .nav-links a:hover, .nav-links a.active {
    color: var(--text);
    background: rgba(255,255,255,0.07);
  }

  .nav-cta {
    font-size: 0.82rem;
    padding: 0.5rem 1.15rem;
    margin-left: 0.5rem;
    flex-shrink: 0;
  }

  .menu-toggle {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    margin-left: auto;
  }
  .menu-toggle span {
    display: block;
    width: 20px;
    height: 1.5px;
    background: var(--text-body);
    border-radius: 2px;
    transition: background 0.2s;
  }
  .menu-toggle:hover span { background: var(--text); }

  .mobile-menu {
    background: rgba(10,10,13,0.97);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 20px;
    margin-top: 0.5rem;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .mobile-menu a {
    font-size: 0.95rem;
    color: var(--text-body);
    text-decoration: none;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    transition: color 0.2s, background 0.2s;
  }
  .mobile-menu a:hover { color: var(--text); background: var(--glass2); }
  .mobile-menu .btn-primary { margin-top: 0.5rem; text-align: center; justify-content: center; }

  @media (max-width: 768px) {
    .nav-links, .nav-cta { display: none; }
    .menu-toggle { display: flex; }
    .nav { padding-right: 0.45rem; }
  }
</style>
