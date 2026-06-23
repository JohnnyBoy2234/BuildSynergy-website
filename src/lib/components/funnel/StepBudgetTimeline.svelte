<script lang="ts">
  import { TIMELINE_OPTIONS, BUDGET_OPTIONS, type FunnelData } from './types';

  interface Props {
    data: FunnelData;
    errors: Record<string, string>;
  }

  let { data = $bindable(), errors }: Props = $props();
</script>

<h3 class="lf-title">Timeline and budget</h3>

<div class="form-field" class:err={errors.timeline}>
  <span class="lf-label">When do you want to be live?</span>
  <div class="chips" role="group" aria-label="Timeline">
    {#each TIMELINE_OPTIONS as opt}
      <button
        type="button"
        class="chip"
        class:active={data.timeline === opt}
        aria-pressed={data.timeline === opt}
        onclick={() => (data.timeline = opt)}
      >{opt}</button>
    {/each}
  </div>
  {#if errors.timeline}<span class="err-msg">{errors.timeline}</span>{/if}
</div>

<div class="form-field">
  <span class="lf-label">Budget range <span class="opt">(optional)</span></span>
  <div class="chips" role="group" aria-label="Budget range">
    {#each BUDGET_OPTIONS as opt}
      <button
        type="button"
        class="chip"
        class:active={data.budget === opt}
        aria-pressed={data.budget === opt}
        onclick={() => (data.budget = data.budget === opt ? '' : opt)}
      >{opt}</button>
    {/each}
  </div>
</div>
