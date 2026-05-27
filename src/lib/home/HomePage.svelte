<script lang="ts">
  import DataSourceGridGraphic from './DataSourceGridGraphic.svelte';
  import FeatureSection from './FeatureSection.svelte';
  import Hero from './Hero.svelte';
  import OpportunityEmailGraphic from './OpportunityEmailGraphic.svelte';
  import PartnerDataSharingGraphic from './PartnerDataSharingGraphic.svelte';
  import TestimonialsSection from './TestimonialsSection.svelte';
  import SeoHead from '$lib/page/SeoHead.svelte';
  import { homePageContent } from './homeContent';
</script>

<SeoHead meta={homePageContent} />

<main>
  <Hero />
  <div class="flex flex-col gap-[112px] pb-[112px] pt-[160px] md:gap-[150px] md:pb-[150px] md:pt-[220px]">
    <FeatureSection
      title={homePageContent.features.dataSources.title}
      body={homePageContent.features.dataSources.body}
    >
      <DataSourceGridGraphic />
    </FeatureSection>

    <FeatureSection
      title={homePageContent.features.partnerSharing.title}
      body={homePageContent.features.partnerSharing.body}
    >
      <PartnerDataSharingGraphic />
    </FeatureSection>

    <FeatureSection
      title={homePageContent.features.opportunityEmail.title}
      body={homePageContent.features.opportunityEmail.body}
    >
      <OpportunityEmailGraphic />
    </FeatureSection>

    <TestimonialsSection />
  </div>
</main>
