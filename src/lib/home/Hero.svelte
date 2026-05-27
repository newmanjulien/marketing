<script lang="ts">
  import { ArrowRightIcon } from 'phosphor-svelte';
  import ButtonLink from '$lib/ui/ButtonLink.svelte';
  import { createPortalAuthHrefForPath } from '$lib/portalAuthLinks';

  const joinHref = createPortalAuthHrefForPath('join', '/');
</script>

<section
  class="mx-auto flex w-full max-w-[780px] flex-col items-start px-[18px] pt-[126px] md:items-center md:px-8 md:pt-[157px]"
>
  <a
    href={joinHref}
    target="_blank"
    rel="noopener noreferrer"
    class="hero-pill mb-[26px] inline-flex min-h-[26px] translate-y-[8px] items-center gap-[7px] rounded-full border border-stone-200/70 bg-white py-0 pl-[12px] pr-[11px] text-[13px] font-normal leading-none text-stone-800 opacity-0 transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 will-change-[transform,opacity]"
    aria-label="Use your partner invite"
  >
    <span>Redeem partner invite</span>
    <ArrowRightIcon size={12} weight="regular" class="text-stone-300" aria-hidden="true" />
  </a>

  <h1
    class="hero-title max-w-[520px] font-heading text-[72px] font-semibold leading-[1.04] tracking-normal text-stone-800 md:max-w-none md:text-center md:text-[82px] md:leading-[1.02]"
  >
    <span class="hero-title-lead inline-block will-change-[transform,opacity]">Share</span>
    <span class="hero-title-growth inline-block will-change-[transform,opacity]">sales data</span>
  </h1>

  <p
    class="hero-support mt-[28px] max-w-[430px] translate-y-[4px] text-left text-[22px] leading-[1.55] tracking-normal text-stone-500 opacity-0 will-change-[transform,opacity] md:mt-[26px] md:max-w-[520px] md:text-center md:text-[20px] md:leading-[1.55]"
  >
    Overbase lets professional services firms share sales data with your ecosystem partners
  </p>

  <div class="hero-actions mt-[54px] flex translate-y-[4px] items-center gap-[9px] opacity-0 will-change-[transform,opacity] md:mt-[44px] md:justify-center">
    <ButtonLink href={joinHref} target="_blank" rel="noopener noreferrer" variant="primary" size="large" textSize="compact">Join now</ButtonLink>
    <ButtonLink href="https://cal.com/juliennewman" target="_blank" rel="noopener noreferrer" variant="secondary" size="large" textSize="compact">Request demo</ButtonLink>
  </div>
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
    .hero-actions {
      animation: none;
      opacity: 1;
      transform: none;
      will-change: auto;
    }
  }
</style>
