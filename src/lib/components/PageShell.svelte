<script lang="ts">
  import DeveloperExperienceGraphic from './DeveloperExperienceGraphic.svelte';
  import FeatureSection from './FeatureSection.svelte';
  import Hero from './Hero.svelte';
  import IntegrationGridGraphic from './IntegrationGridGraphic.svelte';
  import SavedSegmentsGraphic from './SavedSegmentsGraphic.svelte';
  import SectionStack from './SectionStack.svelte';
  import TestimonialsSection from './TestimonialsSection.svelte';
</script>

<svelte:head>
  <title>Overbase - Share sales data</title>
  <meta
    name="description"
    content="Loops is the simplest way to send product, marketing, and transactional email."
  />
</svelte:head>

<main>
  <Hero />
  <SectionStack>
    <FeatureSection
      title="Share your data"
      body="Share any structured data like CRM and share any unstructured data like email. Easily share even your most disconnected data"
    >
      <IntegrationGridGraphic />
    </FeatureSection>

    <FeatureSection
      title="Partners share their data"
      body="Your ecosystem partners can share data with you for free and securely"
    >
      <SavedSegmentsGraphic />
    </FeatureSection>

    <FeatureSection
      title="Get opportunities by email"
      body="We compare both sides to find overlap, then we send actionable revenue opportunities to your team by email"
    >
      <DeveloperExperienceGraphic />
    </FeatureSection>

    <TestimonialsSection />
  </SectionStack>
</main>
