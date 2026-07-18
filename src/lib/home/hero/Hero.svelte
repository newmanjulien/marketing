<script lang="ts">
  import OpportunityEmailGraphic from '$lib/home/features/opportunity-email/OpportunityEmailGraphic.svelte';
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import { createPortalAuthUrlForMarketingPath } from '$lib/portalAuthLinks';
  import ButtonLink from '$lib/ui/ButtonLink.svelte';

  const joinHref = createPortalAuthUrlForMarketingPath('join', '/');

  let emailEl: HTMLDivElement;

  function scrollToEmail() {
    emailEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
</script>

<section
  class="px-[18px] pt-[calc(95px-var(--site-mobile-header-height))] sm:px-8 sm:pt-[calc(133px-var(--site-mobile-header-height))] lg:pt-[133px]"
>
  <ContentMeasure class="flex flex-col items-center text-center">
    <h1
      class="hero-title max-w-[540px] font-heading text-[77px] font-medium leading-[1.04] tracking-normal text-stone-750 sm:max-w-none"
    >
      <span class="hero-title-lead inline-block will-change-[transform,opacity]">Share</span>
      <span class="hero-title-growth inline-block will-change-[transform,opacity]">sales data</span>
    </h1>

    <p
      class="hero-support mt-[10px] max-w-[490px] translate-y-[4px] font-light text-[23px] leading-[1.70] tracking-normal text-stone-700 opacity-0 will-change-[transform,opacity]"
    >
      Overbase helps <a href="/industries" class="text-blue-400 underline decoration-current underline-offset-[3px] transition-colors hover:text-blue-500">professional services firms</a> easily and quickly <button type="button" onclick={scrollToEmail} class="text-blue-400 underline decoration-current underline-offset-[3px] transition-colors hover:text-blue-500">grow revenue</button> by sharing sales data with your ecosystem partners
    </p>

    <div class="hero-actions mt-[44px] flex translate-y-[4px] items-center justify-center gap-[9px] opacity-0 will-change-[transform,opacity]">
      <ButtonLink
        href={joinHref}
        target="_blank"
        rel="noopener noreferrer"
        variant="primary"
        size="xlarge"
        textSize="compact"
        shape="pill"
        highlightSweep
        class="shadow-[0_5px_12px_rgba(41,37,36,0.2)] hover:-translate-y-[2px] hover:shadow-[0_8px_16px_rgba(41,37,36,0.28)]"
      >
        Join now
      </ButtonLink>
    </div>

  </ContentMeasure>

  <ContentMeasure>
    <div
      bind:this={emailEl}
      class="hero-email mt-[79px] translate-y-[4px] opacity-0 will-change-[transform,opacity] sm:mt-[83px]"
    >
      <OpportunityEmailGraphic />
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

  .hero-actions,
  .hero-email {
    animation: hero-content-enter 320ms cubic-bezier(0.22, 1, 0.36, 1) 990ms both;
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
    .hero-email {
      animation: none;
      opacity: 1;
      transform: none;
      will-change: auto;
    }
  }
</style>
