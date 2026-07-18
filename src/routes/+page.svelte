<script lang="ts">
  import DataSourceGridGraphic from '$lib/home/features/data-sources/DataSourceGridGraphic.svelte';
  import PartnerDataSharingGraphic from '$lib/home/features/partner-sharing/PartnerDataSharingGraphic.svelte';
  import TestimonialsGraphic from '$lib/home/features/testimonials/TestimonialsGraphic.svelte';
  import HomeCtaSection from '$lib/home/cta/HomeCtaSection.svelte';
  import Hero from '$lib/home/hero/Hero.svelte';
  import FeatureSection from '$lib/home/shared/FeatureSection.svelte';
</script>

<svelte:head>
  <meta
    name="description"
    content="Overbase helps professional services firms share sales data with your ecosystem partners"
  />
</svelte:head>

<main class="bg-stone-50/30">
  <Hero />

  <div class="flex flex-col gap-[150px] pt-[150px] sm:gap-[190px] sm:pt-[190px]">
    <FeatureSection
      title="Connect your sales data"
      body="Share any structured data like CRM and share any unstructured data like email. Easily share even your most disconnected data"
    >
      <DataSourceGridGraphic />
    </FeatureSection>

    <FeatureSection
      title="Partners connect their data"
      body="Your ecosystem partners can share data with you for free and securely. They stay in full control of what gets shared"
    >
      <PartnerDataSharingGraphic />
    </FeatureSection>

    <FeatureSection
      title="Receive opportunities by email"
      body="There's no need to change how your team operates. Overbase simply sends revenue opportunities by email"
    >
      <TestimonialsGraphic />
    </FeatureSection>

    <HomeCtaSection />
  </div>
</main>
