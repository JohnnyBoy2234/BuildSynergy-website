<script lang="ts">
  import { SERVICE_OPTIONS, type FunnelData } from './types';

  interface Props {
    data: FunnelData;
    errors: Record<string, string>;
    onselect: () => void;
  }

  let { data = $bindable(), errors, onselect }: Props = $props();
</script>

<h3 class="lf-title">What do you need help with?</h3>
<div class="chips" role="group" aria-label="Service required">
  {#each SERVICE_OPTIONS as opt}
    <button
      type="button"
      class="chip"
      class:active={data.service === opt}
      aria-pressed={data.service === opt}
      onclick={() => { data.service = opt; onselect(); }}
    >{opt}</button>
  {/each}
</div>
{#if errors.service}<span class="err-msg">{errors.service}</span>{/if}
