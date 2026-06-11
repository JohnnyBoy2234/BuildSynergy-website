<script lang="ts">
  import type { FunnelData } from './types';

  interface Props {
    data: FunnelData;
    errors: Record<string, string>;
  }

  let { data = $bindable(), errors }: Props = $props();
</script>

<h3 class="lf-title">Tell us about your current setup</h3>

<div class="form-field" class:err={errors.hasWebsite}>
  <span class="lf-label">Do you currently have a website?</span>
  <div class="chips" role="group" aria-label="Do you currently have a website?">
    <button
      type="button"
      class="chip"
      class:active={data.hasWebsite === true}
      aria-pressed={data.hasWebsite === true}
      onclick={() => (data.hasWebsite = true)}
    >Yes</button>
    <button
      type="button"
      class="chip"
      class:active={data.hasWebsite === false}
      aria-pressed={data.hasWebsite === false}
      onclick={() => (data.hasWebsite = false)}
    >No</button>
  </div>
  {#if errors.hasWebsite}<span class="err-msg">{errors.hasWebsite}</span>{/if}
</div>

{#if data.hasWebsite}
  <div class="form-field">
    <label for="lf-url">Website <span class="opt">(optional)</span></label>
    <input id="lf-url" type="url" placeholder="https://yourbusiness.co.za" bind:value={data.websiteUrl} />
  </div>
{/if}

<div class="form-field" class:err={errors.mainGoal}>
  <label for="lf-goal">What's the main thing you want to improve?</label>
  <textarea
    id="lf-goal"
    rows="4"
    placeholder="e.g. We don't show up on Google and our site looks outdated..."
    bind:value={data.mainGoal}
  ></textarea>
  {#if errors.mainGoal}<span class="err-msg">{errors.mainGoal}</span>{/if}
</div>
