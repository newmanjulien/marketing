<script lang="ts">
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import PageFrame from '$lib/ui/PageFrame.svelte';
  import PillTabs from '$lib/ui/PillTabs.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Overbase › {data.title}</title>
</svelte:head>

<PageFrame>
  <ContentMeasure as="article" width="narrow">
    <header>
      <p class="text-[14px] font-medium leading-none text-stone-500">
        {data.categoryLabel} IT documentation
      </p>

      <h1 class="mt-[28px] font-heading text-[32px] font-medium leading-[1.05] text-stone-900">
        {data.title}
      </h1>

      <p class="mt-[16px] text-[17px] font-book leading-[1.55] text-stone-600">
        {data.description}
      </p>
    </header>

    <!-- Every docs page shares the same section keys, so PillTabs' selection would carry over between pages; the key deliberately resets it. -->
    {#key `${data.category}/${data.slug}`}
      <PillTabs
        tabs={data.sections}
        ariaLabel="Documentation sections"
        listClass="mt-[34px]"
        panelClass="rich-text rich-text-docs mt-[28px] min-h-[160px] font-book text-[16px] leading-[1.55] text-stone-700"
      >
        {#snippet children(section)}
          <section.component />
        {/snippet}
      </PillTabs>
    {/key}
  </ContentMeasure>
</PageFrame>
