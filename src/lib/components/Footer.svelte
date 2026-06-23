<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  let footerEl: HTMLElement;
  const year = new Date().getFullYear();

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (footerEl) {
      gsap.from(footerEl, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: footerEl, start: 'top 92%' },
      });
    }
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  });

  function scrollTo(id: string) {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }
</script>

<footer class="footer" bind:this={footerEl}>
  <!-- Gradient fade-in from top -->
  <div class="footer-fade" aria-hidden="true"></div>
  <!-- Grid pattern -->
  <div class="footer-grid-bg" aria-hidden="true"></div>

  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <div class="logo">Build<span>Synergy</span></div>
        <p>Premium websites and digital solutions<br />for modern South African businesses.</p>
        <a href="mailto:yoursupport@buildsynergy.co.za" class="footer-email">yoursupport@buildsynergy.co.za</a>
      </div>

      <nav class="footer-nav" aria-label="Footer">
        <div class="nav-col">
          <span class="nav-label">Navigate</span>
          <ul>
            <li><a href="#home"     onclick={(e) => { e.preventDefault(); scrollTo('#home'); }}>Home</a></li>
            <li><a href="#services" onclick={(e) => { e.preventDefault(); scrollTo('#services'); }}>Services</a></li>
            <li><a href="#process"  onclick={(e) => { e.preventDefault(); scrollTo('#process'); }}>Process</a></li>
            <li><a href="#work"     onclick={(e) => { e.preventDefault(); scrollTo('#work'); }}>Our Work</a></li>
            <li><a href="#packages" onclick={(e) => { e.preventDefault(); scrollTo('#packages'); }}>Packages</a></li>
            <li><a href="#contact"  onclick={(e) => { e.preventDefault(); scrollTo('#contact'); }}>Contact</a></li>
          </ul>
        </div>
        <div class="nav-col">
          <span class="nav-label">Connect</span>
          <ul>
            <li><a href="/" aria-label="LinkedIn">LinkedIn</a></li>
            <li><a href="/" aria-label="Facebook">Facebook</a></li>
            <li><a href="/" aria-label="Instagram">Instagram</a></li>
          </ul>
        </div>
        <div class="nav-col">
          <span class="nav-label">Legal</span>
          <ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms">Terms &amp; Conditions</a></li>
          </ul>
        </div>
      </nav>
    </div>

    <div class="footer-divider"></div>

    <div class="footer-bottom">
      <span>© {year} BuildSynergy. All rights reserved. &nbsp;·&nbsp; <a href="/privacy-policy" class="legal-link">Privacy Policy</a></span>
      <button
        class="back-top"
        onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >↑ Top</button>
    </div>
  </div>
</footer>

<style>
  .footer {
    position: relative;
    padding: 5rem var(--gutter) 2.5rem;
    background: var(--bg);
    overflow: hidden;
  }

  .footer-fade {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 200px;
    background: linear-gradient(to bottom, rgba(7,7,26,0.8), transparent);
    pointer-events: none;
  }

  .footer-grid-bg {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none;
  }

  .footer-inner {
    position: relative;
    z-index: 1;
    max-width: var(--container);
    margin: 0 auto;
  }

  .footer-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 3rem;
    flex-wrap: wrap;
    margin-bottom: 3rem;
  }

  .logo {
    font-family: var(--display);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
    margin-bottom: 0.75rem;
  }
  .logo span { color: var(--cyan); }

  .footer-brand p {
    font-size: 0.875rem;
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  .footer-email {
    font-size: 0.82rem;
    color: var(--indigo);
    text-decoration: none;
    transition: color 0.2s;
    letter-spacing: 0.01em;
  }
  .footer-email:hover { color: var(--cyan); }

  .footer-nav { display: flex; gap: 3.5rem; flex-wrap: wrap; }
  .nav-col { display: flex; flex-direction: column; gap: 0.85rem; }
  .nav-label {
    font-family: var(--display);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .nav-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.55rem; }
  .nav-col a {
    font-size: 0.875rem;
    color: var(--text-body);
    text-decoration: none;
    transition: color 0.2s;
  }
  .nav-col a:hover { color: var(--text); }

  .footer-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.25), rgba(168,85,247,0.2), transparent);
    margin-bottom: 2rem;
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .back-top {
    font-size: 0.78rem;
    font-family: var(--display);
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    background: none;
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 0.4rem 0.9rem;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .back-top:hover { border-color: var(--indigo); color: var(--indigo); }

  .legal-link {
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.2s;
  }
  .legal-link:hover { color: var(--indigo); }

  @media (max-width: 767px) {
    .footer { padding-bottom: 6.5rem; }
  }

  @media (max-width: 640px) {
    .footer-top { flex-direction: column; }
    .footer-nav { gap: 2rem; }
  }
</style>
