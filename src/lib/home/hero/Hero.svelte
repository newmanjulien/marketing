<script lang="ts">
  import TextMessageGraphic from '$lib/home/features/text-message/TextMessageGraphic.svelte';
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import { createPortalAuthUrlForMarketingPath } from '$lib/portalAuthLinks';
  import ButtonLink from '$lib/ui/ButtonLink.svelte';

  const joinHref = createPortalAuthUrlForMarketingPath('join', '/');
</script>

<section
  class="px-[18px] pt-[calc(95px-var(--site-mobile-header-height))] sm:px-8 sm:pt-[calc(133px-var(--site-mobile-header-height))] lg:pt-[163px]"
>
  <ContentMeasure class="flex flex-col items-center text-center">
    <h1
      class="hero-title max-w-[540px] font-heading text-[55px] font-semibold leading-[1.04] tracking-normal text-stone-750 sm:max-w-none"
    >
      <span class="hero-title-lead inline-block will-change-[transform,opacity]">Grow</span>
      <span class="hero-title-growth inline-block will-change-[transform,opacity]">your practice</span>
    </h1>

    <p
      class="hero-support mt-[19px] max-w-[400px] translate-y-[4px] font-light text-[26px] leading-[1.60] tracking-normal text-stone-500 opacity-0 will-change-[transform,opacity]"
    >
      Overbase turns your network into new clients and more business
    </p>

    <div class="hero-actions mt-[36px] flex translate-y-[4px] items-center justify-center gap-[9px] opacity-0 will-change-[transform,opacity]">
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
      class="hero-graphic mt-[89px] translate-y-[4px] opacity-0 will-change-[transform,opacity] sm:mt-[143px]"
    >
      <TextMessageGraphic />
    </div>
  </ContentMeasure>
</section>

<style>
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
  .hero-graphic {
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
    .hero-title-lead,
    .hero-title-growth,
    .hero-support,
    .hero-actions,
    .hero-graphic {
      animation: none;
      opacity: 1;
      transform: none;
      will-change: auto;
    }
  }
</style>
