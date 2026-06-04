<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  function scrollToFeatures() {
    const el = document.getElementById('features')
    el?.scrollIntoView({ behavior: 'smooth' })
  }
</script>

<style>
  .hero-outer { padding: 48px 0; }
  .cta { margin-top: 18px; display:inline-block; padding:10px 18px; background:var(--accent); color:white; border-radius:8px; cursor:pointer }
</style>

<section class="hero-outer">
  <h1>Create an unforgettable presence</h1>
  <p>Scrolling 2D animations, interactive 3D, and delightful micro-interactions for your business.</p>
  <div>
    <button class="cta" on:click={scrollToFeatures}>See features</button>
  </div>
</section>
