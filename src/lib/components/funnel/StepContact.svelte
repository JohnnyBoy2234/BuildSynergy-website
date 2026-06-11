<script lang="ts">
  import type { FunnelData } from './types';

  interface Props {
    data: FunnelData;
    errors: Record<string, string>;
  }

  let { data = $bindable(), errors }: Props = $props();
</script>

<h3 class="lf-title">How do we reach you?</h3>

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

<style>
  .lf-title {
    font-size: 1.15rem;
    margin: 0 0 1.25rem;
  }
  .opt {
    font-weight: 400;
    opacity: 0.6;
  }
</style>
