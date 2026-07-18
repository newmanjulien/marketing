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

<div class="flex min-w-max flex-1 flex-nowrap items-center gap-[11px] sm:justify-center sm:gap-[13px]">
  {#each industries as industry (industry.id)}
    <button
      type="button"
      class={[
        'inline-flex h-[35px] items-center gap-[8px] rounded-[9px] px-[11px] text-[15px] font-medium leading-none tracking-normal transition-colors sm:text-[16px]',
        selectedIndustryId === industry.id
          ? 'border border-stone-200/70 bg-white text-stone-750 shadow-[0_1px_0_rgba(48,47,45,0.03)]'
          : 'border border-transparent text-stone-400 hover:text-stone-600'
      ]}
      aria-pressed={selectedIndustryId === industry.id}
      onclick={() => onSelect(industry.id)}
      onfocus={() => onSelect(industry.id)}
      onmouseenter={() => onSelect(industry.id)}
    >
      <industry.icon size={18} weight="bold" />
      <span>{industry.label}</span>
    </button>
  {/each}
</div>
