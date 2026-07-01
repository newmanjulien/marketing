<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import { ArrowUpRightIcon } from 'phosphor-svelte';
</script>

<PageFrame topPadding="standard">
  <ContentMeasure as="section" width="narrow">
    <h1 class="font-heading text-[32px] font-medium leading-[1.05] tracking-normal text-stone-750">
      Careers at Overbase
    </h1>

    <div class="mt-[24px] flex max-w-[620px] flex-col gap-[22px]">
      <p class="text-[15px] font-book leading-[1.55] tracking-normal text-stone-700">
        Technological progress is currently constrained by compute and algorithms. But soon, the constraint will be data
      </p>

      <p class="text-[15px] font-book leading-[1.55] tracking-normal text-stone-700">
        The datasets capable of powering the next breakthroughs already exist, but they're scattered
        across isolated repositories, organizations, and platforms. Overbase is unlocking the future by breaking down those data silos
      </p>
    </div>

    <nav class="mt-[42px]" aria-label="Page links">
      <a
        href="https://drive.google.com/drive/folders/1MwlUOHli05iSWP_i9qzu1oZs-xigW5Ds?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-between gap-8 border-b border-stone-200/70 py-[24px] text-[15px] font-book leading-none tracking-normal text-stone-700 transition-colors hover:text-stone-900 sm:text-[16px]"
      >
        <span>Product Engineer 1 - SF</span>
        <ArrowUpRightIcon size={21} weight="regular" class="shrink-0 text-stone-900" aria-hidden="true" />
      </a>

      <a
        href="https://drive.google.com/drive/folders/15vTdDB0GrCfq67ZsA6IRZrvtqwFhK0az?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-between gap-8 border-b border-stone-200/70 py-[24px] text-[15px] font-book leading-none tracking-normal text-stone-700 transition-colors hover:text-stone-900 sm:text-[16px]"
      >
        <span>Product Engineer 1 - Delhi</span>
        <ArrowUpRightIcon size={21} weight="regular" class="shrink-0 text-stone-900" aria-hidden="true" />
      </a>

      <a
        href="https://drive.google.com/drive/folders/1N8zX_AadlViFpOClDzFQbSHoVJqzFusV?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-between gap-8 border-b border-stone-200/70 py-[24px] text-[15px] font-book leading-none tracking-normal text-stone-700 transition-colors hover:text-stone-900 sm:text-[16px]"
      >
        <span>Industry CTO</span>
        <ArrowUpRightIcon size={21} weight="regular" class="shrink-0 text-stone-900" aria-hidden="true" />
      </a>
    </nav>
  </ContentMeasure>

  <ContentMeasure as="section" width="narrow" class="mt-[64px] pb-[96px]">
    <div class="flex max-w-[620px] flex-col gap-[22px]">
      <p class="text-[15px] font-book leading-[1.55] tracking-normal text-stone-700">
        Overbase is a forward deployed company which means that we relocate as a group to where customers need
        us most and work together from there
      </p>

      <p class="text-[15px] font-book leading-[1.55] tracking-normal text-stone-700 sm:text-[16px]">
        And our comp is almost entirely linked to customer outcomes and we keep a 997 work schedule
      </p>
    </div>
  </ContentMeasure>
</PageFrame>
