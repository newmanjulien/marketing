<script lang="ts" generics="IndustryId extends string">
  import type { Component } from 'svelte';

  type IndustryTabItem<Id extends string> = {
    id: Id;
    label: string;
    icon: Component;
  };

  let {
    industries,
    selectedIndustryId,
    onSelect
  }: {
    industries: readonly IndustryTabItem<IndustryId>[];
    selectedIndustryId: IndustryId;
    onSelect: (id: IndustryId) => void;
  } = $props();
</script>

<div class="flex flex-col items-stretch gap-[6px]">
  {#each industries as industry (industry.id)}
    <button
      type="button"
      class={[
        'flex items-center gap-[14px] rounded-[8px] px-[10px] py-[9px] text-[17px] leading-none tracking-normal transition-colors',
        selectedIndustryId === industry.id
          ? 'border border-stone-200/70 bg-white font-medium text-stone-750 shadow-[0_1px_0_rgba(48,47,45,0.03)]'
          : 'border border-transparent font-book text-stone-500 hover:text-stone-600'
      ]}
      aria-pressed={selectedIndustryId === industry.id}
      onclick={() => onSelect(industry.id)}
    >
      <industry.icon
        size={18}
        weight={selectedIndustryId === industry.id ? 'bold' : 'regular'}
      />
      <span>{industry.label}</span>
    </button>
  {/each}
</div>
