<script lang="ts">
  import {
    homeIndustries,
    type HomeIndustryId
  } from '$lib/home/industryContent';
  import { opportunityContentByIndustryId } from './opportunityContent';
  import { ArrowUp } from 'phosphor-svelte';
  import OpportunityIndustryTabs from './OpportunityIndustryTabs.svelte';
  import OpportunityScenarioDropdown from './OpportunityScenarioDropdown.svelte';

  const initialIndustryId: HomeIndustryId = 'insurance';
  let selectedIndustryId = $state<HomeIndustryId>(initialIndustryId);
  let selectedScenarioId = $state<string>(
    opportunityContentByIndustryId[initialIndustryId].scenarios[0].id
  );

  // Selecting an industry atomically resets the scenario to that industry's first option,
  // so selectedScenarioId always belongs to the current industry — no invalid state exists.
  function selectIndustry(id: HomeIndustryId) {
    selectedIndustryId = id;
    selectedScenarioId = opportunityContentByIndustryId[id].scenarios[0].id;
  }

  const content = $derived(opportunityContentByIndustryId[selectedIndustryId]);
  const scenario = $derived(content.scenarios.find((item) => item.id === selectedScenarioId)!);

  // Each blank-line-separated paragraph becomes its own chat bubble.
  const messages = $derived(
    scenario.email
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
  );
</script>

<div
  class="flex h-[455px] overflow-hidden rounded-[14px] border border-stone-200/70 bg-white shadow-[0_8px_28px_-12px_rgba(48,47,45,0.12)] sm:h-[480px]"
>
  <div
    class="flex w-[288px] shrink-0 flex-col border-r border-stone-200/70 bg-stone-50/70 px-[10px] py-[14px] sm:px-[14px]"
  >

    <OpportunityIndustryTabs
      industries={homeIndustries}
      {selectedIndustryId}
      onSelect={selectIndustry}
    />

    <div class="mt-auto pt-[14px]">
      <OpportunityScenarioDropdown
        scenarios={content.scenarios}
        {selectedScenarioId}
        onSelect={(id) => (selectedScenarioId = id)}
      />
    </div>
  </div>

  <div class="flex min-h-0 flex-1 flex-col bg-white">
    <div class="min-h-0 flex-1 overflow-auto px-[18px] py-[22px] sm:px-[24px]">
      <div class="flex flex-col items-start gap-[8px]">
        {#each messages as message (message)}
          <div
            class="max-w-[82%] whitespace-pre-wrap break-words rounded-[20px] rounded-bl-[6px] bg-stone-100 px-[15px] py-[9px] text-left font-body text-[15px] font-book leading-[1.4] tracking-normal text-stone-700 sm:text-[16px]"
          >{message}</div>
        {/each}
      </div>
    </div>

    <div class="flex items-center gap-[10px] border-t border-stone-200/70 px-[16px] py-[12px] sm:px-[20px]">
      <div
        class="flex h-[38px] flex-1 items-center rounded-full border border-stone-200/60 px-[16px] text-[15px] font-book leading-none tracking-normal text-stone-300 sm:text-[16px]"
      >
        Text message
      </div>
      <div
        class="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-stone-100"
        aria-hidden="true"
      >
        <ArrowUp size={17} weight="bold" class="text-stone-300" />
      </div>
    </div>
  </div>
</div>

<p
  class="mt-[18px] max-w-[720px] px-[2px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-500 sm:mt-[20px] sm:text-[17px]"
>
  {scenario.description}
</p>
