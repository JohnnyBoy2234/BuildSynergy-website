<script lang="ts">
  import { SERVICE_OPTIONS, type FunnelData } from './types';

  interface Props {
    data: FunnelData;
    onselect: () => void;
  }

  let { data = $bindable(), onselect }: Props = $props();
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

<style>
  .lf-title {
    font-size: 1.15rem;
    margin: 0 0 1.25rem;
  }
</style>
