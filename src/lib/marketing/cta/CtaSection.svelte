<script lang="ts">
  import { page } from '$app/state';
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import ButtonLink from '$lib/marketing/ui/ButtonLink.svelte';
  import { createPortalAuthUrl } from '$lib/marketing/portalAuthLinks';

  let { heading, workPhrase = 'you work' }: { heading: string; workPhrase?: string } = $props();

  const joinHref = $derived(createPortalAuthUrl('join', page.url.pathname));
</script>

<section class="border-t border-stone-200 bg-stone-50/60 px-[18px] py-[72px] sm:px-8 sm:py-[90px]">
  <ContentMeasure class="flex flex-col items-center text-center">
    <h2
      class="font-heading text-[26px] font-medium leading-[1.08] tracking-normal text-stone-750 sm:text-[31px] sm:leading-[1.06]"
    >
      {heading}
    </h2>

    <p
      class="mt-[12px] max-w-[400px] text-[18px] font-book leading-[1.6] tracking-normal text-stone-700"
    >
      Overbase is made for how {workPhrase}
    </p>

    <div class="mt-[33px] flex items-center justify-center">
      <ButtonLink
        href={joinHref}
        target="_blank"
        rel="noopener noreferrer"
        variant="primary"
        size="xlarge"
        shape="pill"
      >
        Join now
      </ButtonLink>
    </div>
  </ContentMeasure>
</section>
