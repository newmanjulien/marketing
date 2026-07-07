<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import PillTabs from '$lib/ui/PillTabs.svelte';
  import type { DocsPage } from './docsTypes';

  let { page }: { page: DocsPage } = $props();
</script>

<PageFrame topPadding="standard">
  <ContentMeasure as="article" width="narrow">
    <header>
      <p class="text-[14px] font-medium leading-none tracking-normal text-stone-500">
        {page.categoryLabel} IT documentation
      </p>

      <h1 class="mt-[28px] font-heading text-[32px] font-medium leading-[1.05] tracking-normal text-stone-900">
        {page.title}
      </h1>

      {#if page.description}
        <div class="mt-[16px] space-y-[8px]">
          <p class="max-w-[620px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-600">
            {page.description}
          </p>
        </div>
      {/if}
    </header>

    <PillTabs
      idBase={`docs-${page.category}-${page.slug}`}
      tabs={page.sections}
      ariaLabel="Documentation sections"
      listClass="mt-[34px]"
      panelClass="docs-rich-text mt-[28px] min-h-[160px] font-book text-[16px] leading-[1.55] tracking-normal text-stone-700"
    >
      {#snippet children(section)}
        {@const SectionComponent = section.component}
        <SectionComponent />
      {/snippet}
    </PillTabs>
  </ContentMeasure>
</PageFrame>

<style>
  :global(.docs-rich-text p) {
    margin-top: 16px;
    max-width: 680px;
  }

  :global(.docs-rich-text p:first-child) {
    margin-top: 0;
  }

  :global(.docs-rich-text h2),
  :global(.docs-rich-text h3) {
    max-width: 680px;
    font-family: var(--font-heading);
    font-weight: 500;
    color: rgb(41 37 36);
  }

  :global(.docs-rich-text h2) {
    margin-top: 60px;
    font-size: 22px;
    line-height: 1.2;
  }

  :global(.docs-rich-text h3) {
    margin-top: 38px;
    font-size: 18px;
    line-height: 1.3;
  }

  :global(.docs-rich-text h2:first-child),
  :global(.docs-rich-text h3:first-child) {
    margin-top: 0;
  }

  :global(.docs-rich-text strong) {
    font-weight: 500;
    color: rgb(41 37 36);
  }

  :global(.docs-rich-text a) {
    color: rgb(68 64 60);
    text-decoration: underline;
    text-decoration-color: rgb(168 162 158);
    text-underline-offset: 3px;
    transition: color 160ms ease, text-decoration-color 160ms ease;
  }

  :global(.docs-rich-text a:hover) {
    color: rgb(28 25 23);
    text-decoration-color: rgb(28 25 23);
  }

  :global(.docs-rich-text blockquote) {
    margin-top: 16px;
    max-width: 660px;
    border-left: 2px solid rgb(214 211 209);
    padding-left: 18px;
    color: rgb(87 83 78);
  }

  :global(.docs-rich-text blockquote p) {
    max-width: none;
  }

  :global(.docs-rich-text ul),
  :global(.docs-rich-text ol) {
    margin-top: 12px;
    max-width: 660px;
    padding-left: 22px;
  }

  :global(.docs-rich-text ul) {
    list-style: disc;
  }

  :global(.docs-rich-text ol) {
    list-style: decimal;
  }

  :global(.docs-rich-text li) {
    margin-top: 8px;
    padding-left: 4px;
  }

  :global(.docs-rich-text pre) {
    margin-top: 16px;
    max-width: 680px;
    overflow-x: auto;
    border: 1px solid rgb(231 229 228);
    background: rgb(250 250 249);
    padding: 16px;
    font-size: 13px;
    line-height: 1.55;
    color: rgb(41 37 36);
  }

  :global(.docs-rich-text code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  }

</style>
