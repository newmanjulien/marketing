<script lang="ts">
  import DataSourceGridGraphic from '$lib/home/features/data-sources/DataSourceGridGraphic.svelte';
  import OpportunityEmailGraphic from '$lib/home/features/opportunity-email/OpportunityEmailGraphic.svelte';
  import PartnerDataSharingGraphic from '$lib/home/features/partner-sharing/PartnerDataSharingGraphic.svelte';
  import TestimonialsSection from '$lib/home/features/testimonials/TestimonialsSection.svelte';
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

<main>
  <Hero />
  <div class="flex flex-col gap-[150px] pt-[190px] sm:gap-[190px] sm:pt-[260px]">
    <FeatureSection
      title="Share your sales data"
      body="Share any structured data like CRM and share any unstructured data like email. Easily share even your most disconnected data"
    >
      <DataSourceGridGraphic />
    </FeatureSection>

    <FeatureSection
      title="Partners share their data"
      body="Your ecosystem partners can share data with you for free and securely. They stay in full control of what gets shared"
    >
      <PartnerDataSharingGraphic />
    </FeatureSection>

    <FeatureSection
      title="Get opportunities by email"
      body="Get opportunities that accelerate revenue growth quickly, easily and without changing how your team operates"
    >
      <OpportunityEmailGraphic />
    </FeatureSection>

    <TestimonialsSection />
    <HomeCtaSection />
  </div>
</main>
