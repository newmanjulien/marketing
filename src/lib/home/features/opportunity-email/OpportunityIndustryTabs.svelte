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
    onselect
  }: {
    industries: readonly IndustryTabItem<IndustryId>[];
    selectedIndustryId: IndustryId;
    onselect: (industryId: IndustryId) => void;
  } = $props();
</script>

<div class="flex min-w-max flex-1 flex-nowrap items-center gap-[9px] sm:justify-center sm:gap-[11px]">
  {#each industries as industry (industry.id)}
    <button
      type="button"
      class={[
        'inline-flex h-[35px] items-center gap-[8px] rounded-[7px] px-[11px] text-[14px] font-book leading-none tracking-normal transition-colors sm:text-[15px]',
        selectedIndustryId === industry.id
          ? 'border border-stone-200/70 bg-white text-stone-750 shadow-[0_1px_0_rgba(48,47,45,0.03)]'
          : 'border border-transparent text-stone-400 hover:text-stone-600'
      ]}
      aria-pressed={selectedIndustryId === industry.id}
      onclick={() => onselect(industry.id)}
      onfocus={() => onselect(industry.id)}
      onmouseenter={() => onselect(industry.id)}
    >
      <industry.icon size={16} weight="bold" />
      <span>{industry.label}</span>
    </button>
  {/each}
</div>
