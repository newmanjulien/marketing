<script lang="ts">
  import DataSourceGridGraphic from './DataSourceGridGraphic.svelte';
  import FeatureSection from './FeatureSection.svelte';
  import Hero from './Hero.svelte';
  import OpportunityEmailGraphic from './OpportunityEmailGraphic.svelte';
  import PartnerDataSharingGraphic from './PartnerDataSharingGraphic.svelte';
  import SectionStack from './SectionStack.svelte';
  import TestimonialsSection from './TestimonialsSection.svelte';
</script>

<svelte:head>
  <title>Overbase - Share sales data</title>
  <meta
    name="description"
    content="Overbase helps professional services firms share sales data with ecosystem partners and receive revenue opportunities by email."
  />
</svelte:head>

<main>
  <Hero />
  <SectionStack>
    <FeatureSection
      title="Share your data"
      body="Share any structured data like CRM and share any unstructured data like email. Easily share even your most disconnected data"
    >
      <DataSourceGridGraphic />
    </FeatureSection>

    <FeatureSection
      title="Partners share their data"
      body="Your ecosystem partners can share data with you for free and securely"
    >
      <PartnerDataSharingGraphic />
    </FeatureSection>

    <FeatureSection
      title="Get opportunities by email"
      body="We compare both sides to find overlap, then we send actionable revenue opportunities to your team by email"
    >
      <OpportunityEmailGraphic />
    </FeatureSection>

    <TestimonialsSection />
  </SectionStack>
</main>
