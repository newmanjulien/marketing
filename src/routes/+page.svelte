<script lang="ts">
  import CalendarConnectGraphic from '$lib/home/features/calendar-connect/CalendarConnectGraphic.svelte';
  import NetworkResultsGraphic from '$lib/home/features/network-results/NetworkResultsGraphic.svelte';
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

<main>
  <Hero />

  <div class="flex flex-col gap-[150px] pt-[150px] sm:gap-[190px] sm:pt-[190px]">
    <FeatureSection
      title="You connect your data"
      body="Easily, quickly and safely connect any data source. Overbase can analyze any structured and unstructured data"
    >
      <CalendarConnectGraphic />
    </FeatureSection>

    <FeatureSection
      title="Your network connects their data"
      body="Your network easily, quickly and safely connects their data for free then we find opportunities for both of you"
    >
      <NetworkResultsGraphic />
    </FeatureSection>

    <FeatureSection
      title="Receive opportunities by text message"
      body="Overbase sends opportunities by text message. No dashboard and no need to change how you work"
    >
      <TestimonialsGraphic />
    </FeatureSection>

    <HomeCtaSection />
  </div>
</main>
