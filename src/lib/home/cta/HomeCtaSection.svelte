<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import ButtonLink from '$lib/ui/ButtonLink.svelte';
  import { createPortalAuthUrlForMarketingPath } from '$lib/portalAuthLinks';

  const joinHref = createPortalAuthUrlForMarketingPath('join', '/');
</script>

<section class="border-t border-stone-200/70 bg-white px-[18px] py-[72px] sm:px-8 sm:py-[90px]">
  <ContentMeasure class="flex flex-col items-center text-center">
    <h2
      class="font-heading text-[26px] font-medium leading-[1.08] tracking-normal text-stone-750 sm:text-[31px] sm:leading-[1.06]"
    >
      Built for professional services
    </h2>

    <p
      class="mt-[12px] max-w-[400px] text-[21px] font-book leading-[1.6] tracking-normal text-stone-700 sm:mt-[12px]"
    >
      Get new clients and more work
    </p>

    <div class="mt-[33px] flex items-center justify-center">
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
