<script lang="ts">
  import OpportunityEmailPreview from './OpportunityEmailPreview.svelte';
  import OpportunityIndustryTabs from './OpportunityIndustryTabs.svelte';
  import { opportunityIndustries, type OpportunityIndustryId } from './opportunityEmailContent';

  let selectedIndustryId = $state<OpportunityIndustryId>('insurance');

  const selectedIndustry = $derived(
    opportunityIndustries.find((industry) => industry.id === selectedIndustryId) ?? opportunityIndustries[0]
  );

  const selectIndustry = (industryId: OpportunityIndustryId) => {
    selectedIndustryId = industryId;
  };
</script>

<div
  class="flex h-[380px] flex-col overflow-hidden rounded-[8px] border border-stone-200/70 bg-white shadow-[0_1px_0_rgba(48,47,45,0.03)]"
>
  <div
    class="flex min-h-[52px] flex-col gap-[10px] border-b border-stone-200/70 bg-stone-50 px-[12px] py-[10px] sm:flex-row sm:items-start sm:justify-between sm:px-[13px]"
  >
    <OpportunityIndustryTabs
      industries={opportunityIndustries}
      {selectedIndustryId}
      onselect={selectIndustry}
    />
  </div>

  <OpportunityEmailPreview email={selectedIndustry.email} />
</div>
