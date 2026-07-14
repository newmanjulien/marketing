<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import ButtonLink from '$lib/ui/ButtonLink.svelte';
  import { createPortalAuthUrlForMarketingPath } from '$lib/portalAuthLinks';

  const joinHref = createPortalAuthUrlForMarketingPath('join', '/');
</script>

<section class="border-t border-stone-200/70 bg-white px-[18px] py-[72px] sm:px-8 sm:py-[90px]">
  <ContentMeasure class="flex flex-col items-center text-center">
    <h2
      class="font-heading text-[30px] font-semibold leading-[1.08] tracking-normal text-stone-750 sm:text-[36px] sm:leading-[1.06]"
    >
      Built for professional services
    </h2>

    <p
      class="mt-[18px] max-w-[440px] text-[16px] font-book leading-[1.6] tracking-normal text-stone-500 sm:mt-[20px] sm:text-[17px]"
    >
      The easiest and fastest way for professional services firms to accelerate revenue
    </p>

    <div class="mt-[24px] flex items-center justify-center">
      <ButtonLink
        href={joinHref}
        target="_blank"
        rel="noopener noreferrer"
        variant="primary"
        size="hero"
        textSize="compact"
        shape="pill"
      >
        Join now
      </ButtonLink>
    </div>
  </ContentMeasure>
</section>
