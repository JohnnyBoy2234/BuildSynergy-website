<script lang="ts">
  let name = $state('')
  let businessName = $state('')
  let email = $state('')
  let service = $state('New Website')
  let message = $state('')
  let submitted = $state(false)

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    submitted = true
  }
</script>

<section class="contact-section" id="contact">
  <div class="atm-glow" aria-hidden="true"></div>

  <div class="section-header" style="text-align: center;">
    <span class="eyebrow">Start the Conversation</span>
    <h2>Ready to modernise your business?</h2>
    <p>Let's build a digital system that looks premium, captures leads, and helps your business operate smarter.</p>
  </div>

  <div class="contact-card">
    {#if submitted}
      <div class="success-state">
        <div class="success-icon" aria-hidden="true">✓</div>
        <h3>Message received</h3>
        <p>We'll be in touch within one business day.</p>
      </div>
    {:else}
      <form onsubmit={handleSubmit} novalidate>
        <div class="form-row">
          <div class="form-field">
            <label for="cf-name">Full Name</label>
            <input id="cf-name" type="text" placeholder="John Doe" bind:value={name} required autocomplete="name" />
          </div>
          <div class="form-field">
            <label for="cf-business">Business Name</label>
            <input id="cf-business" type="text" placeholder="Acme Corp" bind:value={businessName} required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label for="cf-email">Work Email</label>
            <input id="cf-email" type="email" placeholder="hello@company.co.za" bind:value={email} required autocomplete="email" />
          </div>
          <div class="form-field">
            <label for="cf-service">Service Required</label>
            <select id="cf-service" bind:value={service}>
              <option>New Website</option>
              <option>Website Redesign</option>
              <option>Lead Capture System</option>
              <option>CRM Setup</option>
              <option>AI and Automation</option>
              <option>Full Digital Ecosystem</option>
            </select>
          </div>
        </div>
        <div class="form-field">
          <label for="cf-message">Message</label>
          <textarea id="cf-message" rows="4" placeholder="Tell us about your project goals..." bind:value={message}></textarea>
        </div>
        <div class="form-actions">
          <button type="submit">Submit My Project</button>
          <a href="mailto:yoursupport@buildsynergy.co.za" class="alt-link">Or book a strategy call →</a>
        </div>
      </form>
    {/if}
  </div>
</section>

<style>
  .contact-section {
    position: relative;
    padding: 9rem 5vw;
    border-top: 1px solid var(--border);
    overflow: hidden;
  }

  .atm-glow {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    height: 400px;
    background: radial-gradient(ellipse, rgba(51, 102, 255, 0.09) 0%, transparent 70%);
    pointer-events: none;
  }

  .section-header {
    position: relative;
    z-index: 1;
    max-width: 600px;
    margin: 0 auto 3.5rem;
  }

  .section-header h2 { margin-bottom: 1rem; }
  .section-header p  { font-size: 1.05rem; }

  .contact-card {
    position: relative;
    z-index: 1;
    background: rgba(10, 10, 10, 0.75);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 2rem;
    padding: 3.5rem;
    max-width: 860px;
    margin: 0 auto;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.02em;
  }

  input,
  textarea,
  select {
    background: rgba(8, 8, 10, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    padding: 0.95rem 1.1rem;
    color: var(--text);
    font-family: var(--sans);
    font-size: 0.9rem;
    width: 100%;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input:focus,
  textarea:focus,
  select:focus {
    border-color: rgba(0, 212, 255, 0.5);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.08);
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--text-muted);
  }

  textarea { resize: vertical; min-height: 120px; }
  select   { appearance: none; cursor: pointer; }

  .form-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    padding-top: 0.5rem;
  }

  button[type='submit'] {
    background: var(--blue);
    color: #fff;
    font-family: var(--display);
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0.9rem 2.2rem;
    border-radius: 100px;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
  }

  button[type='submit']:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 0 24px rgba(51, 102, 255, 0.3);
  }

  .alt-link {
    font-size: 0.88rem;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.2s;
  }
  .alt-link:hover { color: var(--cyan); }

  .success-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem 1rem;
    text-align: center;
  }

  .success-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid rgba(0, 212, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    color: var(--cyan);
  }

  .success-state h3 { font-size: 1.4rem; }

  @media (max-width: 768px) {
    .contact-card  { padding: 2rem 1.5rem; border-radius: 1.25rem; }
    .form-row      { grid-template-columns: 1fr; }
    .form-actions  { flex-direction: column; align-items: stretch; }
    button[type='submit'] { text-align: center; }
  }
</style>
