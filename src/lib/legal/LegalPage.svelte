<script lang="ts">
  import MainContentFrame from '$lib/page/MainContentFrame.svelte';
  import SeoHead from '$lib/page/SeoHead.svelte';
  import type { LegalPageContent } from './legalPages';

  let { page }: { page: LegalPageContent } = $props();
</script>

<SeoHead meta={page} />

<MainContentFrame topPadding="standard">
  <article class="mx-auto w-full max-w-[680px]">
    <header>
      <h1 class="font-heading text-[32px] font-medium leading-[1.05] tracking-normal text-stone-900">
        {page.title}
      </h1>
      <p class="mt-[16px] text-[16px] font-normal leading-[1.55] tracking-normal text-stone-500">
        Last updated: {page.updatedAt}
      </p>
    </header>

    <div class="mt-[32px] flex flex-col gap-[34px]">
      {#each page.sections as section, index (section.title)}
        <section>
          <h2 class="font-heading text-[18px] font-medium leading-[1.25] tracking-normal text-stone-800 md:text-[20px]">
            {index + 1}.&nbsp;&nbsp;{section.title}
          </h2>

          <div class="mt-[16px] flex max-w-[620px] flex-col gap-[16px]">
            {#each section.paragraphs as paragraph}
              <p class="text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700">
                {paragraph}
              </p>
            {/each}
          </div>
        </section>
      {/each}
    </div>
  </article>
</MainContentFrame>
