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

<main class="bg-stone-50/30">
  <Hero />

  <div class="flex flex-col gap-[150px] pt-[150px] sm:gap-[190px] sm:pt-[190px]">
    <FeatureSection
      title="Connect your calendar"
      body="Easily, quickly and safely connect your Outlook calendar. Overbase finds opportunities using data from your calendar"
    >
      <CalendarConnectGraphic />
    </FeatureSection>

    <FeatureSection
      title="Your network connects their calendar"
      body="Professionals in your network connect their Outlook calendar so Overbase can find overlapping opportunities"
    >
      <NetworkResultsGraphic />
    </FeatureSection>

    <FeatureSection
      title="Receive opportunities by email"
      body="Overbase sends you opportunities by email. No dashboard and no need to change how you work"
    >
      <TestimonialsGraphic />
    </FeatureSection>

    <HomeCtaSection />
  </div>
</main>
