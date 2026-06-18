<script lang="ts">
  import gsap from 'gsap';
  import StepService from './StepService.svelte';
  import StepContext from './StepContext.svelte';
  import StepBudgetTimeline from './StepBudgetTimeline.svelte';
  import StepContact from './StepContact.svelte';
  import { emptyFunnelData } from './types';

  const TOTAL_STEPS = 4;

  let data = $state(emptyFunnelData());
  let step = $state(1);
  let errors = $state<Record<string, string>>({});
  let submitting = $state(false);
  let submitted = $state(false);

  function validateStep(n: number): Record<string, string> {
    const e: Record<string, string> = {};
    if (n === 1) {
      if (!data.service) e.service = 'Please choose an option.';
    }
    if (n === 2) {
      if (data.hasWebsite === null) e.hasWebsite = 'Please choose one.';
      if (!data.mainGoal.trim()) e.mainGoal = 'Required.';
    }
    if (n === 3) {
      if (!data.timeline) e.timeline = 'Please choose a timeline.';
    }
    if (n === 4) {
      if (!data.name.trim()) e.name = 'Required.';
      if (!data.businessName.trim()) e.businessName = 'Required.';
      if (!data.email.trim()) e.email = 'Required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Invalid email.';
      if (!data.agreed) e.agreed = 'You must agree to continue.';
    }
    return e;
  }

  function next() {
    errors = validateStep(step);
    if (Object.keys(errors).length) return;
    step = Math.min(step + 1, TOTAL_STEPS);
  }

  function back() {
    errors = {};
    step = Math.max(step - 1, 1);
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (step < TOTAL_STEPS) {
      next();
      return;
    }
    errors = validateStep(TOTAL_STEPS);
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

  function stepIn(node: HTMLElement) {
    gsap.fromTo(
      node,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
    );
  }
</script>

<div class="lf">
  {#if submitted}
    <div class="lf-success" role="status">
      <div class="success-ring" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M6 14l6 6 10-12" stroke="#22d3ee" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3>Message received.</h3>
      <p>We'll be in touch within one business day.</p>
    </div>

  {:else}
    <div class="lf-progress">
      <span class="lf-progress-label" role="status">Step {step} of {TOTAL_STEPS}</span>
      <div class="lf-bar" aria-hidden="true">
        <div class="lf-bar-fill" style="width: {(step / TOTAL_STEPS) * 100}%"></div>
      </div>
    </div>

    <form onsubmit={handleSubmit} novalidate>
      {#key step}
        <div class="lf-step" use:stepIn>
          {#if step === 1}
            <StepService bind:data {errors} onselect={next} />
          {:else if step === 2}
            <StepContext bind:data {errors} />
          {:else if step === 3}
            <StepBudgetTimeline bind:data {errors} />
          {:else}
            <StepContact bind:data {errors} />
          {/if}
        </div>
      {/key}

      {#if errors.submit}
        <p class="err-msg" role="alert" style="margin-top:1rem">{errors.submit}</p>
      {/if}

      {#if step > 1}
        <div class="lf-nav">
          <button type="button" class="lf-back" onclick={back}>← Back</button>
          {#if step < TOTAL_STEPS}
            <button type="submit" class="btn-submit">Continue →</button>
          {:else}
            <button type="submit" class="btn-submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Start My Project'}
            </button>
          {/if}
        </div>
      {/if}
    </form>
  {/if}
</div>

<style>
  /* Progress */
  .lf-progress {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-bottom: 2rem;
  }
  .lf-progress-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }
  .lf-bar {
    height: 4px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.07);
    overflow: hidden;
  }
  .lf-bar-fill {
    height: 100%;
    border-radius: 100px;
    background: linear-gradient(90deg, var(--indigo), var(--violet));
    transition: width 0.3s ease;
  }

  /* Step container + nav */
  .lf-step {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .lf-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
    padding-top: 1.75rem;
  }
  .lf-back {
    background: none;
    border: none;
    color: var(--text-muted);
    font-family: var(--sans);
    font-size: 0.88rem;
    cursor: pointer;
    padding: 0.5rem 0;
    transition: color 0.2s;
  }
  .lf-back:hover { color: var(--text); }

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
    box-shadow: 0 0 26px rgba(99, 102, 241, 0.4);
  }
  .btn-submit:disabled { opacity: 0.5; cursor: wait; }

  .lf :global(.lf-title) {
    font-size: 1.15rem;
    margin: 0 0 1.25rem;
  }

  /* Shared field styles for step components (copied from the replaced form) */
  .lf :global(.form-row) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .lf :global(.form-field) {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .lf :global(label),
  .lf :global(.lf-label) {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.02em;
  }
  .lf :global(.opt) { font-weight: 400; opacity: 0.6; }

  .lf :global(input),
  .lf :global(textarea) {
    background: rgba(6, 6, 18, 0.9);
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
  .lf :global(input::placeholder),
  .lf :global(textarea::placeholder) { color: var(--text-muted); }
  .lf :global(input:focus),
  .lf :global(textarea:focus) {
    border-color: rgba(99, 102, 241, 0.55);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  .lf :global(.err input),
  .lf :global(.err textarea) { border-color: rgba(239, 68, 68, 0.5); }
  .lf :global(textarea) { resize: vertical; min-height: 110px; }

  .lf :global(.err-msg) { font-size: 0.75rem; color: rgba(239, 68, 68, 0.9); }

  .lf :global(.chips) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }
  .lf :global(.chip) {
    font-size: 0.78rem;
    padding: 0.38rem 0.85rem;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: var(--glass);
    color: var(--text-body);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
  }
  .lf :global(.chip:hover) { border-color: var(--border2); color: var(--text); }
  .lf :global(.chip.active) {
    border-color: var(--indigo);
    background: rgba(99, 102, 241, 0.14);
    color: var(--text);
  }

  /* Consent checkbox (copied from the replaced form) */
  .lf :global(.agree-field) { gap: 0.35rem; }
  .lf :global(.agree-label) {
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
  .lf :global(.agree-check) {
    appearance: none;
    -webkit-appearance: none;
    width: 17px;
    height: 17px;
    min-width: 17px;
    border-radius: 5px;
    border: 1px solid var(--border);
    background: rgba(6, 6, 18, 0.9);
    cursor: pointer;
    margin-top: 1px;
    position: relative;
    transition: border-color 0.2s, background 0.2s;
    padding: 0;
  }
  .lf :global(.agree-check:checked) {
    background: var(--indigo);
    border-color: var(--indigo);
  }
  .lf :global(.agree-check:checked::after) {
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
  .lf :global(.agree-check:focus-visible) {
    outline: 2px solid var(--indigo);
    outline-offset: 2px;
  }
  .lf :global(.agree-label a) {
    color: var(--indigo);
    text-decoration: none;
    transition: color 0.2s;
  }
  .lf :global(.agree-label a:hover) { color: var(--cyan); }
  .lf :global(.err .agree-label) { color: rgba(239, 68, 68, 0.8); }
  .lf :global(.err .agree-check) { border-color: rgba(239, 68, 68, 0.5); }

  /* Success state (carried over from the replaced form) */
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
    background: rgba(34, 211, 238, 0.1);
    border: 1px solid rgba(34, 211, 238, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .lf-success h3 { font-size: 1.5rem; }
  .lf-success p { max-width: 380px; color: var(--text-body); }

  @media (max-width: 768px) {
    .lf :global(.form-row) { grid-template-columns: 1fr; }
    .lf-nav { flex-direction: column-reverse; align-items: stretch; }
    .btn-submit { text-align: center; }
    .lf-back { text-align: center; }
  }
</style>
