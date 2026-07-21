<script lang="ts">
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import PageFrame from '$lib/ui/PageFrame.svelte';
  import PillTabs from '$lib/ui/PillTabs.svelte';
  import type { DocsPage } from './docsPages';

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
        <p class="mt-[16px] text-[17px] font-book leading-[1.55] tracking-normal text-stone-600">
          {page.description}
        </p>
      {/if}
    </header>

    {#key `${page.category}/${page.slug}`}
      <PillTabs
        tabs={page.sections}
        ariaLabel="Documentation sections"
        listClass="mt-[34px]"
        panelClass="rich-text rich-text-docs mt-[28px] min-h-[160px] font-book text-[16px] leading-[1.55] tracking-normal text-stone-700"
      >
        {#snippet children(section)}
          <section.component />
        {/snippet}
      </PillTabs>
    {/key}
  </ContentMeasure>
</PageFrame>
