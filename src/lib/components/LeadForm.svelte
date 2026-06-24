<script lang="ts">
  import { emptyFunnelData, BUDGET_OPTIONS } from './funnel/types';

  let data = $state(emptyFunnelData());
  let errors = $state<Record<string, string>>({});
  let submitting = $state(false);
  let submitted = $state(false);

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = 'Required.';
    if (!data.businessName.trim()) e.businessName = 'Required.';
    if (!data.email.trim()) e.email = 'Required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Invalid email.';
    if (!data.mainGoal.trim()) e.mainGoal = 'Tell us a little about what you need.';
    if (!data.agreed) e.agreed = 'You must agree to continue.';
    return e;
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    errors = validate();
    if (Object.keys(errors).length) return;
    submitting = true;
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      submitted = true;
    } catch {
      errors = { submit: 'Could not send right now — please try again.' };
    } finally {
      submitting = false;
    }
  }
</script>

<div class="lf">
  {#if submitted}
    <div class="lf-success" role="status">
      <div class="success-ring" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M6 14l6 6 10-12" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3>Message received.</h3>
      <p>We'll be in touch within one business day.</p>
    </div>

  {:else}
    <form onsubmit={handleSubmit} novalidate>
      <div class="form-row">
        <div class="form-field" class:err={errors.name}>
          <label for="lf-name">Name</label>
          <input id="lf-name" type="text" placeholder="Your name" bind:value={data.name} autocomplete="name" />
          {#if errors.name}<span class="err-msg">{errors.name}</span>{/if}
        </div>
        <div class="form-field" class:err={errors.businessName}>
          <label for="lf-biz">Business Name</label>
          <input id="lf-biz" type="text" placeholder="Your business" bind:value={data.businessName} />
          {#if errors.businessName}<span class="err-msg">{errors.businessName}</span>{/if}
        </div>
      </div>

      <div class="form-row">
        <div class="form-field" class:err={errors.email}>
          <label for="lf-email">Email</label>
          <input id="lf-email" type="email" placeholder="hello@yourbusiness.co.za" bind:value={data.email} autocomplete="email" />
          {#if errors.email}<span class="err-msg">{errors.email}</span>{/if}
        </div>
        <div class="form-field">
          <label for="lf-phone">Phone <span class="opt">(optional)</span></label>
          <input id="lf-phone" type="tel" placeholder="+27 81 000 0000" bind:value={data.phone} autocomplete="tel" />
        </div>
      </div>

      <div class="form-field" class:err={errors.mainGoal}>
        <label for="lf-message">What do you need?</label>
        <textarea id="lf-message" placeholder="Tell us a little about your business and what you'd like to improve." bind:value={data.mainGoal}></textarea>
        {#if errors.mainGoal}<span class="err-msg">{errors.mainGoal}</span>{/if}
      </div>

      <div class="form-field">
        <label for="lf-budget">Project Budget <span class="opt">(optional)</span></label>
        <select id="lf-budget" bind:value={data.budget}>
          <option value="">Select a range…</option>
          {#each BUDGET_OPTIONS as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>

      <div class="form-field agree-field" class:err={errors.agreed}>
        <label class="agree-label">
          <input type="checkbox" bind:checked={data.agreed} class="agree-check" />
          <span>
            I agree to the
            <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>
            and
            <a href="/terms" target="_blank" rel="noopener">Terms &amp; Conditions</a>.
          </span>
        </label>
        {#if errors.agreed}<span class="err-msg">{errors.agreed}</span>{/if}
      </div>

      {#if errors.submit}
        <p class="err-msg" role="alert">{errors.submit}</p>
      {/if}

      <button type="submit" class="btn-submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Get My Free Quote'}
      </button>
    </form>
  {/if}
</div>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .btn-submit {
    background: var(--indigo);
    color: #fff;
    font-family: var(--display);
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0.9rem 2.25rem;
    border-radius: 100px;
    border: none;
    cursor: pointer;
    align-self: flex-start;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .btn-submit:hover:not(:disabled) {
    background: var(--indigo-strong);
    transform: translateY(-1px);
    box-shadow: var(--shadow-indigo);
  }
  .btn-submit:disabled { opacity: 0.5; cursor: wait; }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  label {
    font-size: 0.82rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.55);
    letter-spacing: 0.02em;
  }
  .opt { font-weight: 400; opacity: 0.6; }

  input, textarea, select {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 10px;
    padding: 0.875rem 1rem;
    color: #fff;
    font-family: var(--sans);
    font-size: 0.9rem;
    width: 100%;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  select {
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='rgba(255,255,255,0.55)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    padding-right: 2.5rem;
    cursor: pointer;
  }
  select option { background: #14141f; color: #fff; }
  input::placeholder, textarea::placeholder { color: rgba(255, 255, 255, 0.45); }
  input:focus, textarea:focus, select:focus {
    border-color: rgba(99, 102, 241, 0.7);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
  }
  .err input, .err textarea { border-color: rgba(239, 68, 68, 0.5); }
  textarea { resize: vertical; min-height: 110px; }

  .err-msg { font-size: 0.75rem; color: rgba(239, 68, 68, 0.9); }

  /* Consent checkbox */
  .agree-field { gap: 0.35rem; }
  .agree-label {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    cursor: pointer;
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.42);
    line-height: 1.55;
    font-weight: 400;
    letter-spacing: 0;
  }
  .agree-check {
    appearance: none;
    -webkit-appearance: none;
    width: 17px;
    height: 17px;
    min-width: 17px;
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.06);
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
    top: 2px;
    left: 5px;
    width: 5px;
    height: 9px;
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
  .agree-label a:hover { color: #a5b4fc; }
  .err .agree-label { color: rgba(239, 68, 68, 0.8); }
  .err .agree-check { border-color: rgba(239, 68, 68, 0.5); }

  /* Success state */
  .lf-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.1rem;
    padding: 3rem 1rem;
  }
  .success-ring {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.12);
    border: 1px solid rgba(99, 102, 241, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .lf-success h3 { font-size: 1.5rem; color: #fff; }
  .lf-success p { max-width: 380px; color: rgba(255, 255, 255, 0.6); }

  @media (max-width: 768px) {
    .form-row { grid-template-columns: 1fr; }
    .btn-submit { align-self: stretch; text-align: center; }
  }
</style>
