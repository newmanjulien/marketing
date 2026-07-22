<script lang="ts">
  import IndustryConversationCard from '$lib/marketing/home/IndustryConversationCard.svelte';
  import HeroLogos from '$lib/marketing/home/HeroLogos.svelte';
  import { industries, type IndustryId } from '$lib/marketing/industries/industries';
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import { createPortalAuthUrl } from '$lib/marketing/portalAuthLinks';
  import ButtonLink from '$lib/marketing/ui/ButtonLink.svelte';

  // Hovering a logo and clicking a tab in the graphic both drive the same selection.
  let industryId = $state<IndustryId>(industries[0].id);

  function selectIndustry(id: IndustryId) {
    industryId = id;
  }
</script>

<section
  class="px-[18px] pt-[calc(95px-var(--site-mobile-header-height))] sm:px-8 sm:pt-[calc(133px-var(--site-mobile-header-height))] lg:pt-[150px]"
>
  <ContentMeasure class="flex flex-col items-center text-center">
    <h1
      class="max-w-[540px] font-heading text-[45px] font-semibold leading-[1.04] text-stone-750 sm:max-w-none sm:text-[46px]"
    >
      <span class="hero-title-lead inline-block">Grow</span>
      <span class="hero-title-rest inline-block">your practice</span>
    </h1>

    <p
      class="hero-support mt-[19px] max-w-[380px] font-light text-[25px] leading-[1.60] text-stone-500"
    >
      Overbase turns your network into new clients and more business
    </p>

    <div class="hero-logos mt-[39px]">
      <HeroLogos onIndustryHover={selectIndustry} />
    </div>

    <div class="hero-actions mt-[44px] flex justify-center">
      <ButtonLink
        href={createPortalAuthUrl('join', '/')}
        target="_blank"
        rel="noopener noreferrer"
        variant="primary"
        size="xxlarge"
        shape="pill"
        highlightSweep
        class="shadow-[0_5px_12px_rgba(41,37,36,0.2)] hover:-translate-y-[2px] hover:shadow-[0_8px_16px_rgba(41,37,36,0.28)]"
      >
        Join now
      </ButtonLink>
    </div>
  </ContentMeasure>

  <ContentMeasure>
    <div id="text-message" class="hero-graphic mt-[77px] scroll-mt-[100px]">
      <IndustryConversationCard {industryId} onIndustrySelect={selectIndustry} />
    </div>
  </ContentMeasure>
</section>

<style>
  section {
    --hero-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --hero-content-duration: 320ms;
    --hero-content-delay: 990ms;
  }

  /* The 180ms delay keeps "Grow" hidden through the typical font-loading window
     (the fetch starts at parse time via the preload in app.html), and any swap
     that still paints is shift-free thanks to the metric-matched 'Newsreader
     Fallback' face. In dev, hooks.server.ts inlines the font, so the swap path
     only exists in prod. */
  .hero-title-lead {
    opacity: 0;
    transform: translateY(4px);
    animation: hero-content-enter 420ms var(--hero-ease) 180ms both;
  }

  .hero-title-rest {
    opacity: 0;
    transform: translateX(-10px);
    animation: hero-content-enter 420ms var(--hero-ease) 350ms both;
  }

  .hero-support,
  .hero-actions,
  .hero-graphic {
    opacity: 0;
    transform: translateY(4px);
    animation: hero-content-enter var(--hero-content-duration) var(--hero-ease)
      var(--hero-content-delay) both;
  }

  /* The support copy leads the rest of the content by a short beat. */
  .hero-support {
    animation-delay: calc(var(--hero-content-delay) - 100ms);
  }

  /* The button eases up into its spot: a touch more travel and a softer
     settle than the surrounding content, so it gently floats in. */
  .hero-actions {
    transform: translateY(10px);
    animation-duration: 620ms;
  }

  /* Logos come in last: a short beat after the graphic finishes.
     HeroLogos staggers its items relative to this base delay. */
  .hero-logos {
    --logos-enter-delay: calc(var(--hero-content-delay) + var(--hero-content-duration) + 40ms);
  }

  @keyframes hero-content-enter {
    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-title-lead,
    .hero-title-rest,
    .hero-support,
    .hero-actions,
    .hero-graphic {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
</style>
