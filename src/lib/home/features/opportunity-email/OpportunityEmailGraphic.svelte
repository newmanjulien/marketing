<script lang="ts">
  import {
    homeIndustries,
    type HomeIndustryId
  } from '$lib/home/industryContent';
  import { opportunityContentByIndustryId } from './opportunityContent';
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
</script>

<div
  class="flex h-[450px] flex-col overflow-hidden rounded-[16px] border border-stone-200/70 bg-white shadow-[0_1px_0_rgba(48,47,45,0.03)] sm:h-[470px]"
>
  <div
    class="flex min-h-[56px] items-center overflow-x-auto border-b border-stone-200/70 bg-stone-50 px-[10px] py-[10px] sm:px-[14px]"
  >
    <OpportunityIndustryTabs
      industries={homeIndustries}
      {selectedIndustryId}
      onSelect={selectIndustry}
    />
  </div>

  <div class="min-h-0 flex-1 overflow-auto bg-white">
    <div
      class="whitespace-pre-wrap px-[18px] pb-[4px] pt-[22px] font-body text-[14px] font-book leading-[1.68] tracking-normal text-stone-600 sm:px-[26px] sm:pt-[26px] sm:text-[15px]"
    >{scenario.email}</div>
    <img class="ml-[18px] mt-[26px] block w-[126px] sm:ml-[26px]" src="/logo_full.png" alt="Overbase" />
  </div>

  <div
    class="flex min-h-[56px] items-center border-t border-stone-200/70 bg-stone-50/50 px-[10px] py-[10px] sm:px-[14px]"
  >
    <OpportunityScenarioDropdown
      scenarios={content.scenarios}
      {selectedScenarioId}
      onSelect={(id) => (selectedScenarioId = id)}
    />
  </div>
</div>

<p
  class="mt-[18px] max-w-[720px] px-[2px] text-[15px] font-book leading-[1.55] tracking-normal text-stone-500 sm:mt-[20px] sm:text-[16px]"
>
  {scenario.description}
</p>
