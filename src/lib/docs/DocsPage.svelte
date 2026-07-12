<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import DocsSectionTabs from './DocsSectionTabs.svelte';
  import type { DocsPage } from './docsTypes';

  let { page }: { page: DocsPage } = $props();
</script>

<PageFrame>
  <ContentMeasure as="article" width="narrow">
    <header>
      <p class="text-[14px] font-medium leading-none tracking-normal text-stone-500">
        {page.categoryLabel} IT documentation
      </p>

      <h1 class="mt-[28px] font-heading text-[32px] font-medium leading-[1.05] tracking-normal text-stone-900">
        {page.title}
      </h1>

      {#if page.description}
        <p class="mt-[16px] max-w-[620px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-600">
          {page.description}
        </p>
      {/if}
    </header>

    <DocsSectionTabs {page} />
  </ContentMeasure>
</PageFrame>
