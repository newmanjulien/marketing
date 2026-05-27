<script lang="ts">
  import MainContentFrame from '$lib/page/MainContentFrame.svelte';
  import SeoHead from '$lib/page/SeoHead.svelte';
  import type { TextPageContent } from './textPageTypes';
  import PageLinkList from './PageLinkList.svelte';
  import RichTextParagraph from './RichTextParagraph.svelte';

  let { content }: { content: TextPageContent } = $props();
</script>

<SeoHead meta={content} />

<MainContentFrame topPadding="standard">
  <section class="mx-auto w-full max-w-[680px]">
    <h1 class="font-heading text-[32px] font-medium leading-[1.05] tracking-normal text-stone-900">
      {content.heading}
    </h1>

    <div class="mt-[24px] flex max-w-[620px] flex-col gap-[22px]">
      {#each content.introParagraphs as paragraph, index (index)}
        <RichTextParagraph {paragraph} />
      {/each}
    </div>

    {#if content.links.length}
      <PageLinkList links={content.links} />
    {/if}
  </section>

  {#each content.sections as section (section.body)}
    <section class="mx-auto mt-[64px] w-full max-w-[680px] pb-[96px]">
      <p class="max-w-[620px] text-[15px] font-normal leading-[1.55] tracking-normal text-stone-700 md:text-[16px]">
        {section.body}
      </p>
    </section>
  {/each}
</MainContentFrame>
