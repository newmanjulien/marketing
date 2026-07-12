<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import type { LegalPage } from './legalTypes';

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
      <h1 class="font-heading text-[32px] font-medium leading-[1.05] tracking-normal text-stone-900">
        {page.title}
      </h1>
      <p class="mt-[16px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-500">
        Last updated: {page.updatedAtLabel}
      </p>
    </header>

    <div class="legal-rich-text mt-[32px] font-book text-[16px] leading-[1.55] tracking-normal text-stone-700">
      <page.bodyComponent />
    </div>
  </ContentMeasure>
</PageFrame>

<style>
  .legal-rich-text :global(p) {
    margin-top: 16px;
    max-width: 680px;
  }

  .legal-rich-text :global(p:first-child) {
    margin-top: 0;
  }

  .legal-rich-text :global(h2),
  .legal-rich-text :global(h3) {
    max-width: 680px;
    font-family: var(--font-heading);
    font-weight: 500;
    color: rgb(41 37 36);
  }

  .legal-rich-text :global(h2) {
    margin-top: 34px;
    font-size: 20px;
    line-height: 1.25;
  }

  .legal-rich-text :global(h3) {
    margin-top: 24px;
    font-size: 18px;
    line-height: 1.3;
  }

  .legal-rich-text :global(h2:first-child),
  .legal-rich-text :global(h3:first-child) {
    margin-top: 0;
  }

  .legal-rich-text :global(strong) {
    font-weight: 500;
    color: rgb(41 37 36);
  }

  .legal-rich-text :global(a) {
    color: rgb(68 64 60);
    text-decoration: underline;
    text-decoration-color: rgb(168 162 158);
    text-underline-offset: 3px;
    transition: color 160ms ease, text-decoration-color 160ms ease;
  }

  .legal-rich-text :global(a:hover) {
    color: rgb(28 25 23);
    text-decoration-color: rgb(28 25 23);
  }

  .legal-rich-text :global(ul),
  .legal-rich-text :global(ol) {
    margin-top: 12px;
    max-width: 660px;
    padding-left: 22px;
  }

  .legal-rich-text :global(ul) {
    list-style: disc;
  }

  .legal-rich-text :global(ol) {
    list-style: decimal;
  }

  .legal-rich-text :global(li) {
    margin-top: 8px;
    padding-left: 4px;
  }
</style>
