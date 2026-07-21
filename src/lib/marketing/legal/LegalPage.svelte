<script lang="ts">
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import PageFrame from '$lib/ui/PageFrame.svelte';
  import type { LegalPage } from './legalPages';

  let { page }: { page: LegalPage } = $props();
</script>

<PageFrame>
  <ContentMeasure as="article" width={page.contentWidth ?? 'narrow'}>
    <a
      href="/legal"
      class="text-[14px] font-medium leading-none tracking-normal text-stone-500 transition-colors duration-200 hover:text-stone-900"
    >
      Legal
    </a>

    <header class="mt-[28px]">
      <h1 class="font-heading text-[42px] font-medium leading-[1.05] tracking-normal text-stone-900">
        {page.title}
      </h1>
      <p class="mt-[16px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-500">
        Last updated: {page.updatedAtLabel}
      </p>
    </header>

    <div class="rich-text rich-text-legal mt-[32px] font-book text-[16px] leading-[1.55] tracking-normal text-stone-700">
      <page.bodyComponent />
    </div>
  </ContentMeasure>
</PageFrame>
