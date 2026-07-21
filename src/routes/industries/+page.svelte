<script lang="ts">
  import { industries } from '$lib/marketing/industries/industries';
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import PageFrame from '$lib/ui/PageFrame.svelte';
  import { ArrowUpRightIcon } from 'phosphor-svelte';
</script>

<svelte:head>
  <title>Overbase › Industries</title>
</svelte:head>

<PageFrame>
  <ContentMeasure as="section" width="narrow">
    <h1 class="font-heading text-[42px] font-medium leading-[1.05] text-stone-750">
      Our industries
    </h1>

    <p
      class="mt-[24px] text-[16px] font-book leading-[1.55] text-stone-700 sm:text-[17px]"
    >
      Overbase works with professional services firms. Our tech is built for how your firm works
    </p>

    <nav class="mt-[56px]" aria-label="Industries">
      {#each industries as industry (industry.id)}
        <a
          href={industry.href}
          class="group flex items-start gap-8 border-b border-stone-200 py-[24px]"
        >
          <span class="min-w-0 flex-1">
            <span
              class="block font-heading text-[22px] font-light leading-[1.08] text-stone-750 transition-colors group-hover:text-stone-900"
            >
              {industry.label}
            </span>
            <span
              class="mt-[14px] block text-[15px] font-book leading-[1.55] text-stone-700 sm:text-[16px]"
            >
              {industry.summary}
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
