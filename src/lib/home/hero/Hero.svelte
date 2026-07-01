<script lang="ts">
  import { ArrowRightIcon } from 'phosphor-svelte';
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import { createPortalAuthUrlForMarketingPath } from '$lib/portalAuthLinks';
  import HeroCtaButton from './HeroCtaButton.svelte';
  import HeroIndustryProof from './HeroIndustryProof.svelte';

  const joinHref = createPortalAuthUrlForMarketingPath('join', '/');
</script>

<section class="px-[18px] pt-[115px] sm:px-8 sm:pt-[153px]">
  <ContentMeasure class="flex !max-w-[780px] flex-col items-center text-center">
  <a
    href={joinHref}
    target="_blank"
    rel="noopener noreferrer"
    class="hero-pill mb-[33px] inline-flex min-h-[26px] translate-y-[8px] items-center gap-[7px] rounded-full border border-stone-200/70 bg-white py-0 pl-[12px] pr-[11px] text-[13px] font-normal leading-none text-stone-750 opacity-0 transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 will-change-[transform,opacity]"
    aria-label="Use your partner invite"
  >
    <span>Redeem partner invite</span>
    <ArrowRightIcon size={12} weight="regular" class="text-stone-300" aria-hidden="true" />
  </a>

  <h1
    class="hero-title max-w-[540px] font-heading text-[90px] font-semibold leading-[1.04] tracking-normal text-stone-750 sm:max-w-none"
  >
    <span class="hero-title-lead inline-block will-change-[transform,opacity]">Share</span>
    <span class="hero-title-growth inline-block will-change-[transform,opacity]">sales data</span>
  </h1>

  <p
    class="hero-support mt-[18px] max-w-[430px] translate-y-[4px] font-[350] text-[21px] leading-[1.65] tracking-normal text-stone-700 opacity-0 will-change-[transform,opacity] sm:max-w-[520px]"
  >
    Overbase helps professional services firms share sales data with your ecosystem partners
  </p>

  <div class="hero-actions mt-[44px] flex translate-y-[4px] items-center justify-center gap-[9px] opacity-0 will-change-[transform,opacity]">
    <HeroCtaButton
      href={joinHref}
      target="_blank"
      rel="noopener noreferrer"
    >
      Join now
    </HeroCtaButton>
  </div>

  <div class="hero-proof mt-[56px] w-full translate-y-[4px] opacity-0 will-change-[transform,opacity] sm:mt-[60px]">
    <HeroIndustryProof />
  </div>
  </ContentMeasure>
</section>

<style>
  .hero-pill {
    animation: hero-content-enter 320ms cubic-bezier(0.22, 1, 0.36, 1) 890ms both;
  }

  .hero-title-lead {
    animation: hero-title-lead-settle 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .hero-title-growth {
    animation: hero-title-growth-enter 420ms cubic-bezier(0.22, 1, 0.36, 1) 350ms both;
  }

  .hero-support {
    animation: hero-content-enter 320ms cubic-bezier(0.22, 1, 0.36, 1) 890ms both;
  }

  .hero-actions {
    animation: hero-content-enter 320ms cubic-bezier(0.22, 1, 0.36, 1) 990ms both;
  }

  .hero-proof {
    animation: hero-content-enter 320ms cubic-bezier(0.22, 1, 0.36, 1) 1090ms both;
  }

  @keyframes hero-title-lead-settle {
    from {
      opacity: 0.92;
      transform: translateY(2px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes hero-title-growth-enter {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes hero-content-enter {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-pill,
    .hero-title-lead,
    .hero-title-growth,
    .hero-support,
    .hero-actions,
    .hero-proof {
      animation: none;
      opacity: 1;
      transform: none;
      will-change: auto;
    }
  }
</style>
