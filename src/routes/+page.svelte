<script lang="ts">
  import Navigation       from '$lib/components/Navigation.svelte';
  import Hero             from '$lib/components/Hero.svelte';
  import TrustStrip       from '$lib/components/TrustStrip.svelte';
  import ProblemSection   from '$lib/components/ProblemSection.svelte';
  import SolutionSection  from '$lib/components/SolutionSection.svelte';
  import ProcessSection   from '$lib/components/ProcessSection.svelte';
  import PackageSection   from '$lib/components/PackageSection.svelte';
  import ManifestoSection from '$lib/components/ManifestoSection.svelte';
  import FinalCTA         from '$lib/components/FinalCTA.svelte';
  import Footer           from '$lib/components/Footer.svelte';
</script>

<svelte:head>
  <title>BuildSynergy Professional Websites & Digital Solutions for South African Businesses</title>
  <meta name="description" content="BuildSynergy helps South African businesses look more credible online, get found faster, capture enquiries and stay supported after launch." />
</svelte:head>

<Navigation />
<main>
  <!-- 1. Hero -->
  <Hero />

  <!-- 2. Trust Strip -->
  <TrustStrip />

  <!-- 3. Problem -->
  <div class="divider"></div>
  <ProblemSection />

  <!-- 4. Solution -->
  <div class="divider"></div>
  <SolutionSection />

  <!-- 5. Process -->
  <div class="divider"></div>
  <ProcessSection />

  <!-- 9. Packages -->
  <div class="divider"></div>
  <PackageSection />

  <!-- 10. Why BuildSynergy -->
  <ManifestoSection />

  <!-- Final CTA -->
  <div class="divider"></div>
  <FinalCTA />
</main>
<Footer />
