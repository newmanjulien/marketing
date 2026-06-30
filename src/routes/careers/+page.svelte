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
      <p class="text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700">
        We only hire engineers. We only hire 99.9th percentile most smart people. And we mostly hire
        former startup founders or people who have no experience
      </p>
    </div>

    <nav class="mt-[42px]" aria-label="Page links">
      <a
        href="https://drive.google.com/file/d/1rCa5Q-wEGkV5wYfdNe4tH1Yn8pFnr3WE/view"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-between gap-8 border-b border-stone-200/70 py-[24px] text-[15px] font-normal leading-none tracking-normal text-stone-700 transition-colors hover:text-stone-900 sm:text-[16px]"
      >
        <span>Product Engineer 1 - USA</span>
        <ArrowUpRightIcon size={21} weight="regular" class="shrink-0 text-stone-900" aria-hidden="true" />
      </a>

      <a
        href="https://drive.google.com/file/d/11chLFScixDu3RtAG5jKFw6UphwMp4FMF/view"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-between gap-8 border-b border-stone-200/70 py-[24px] text-[15px] font-normal leading-none tracking-normal text-stone-700 transition-colors hover:text-stone-900 sm:text-[16px]"
      >
        <span>Product Engineer 1 - India</span>
        <ArrowUpRightIcon size={21} weight="regular" class="shrink-0 text-stone-900" aria-hidden="true" />
      </a>

            <a
        href="https://drive.google.com/file/d/1FLyWiHp0H9g8kjfgYLwpQ4_JS5CkkzoZ/view"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-between gap-8 border-b border-stone-200/70 py-[24px] text-[15px] font-normal leading-none tracking-normal text-stone-700 transition-colors hover:text-stone-900 sm:text-[16px]"
      >
        <span>Industry CTO</span>
        <ArrowUpRightIcon size={21} weight="regular" class="shrink-0 text-stone-900" aria-hidden="true" />
      </a>
    </nav>
  </ContentMeasure>

  <ContentMeasure as="section" width="narrow" class="mt-[64px] pb-[96px]">
    <div class="flex max-w-[620px] flex-col gap-[22px]">
      <p class="text-[15px] font-normal leading-[1.55] tracking-normal text-stone-700 sm:text-[16px]">
        Overbase is a forward deployed company. We relocate as a group to wherever customers need
        us most and work together from there
      </p>

      <p class="text-[15px] font-normal leading-[1.55] tracking-normal text-stone-700 sm:text-[16px]">
        Our comp is almost entirely linked to customer outcomes and we keep a 997 work schedule
      </p>
    </div>
  </ContentMeasure>
</PageFrame>
