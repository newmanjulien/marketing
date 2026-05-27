<script lang="ts">
  import MainContentFrame from '$lib/page/MainContentFrame.svelte';
  import SeoHead from '$lib/page/SeoHead.svelte';
  import { createPortalAuthUrlForMarketingPath } from '$lib/portalAuthLinks';
  import PricingCard from './PricingCard.svelte';
  import PricingFaqSection from './PricingFaqSection.svelte';
  import { pricingFaqItems, pricingPageContent, pricingPlan } from './pricingContent';

  const joinHref = createPortalAuthUrlForMarketingPath('join', '/pricing');
</script>

<SeoHead meta={pricingPageContent} />

<MainContentFrame topPadding="compact">
  <section class="mx-auto w-full max-w-[680px]">
    <h1 class="font-heading text-[32px] font-medium leading-[1.05] tracking-normal text-stone-900">
      {pricingPageContent.heading}
    </h1>

    <p class="mt-[24px] max-w-[620px] text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700">
      {pricingPageContent.intro}
    </p>

    <PricingCard {joinHref} plan={pricingPlan} />
  </section>

  <PricingFaqSection items={pricingFaqItems} />
</MainContentFrame>
