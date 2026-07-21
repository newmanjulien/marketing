<script lang="ts">
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import PageFrame from '$lib/ui/PageFrame.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const legalPage = $derived(data.legalPage);
</script>

<svelte:head>
  <title>Overbase › {legalPage.title}</title>
</svelte:head>

<PageFrame>
  <ContentMeasure as="article">
    <a
      href="/legal"
      class="text-[14px] font-medium leading-none text-stone-500 transition-colors duration-200 hover:text-stone-900"
    >
      Legal
    </a>

    <header class="mt-[28px]">
      <h1 class="font-heading text-[42px] font-medium leading-[1.05] text-stone-900">
        {legalPage.title}
      </h1>
      <p class="mt-[16px] text-[16px] font-book leading-[1.55] text-stone-500">
        Last updated: {legalPage.updatedAtLabel}
      </p>
    </header>

    <div class="rich-text rich-text-legal mt-[32px] font-book text-[16px] leading-[1.55] text-stone-700">
      <legalPage.bodyComponent />
    </div>
  </ContentMeasure>
</PageFrame>
