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

<div class="flex min-w-0 flex-1 flex-wrap items-center gap-[6px]">
  {#each industries as industry (industry.id)}
    {@const IndustryIcon = industry.icon}
    <button
      type="button"
      class={[
        'inline-flex h-[33px] items-center gap-[7px] rounded-[7px] px-[10px] text-[13px] font-book leading-none tracking-normal transition-colors sm:text-[14px]',
        selectedIndustryId === industry.id
          ? 'border border-stone-300 bg-white text-stone-750 shadow-[0_1px_0_rgba(48,47,45,0.03)]'
          : 'border border-transparent text-stone-400 hover:text-stone-600'
      ]}
      aria-pressed={selectedIndustryId === industry.id}
      onclick={() => onselect(industry.id)}
    >
      <IndustryIcon size={15} weight="bold" />
      <span>{industry.label}</span>
    </button>
  {/each}
</div>
