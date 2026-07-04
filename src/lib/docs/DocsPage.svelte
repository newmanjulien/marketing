<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import type { DocsPage, DocsSection } from './docsTypes';

  let { page }: { page: DocsPage } = $props();
  let sections = $derived(page.sections);
  let selectedSection = $state<DocsSection>();
  let activeSection = $derived.by(() => {
    if (selectedSection && sections.some(({ key }) => key === selectedSection)) {
      return selectedSection;
    }

    return sections[0]?.key ?? 'overview';
  });

  const getSectionId = (section: DocsSection) => `docs-${page.category}-${page.slug}-${section}-tab`;
  const getPanelId = (section: DocsSection) => `docs-${page.category}-${page.slug}-${section}-panel`;
  const focusSection = (section: DocsSection) => {
    document.getElementById(getSectionId(section))?.focus();
  };
  const selectSectionAt = (index: number) => {
    const section = sections[index];

    if (section) {
      selectedSection = section.key;
      focusSection(section.key);
    }
  };
  const handleTabKeydown = (event: KeyboardEvent) => {
    const currentIndex = sections.findIndex(({ key }) => key === activeSection);

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        selectSectionAt(currentIndex <= 0 ? sections.length - 1 : currentIndex - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        selectSectionAt(currentIndex === sections.length - 1 ? 0 : currentIndex + 1);
        break;
      case 'Home':
        event.preventDefault();
        selectSectionAt(0);
        break;
      case 'End':
        event.preventDefault();
        selectSectionAt(sections.length - 1);
        break;
    }
  };
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

      {#if page.description || page.updatedAtLabel}
        <div class="mt-[16px] space-y-[8px]">
          {#if page.description}
            <p class="max-w-[620px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-600">
              {page.description}
            </p>
          {/if}

          {#if page.updatedAtLabel}
            <p class="text-[14px] font-book leading-[1.45] tracking-normal text-stone-500">
              Last updated: {page.updatedAtLabel}
            </p>
          {/if}
        </div>
      {/if}
    </header>

    <div class="mt-[34px] flex flex-wrap items-center gap-[13px]">
      <span class="docs-tab-prefix">Read</span>

      <div class="flex flex-wrap items-center gap-[7px]" role="tablist" aria-label="Documentation sections">
        {#each sections as section}
          <button
            id={getSectionId(section.key)}
            type="button"
            role="tab"
            aria-selected={activeSection === section.key}
            aria-controls={getPanelId(section.key)}
            tabindex={activeSection === section.key ? 0 : -1}
            class="docs-tab"
            class:docs-tab-active={activeSection === section.key}
            onclick={() => {
              selectedSection = section.key;
            }}
            onkeydown={handleTabKeydown}
          >
            {section.label}
          </button>
        {/each}
      </div>
    </div>

    {#each sections as section}
      {@const SectionComponent = section.component}
      <div
        id={getPanelId(section.key)}
        class="docs-rich-text mt-[28px] min-h-[160px] font-book text-[16px] leading-[1.55] tracking-normal text-stone-700"
        role="tabpanel"
        aria-labelledby={getSectionId(section.key)}
        hidden={activeSection !== section.key}
      >
        <SectionComponent />
      </div>
    {/each}
  </ContentMeasure>
</PageFrame>

<style>
  .docs-tab-prefix {
    font-size: 14px;
    font-weight: 400;
    line-height: 1;
    color: rgb(120 113 108);
  }

  .docs-tab {
    min-height: 34px;
    border: 1px solid rgb(231 229 228 / 0.7);
    border-radius: 999px;
    background: rgb(245 245 244);
    padding: 0 18px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    color: rgb(87 83 78);
    transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease;
  }

  .docs-tab:hover {
    background: rgb(250 250 249);
    border-color: rgb(231 229 228 / 0.7);
    color: rgb(41 37 36);
  }

  .docs-tab-active {
    border-color: rgb(231 229 228 / 0.7);
    background: white;
    color: rgb(41 37 36);
  }

  .docs-rich-text :global(p) {
    margin-top: 16px;
    max-width: 680px;
  }

  .docs-rich-text :global(p:first-child) {
    margin-top: 0;
  }

  .docs-rich-text :global(h2),
  .docs-rich-text :global(h3) {
    max-width: 680px;
    font-family: var(--font-heading);
    font-weight: 500;
    color: rgb(41 37 36);
  }

  .docs-rich-text :global(h2) {
    margin-top: 60px;
    font-size: 22px;
    line-height: 1.2;
  }

  .docs-rich-text :global(h3) {
    margin-top: 38px;
    font-size: 18px;
    line-height: 1.3;
  }

  .docs-rich-text :global(h2:first-child),
  .docs-rich-text :global(h3:first-child) {
    margin-top: 0;
  }

  .docs-rich-text :global(strong) {
    font-weight: 500;
    color: rgb(41 37 36);
  }

  .docs-rich-text :global(a) {
    color: rgb(68 64 60);
    text-decoration: underline;
    text-decoration-color: rgb(168 162 158);
    text-underline-offset: 3px;
    transition: color 160ms ease, text-decoration-color 160ms ease;
  }

  .docs-rich-text :global(a:hover) {
    color: rgb(28 25 23);
    text-decoration-color: rgb(28 25 23);
  }

  .docs-rich-text :global(blockquote) {
    margin-top: 16px;
    max-width: 660px;
    border-left: 2px solid rgb(214 211 209);
    padding-left: 18px;
    color: rgb(87 83 78);
  }

  .docs-rich-text :global(blockquote p) {
    max-width: none;
  }

  .docs-rich-text :global(ul),
  .docs-rich-text :global(ol) {
    margin-top: 12px;
    max-width: 660px;
    padding-left: 22px;
  }

  .docs-rich-text :global(ul) {
    list-style: disc;
  }

  .docs-rich-text :global(ol) {
    list-style: decimal;
  }

  .docs-rich-text :global(li) {
    margin-top: 8px;
    padding-left: 4px;
  }

  .docs-rich-text :global(pre) {
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

  .docs-rich-text :global(code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  }

</style>
