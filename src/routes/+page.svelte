<script lang="ts">
  import Navigation       from '$lib/components/Navigation.svelte';
  import AuroraBackground from '$lib/components/AuroraBackground.svelte';
  import Hero             from '$lib/components/Hero.svelte';
  import TrustStrip       from '$lib/components/TrustStrip.svelte';
  import ProblemSection   from '$lib/components/ProblemSection.svelte';
  import SolutionSection  from '$lib/components/SolutionSection.svelte';
  import AiSection        from '$lib/components/AiSection.svelte';
  import ProcessSection   from '$lib/components/ProcessSection.svelte';
  import PortfolioTeaser  from '$lib/components/PortfolioTeaser.svelte';
  import ManifestoSection from '$lib/components/ManifestoSection.svelte';
  import FinalCTA         from '$lib/components/FinalCTA.svelte';
  import Footer           from '$lib/components/Footer.svelte';
  import Seo              from '$lib/components/Seo.svelte';
</script>

<Seo
  title="BuildSynergy | Professional Websites for SA Businesses"
  description="BuildSynergy helps South African businesses look more credible online, get found faster, capture enquiries and stay supported after launch."
/>

<Navigation />
<AuroraBackground />
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

  <!-- 4b. AI Solutions — full-bleed dark band, its own separator (no divider) -->
  <AiSection />

  <!-- 5. Process -->
  <div class="divider"></div>
  <ProcessSection />

  <!-- 6. Selected work -->
  <div class="divider"></div>
  <PortfolioTeaser />

  <!-- 10. Why BuildSynergy -->
  <ManifestoSection />

  <!-- Final CTA -->
  <div class="divider"></div>
  <FinalCTA />
</main>
<Footer />
