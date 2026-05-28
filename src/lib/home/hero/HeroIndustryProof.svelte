<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import { homeIndustries } from '../industryContent';

  let selectedIndex = $state<number | null>(null);
  const selectedIndustry = $derived(
    selectedIndex === null ? null : (homeIndustries[selectedIndex] ?? null)
  );
</script>

<ContentMeasure class="!max-w-[660px] md:text-center">
  <div
    class="-mx-[18px] flex gap-[22px] overflow-x-auto px-[18px] pb-[4px] md:mx-0 md:flex-wrap md:justify-center md:gap-x-[26px] md:gap-y-[10px] md:overflow-visible md:px-0"
    aria-label="Industries"
    role="group"
  >
    {#each homeIndustries as industry, index (industry.id)}
      <button
        type="button"
        class={[
          'shrink-0 text-[14px] font-medium leading-none tracking-normal transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-950 md:text-[15px]',
          selectedIndex === index ? 'text-stone-800' : 'text-stone-300 hover:text-stone-500'
        ]}
        aria-describedby={selectedIndex === index ? 'hero-industry-proof-detail' : undefined}
        onfocus={() => {
          selectedIndex = index;
        }}
        onclick={() => {
          selectedIndex = index;
        }}
        onmouseenter={() => {
          selectedIndex = index;
        }}
      >
        {industry.label}
      </button>
    {/each}
  </div>

  <div class="mt-[28px] min-h-[33px]">
    {#if selectedIndustry}
      {@const IndustryIcon = selectedIndustry.icon}
      <div id="hero-industry-proof-detail" class="flex items-center gap-[10px] md:justify-center">
        <a
          href={selectedIndustry.href}
          class="inline-flex h-[33px] shrink-0 items-center gap-[7px] rounded-[7px] border border-stone-300 bg-white px-[10px] text-[13px] font-normal leading-none tracking-normal text-stone-800 shadow-[0_1px_0_rgba(48,47,45,0.03)] transition-colors hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-950 sm:text-[14px]"
        >
          <IndustryIcon size={15} weight="bold" aria-hidden="true" />
          <span>{selectedIndustry.label}</span>
        </a>

        <div class="flex min-w-0 flex-wrap items-center gap-x-[10px] gap-y-[6px] text-[14px] leading-none tracking-normal">
          <span class="leading-[1.35] text-stone-400">{selectedIndustry.heroProofLabel}</span>
        </div>
      </div>
    {/if}
  </div>
</ContentMeasure>
