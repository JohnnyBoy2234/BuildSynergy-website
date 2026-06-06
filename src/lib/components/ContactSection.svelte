<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import SectionCanvas from './SectionCanvas.svelte';

  const serviceOptions = [
    'New Website', 'Website Redesign', 'WhatsApp Integration',
    'Contact or Quote Forms', 'AI Chatbot', 'Google Visibility',
    'Company Profile', 'Photography or Video', 'Website Maintenance', 'Not Sure Yet',
  ];

  let name            = $state('');
  let businessName    = $state('');
  let email           = $state('');
  let phone           = $state('');
  let website         = $state('');
  let selectedService = $state('');
  let message         = $state('');
  let agreed          = $state(false);
  let submitted       = $state(false);
  let submitting      = $state(false);
  let errors          = $state<Record<string, string>>({});

  let sectionEl: HTMLElement;
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

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim())           e.name = 'Required.';
    if (!businessName.trim())   e.businessName = 'Required.';
    if (!email.trim())          e.email = 'Required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email.';
    if (!message.trim())        e.message = 'Required.';
    if (!agreed)                e.agreed = 'You must agree to continue.';
    return e;
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    errors = validate();
    if (Object.keys(errors).length) return;
    submitting = true;
    await new Promise(r => setTimeout(r, 900));
    submitting = false;
    submitted  = true;
  }
</script>

<section id="contact" class="contact-section" bind:this={sectionEl}>
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
      {#if submitted}
        <div class="ct-success">
          <div class="success-ring" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 14l6 6 10-12" stroke="#22d3ee" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>Message received.</h3>
          <p>We'll be in touch within one business day.</p>
        </div>

      {:else}
        <form onsubmit={handleSubmit} novalidate>
          <div class="form-row">
            <div class="form-field" class:err={errors.name}>
              <label for="c-name">Name</label>
              <input id="c-name" type="text" placeholder="Your name" bind:value={name} autocomplete="name" />
              {#if errors.name}<span class="err-msg">{errors.name}</span>{/if}
            </div>
            <div class="form-field" class:err={errors.businessName}>
              <label for="c-biz">Business Name</label>
              <input id="c-biz" type="text" placeholder="Your business" bind:value={businessName} />
              {#if errors.businessName}<span class="err-msg">{errors.businessName}</span>{/if}
            </div>
          </div>

          <div class="form-row">
            <div class="form-field" class:err={errors.email}>
              <label for="c-email">Email</label>
              <input id="c-email" type="email" placeholder="hello@yourbusiness.co.za" bind:value={email} autocomplete="email" />
              {#if errors.email}<span class="err-msg">{errors.email}</span>{/if}
            </div>
            <div class="form-field">
              <label for="c-phone">Phone</label>
              <input id="c-phone" type="tel" placeholder="+27 81 000 0000" bind:value={phone} autocomplete="tel" />
            </div>
          </div>

          <div class="form-field">
            <label for="c-site">Website <span class="opt">(optional)</span></label>
            <input id="c-site" type="url" placeholder="https://yourbusiness.co.za" bind:value={website} />
          </div>

          <div class="form-field">
            <label>What do you need help with?</label>
            <div class="chips" role="group">
              {#each serviceOptions as opt}
                <button
                  type="button"
                  class="chip"
                  class:active={selectedService === opt}
                  onclick={() => { selectedService = selectedService === opt ? '' : opt; }}
                  aria-pressed={selectedService === opt}
                >{opt}</button>
              {/each}
            </div>
          </div>

          <div class="form-field" class:err={errors.message}>
            <label for="c-msg">Project Message</label>
            <textarea id="c-msg" rows="4" placeholder="Tell us about your project and goals..." bind:value={message}></textarea>
            {#if errors.message}<span class="err-msg">{errors.message}</span>{/if}
          </div>

          <!-- Agreement checkbox -->
          <div class="form-field agree-field" class:err={errors.agreed}>
            <label class="agree-label">
              <input
                type="checkbox"
                bind:checked={agreed}
                class="agree-check"
              />
              <span>
                I agree to the
                <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>
                and
                <a href="/terms" target="_blank" rel="noopener">Terms &amp; Conditions</a>.
              </span>
            </label>
            {#if errors.agreed}<span class="err-msg">{errors.agreed}</span>{/if}
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Start My Project'}
            </button>
          </div>
        </form>
      {/if}
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

  form { display: flex; flex-direction: column; gap: 1.5rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .form-field { display: flex; flex-direction: column; gap: 0.4rem; }

  label { font-size: 0.82rem; font-weight: 500; color: var(--text-muted); letter-spacing: 0.02em; }
  .opt  { font-weight: 400; opacity: 0.6; }

  input, textarea {
    background: rgba(6,6,18,0.9);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.875rem 1rem;
    color: var(--text);
    font-family: var(--sans);
    font-size: 0.9rem;
    width: 100%;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  input::placeholder, textarea::placeholder { color: var(--text-muted); }
  input:focus, textarea:focus {
    border-color: rgba(99,102,241,0.55);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .err input, .err textarea { border-color: rgba(239,68,68,0.5); }
  textarea { resize: vertical; min-height: 110px; }

  .err-msg { font-size: 0.75rem; color: rgba(239,68,68,0.9); }

  .chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.25rem; }
  .chip {
    font-size: 0.78rem;
    padding: 0.38rem 0.85rem;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: var(--glass);
    color: var(--text-body);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
  }
  .chip:hover { border-color: var(--border2); color: var(--text); }
  .chip.active {
    border-color: var(--indigo);
    background: rgba(99,102,241,0.14);
    color: var(--text);
  }

  .form-actions { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; padding-top: 0.25rem; }

  .btn-submit {
    background: linear-gradient(135deg, var(--indigo), var(--violet));
    color: #fff;
    font-family: var(--display);
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0.9rem 2.25rem;
    border-radius: 100px;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .btn-submit:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
    box-shadow: 0 0 26px rgba(99,102,241,0.4);
  }
  .btn-submit:disabled { opacity: 0.5; cursor: wait; }

  .alt-link { font-size: 0.88rem; color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
  .alt-link:hover { color: var(--cyan); }

  /* Agreement checkbox */
  .agree-field { gap: 0.35rem; }

  .agree-label {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    cursor: pointer;
    font-size: 0.82rem;
    color: rgba(255,255,255,0.42);
    line-height: 1.55;
    font-weight: 400;
    letter-spacing: 0;
  }

  .agree-check {
    appearance: none;
    -webkit-appearance: none;
    width: 17px; height: 17px;
    min-width: 17px;
    border-radius: 5px;
    border: 1px solid var(--border);
    background: rgba(6,6,18,0.9);
    cursor: pointer;
    margin-top: 1px;
    position: relative;
    transition: border-color 0.2s, background 0.2s;
    padding: 0;
  }
  .agree-check:checked {
    background: var(--indigo);
    border-color: var(--indigo);
  }
  .agree-check:checked::after {
    content: '';
    position: absolute;
    top: 2px; left: 5px;
    width: 5px; height: 9px;
    border: 1.5px solid #fff;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
  }
  .agree-check:focus-visible {
    outline: 2px solid var(--indigo);
    outline-offset: 2px;
  }
  .agree-label a {
    color: var(--indigo);
    text-decoration: none;
    transition: color 0.2s;
  }
  .agree-label a:hover { color: var(--cyan); }
  .err .agree-label { color: rgba(239,68,68,0.8); }
  .err .agree-check { border-color: rgba(239,68,68,0.5); }

  /* Success state */
  .ct-success {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 1.1rem; padding: 3rem 1rem;
  }
  .success-ring {
    width: 60px; height: 60px;
    border-radius: 50%;
    background: rgba(34,211,238,0.1);
    border: 1px solid rgba(34,211,238,0.3);
    display: flex; align-items: center; justify-content: center;
  }
  .ct-success h3 { font-size: 1.5rem; }
  .ct-success p  { max-width: 380px; color: var(--text-body); }

  @media (max-width: 768px) {
    .ct-panel { padding: 2rem 1.5rem; }
    .form-row { grid-template-columns: 1fr; }
    .form-actions { flex-direction: column; align-items: stretch; }
    .btn-submit { text-align: center; }
  }
</style>
