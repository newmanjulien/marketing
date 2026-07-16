<script lang="ts">
  import { industryNavigationItems, type IndustryId } from '$lib/industries/industryNavigation';
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import { ArrowUpRightIcon } from 'phosphor-svelte';

  const industrySummaries = {
    insurance: 'See how insurance brokers grow revenue by sharing sales data with carriers, law and accounting firms or with industry associations',
    law: 'See how law firms grow revenue by sharing data with other lawers, headhunters and with data providers',
    'government-relations':
      'See how GR firms grow revenue by sharing data with law firms, headhunters and with data providers',
    consulting: 'See how consulting firms grow revenue by sharing sales data with tech vendors, private equity firms or with other practice areas within their own firm',
    accounting: 'See how accounting firms grow revenue by sharing sales data with advisory firms they form strategic alliances with, law firms and wealth managers'
  } satisfies Record<IndustryId, string>;
</script>

<PageFrame>
  <ContentMeasure as="section" width="narrow">
    <h1 class="font-heading text-[42px] font-medium leading-[1.05] tracking-normal text-stone-750">
      Our 5 industries
    </h1>

    <p
      class="mt-[24px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-700 sm:text-[17px]"
    >
      Overbase works with 5 types of professional services firms. Our tech is built for how your firm works
    </p>

    <nav class="mt-[56px]" aria-label="Industries">
      {#each industryNavigationItems as industry (industry.id)}
        <a
          href={industry.href}
          class="group flex items-start justify-between gap-8 border-b border-stone-200/70 py-[24px] text-stone-700 transition-colors hover:text-stone-900"
        >
          <span class="min-w-0 flex-1">
            <span
              class="block font-heading text-[22px] font-light leading-[1.08] tracking-normal text-stone-750 transition-colors group-hover:text-stone-900"
            >
              {industry.label}
            </span>
            <span
              class="mt-[14px] block text-[15px] font-book leading-[1.55] tracking-normal text-stone-700 sm:text-[16px]"
            >
              {industrySummaries[industry.id]}
            </span>
          </span>

          <ArrowUpRightIcon
            size={21}
            weight="regular"
            class="mt-[2px] shrink-0 text-stone-500 transition-colors group-hover:text-stone-900"
            aria-hidden="true"
          />
        </a>
      {/each}
    </nav>
  </ContentMeasure>
</PageFrame>
