<script lang="ts">
  import { page } from '$app/state';
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import ButtonLink from '$lib/marketing/ui/ButtonLink.svelte';
  import { createPortalAuthUrl } from '$lib/marketing/portalAuthLinks';

  let { subject, workPhrase = 'you work' }: { subject: string; workPhrase?: string } = $props();
</script>

<section class="border-t border-stone-200 bg-stone-50/60 px-[18px] py-[72px] sm:px-8 sm:py-[90px]">
  <ContentMeasure class="flex flex-col items-center text-center">
    <h2 class="font-heading text-[26px] font-medium leading-[1.08] text-stone-750 sm:text-[31px] sm:leading-[1.06]">
      Built for {subject}
    </h2>

    <p class="mt-[12px] max-w-[400px] text-[18px] font-book leading-[1.6] text-stone-700">
      Overbase is made for how {workPhrase}
    </p>

    <ButtonLink
      href={createPortalAuthUrl('join', page.url.pathname)}
      target="_blank"
      rel="noopener noreferrer"
      variant="primary"
      size="xlarge"
      shape="pill"
      class="mt-[33px]"
    >
      Join now
    </ButtonLink>
  </ContentMeasure>
</section>
