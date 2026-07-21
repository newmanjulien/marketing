<script lang="ts">
  import type { HomeIndustry } from '$lib/marketing/home/homeIndustries';
  import type { IndustryId } from '$lib/marketing/industries/industryContent';

  let {
    industries,
    selectedIndustryId,
    onSelect
  }: {
    industries: readonly HomeIndustry[];
    selectedIndustryId: IndustryId;
    onSelect: (id: IndustryId) => void;
  } = $props();
</script>

<div class="flex flex-col items-stretch gap-[6px]">
  {#each industries as industry (industry.id)}
    {@const isSelected = selectedIndustryId === industry.id}
    <button
      type="button"
      class={[
        'flex items-center gap-[14px] rounded-[8px] px-[10px] py-[9px] text-[17px] leading-none tracking-normal transition-colors',
        isSelected
          ? 'border border-stone-200 bg-white font-medium text-stone-750 shadow-[0_1px_0_rgba(48,47,45,0.03)]'
          : 'border border-transparent font-book text-stone-500 hover:text-stone-600'
      ]}
      aria-pressed={isSelected}
      onclick={() => onSelect(industry.id)}
    >
      <industry.icon size={18} weight={isSelected ? 'bold' : 'regular'} />
      <span>{industry.label}</span>
    </button>
  {/each}
</div>
