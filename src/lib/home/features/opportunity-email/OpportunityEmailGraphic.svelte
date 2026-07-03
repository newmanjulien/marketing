<script lang="ts">
  import {
    homeIndustries,
    type HomeIndustryId
  } from '$lib/home/industryContent';
  import OpportunityIndustryTabs from './OpportunityIndustryTabs.svelte';

  const opportunityEmailByIndustryId = {
    insurance: `Hi Stephen,

A whitespace analysis for the Exterra renewal is attached.

We identified new policies worth $400,000 which you might propose at your renewal meeting next month.

Each proposed policy has a benchmark. Those were calculated with data from Allianz and Chubb. The right people from both carriers are CCed.`,

    law: `Hi Shayne,
Hi Laura,

An activist hedge fund bought a 5% stake in ADP.

You might want to see if this could be relevant to one of your attorneys, Shayne. And to one of your bankers, Laura.

Discussion in a Bloomberg forum:
https://blinks.bloomberg.com/rooms/IB_ROOM_ID_98725`,

    'government-relations': `Hi Ray,

Check out this new proposed tax credit program in Arizona:
https://azleg.gov/active-bills/5858hggj

The bill will be voted on in two weeks and there might be an opportunity to help Plug Power submit comments during rulemaking. Plug Power has 2 factories in Arizona.

Jackson Reinstein knows Plug Power's VP Strategy. And Sagar Agrawal knows their COO.`,

    consulting: `Hey Alex,

You're working the pitch for JPMC and Jack London (CCed) in our NYC office pitched them JPMC.

I attached the PDF of the final proposal Jack submitted to them. As well as other docs which might give useful context for your pitch.

There's also a proposal our partner Thoughtworks submitted to them last month.`,

    accounting: `Hi Shlok,

You recently completed the tax return for TCC. And you can upload it for analysis here: 
https://nrt.overbase.app/encrypted-upload

We will generate an opportunity report showing where TCC may need additional tax planning or advisory work. We will also point out where it may make sense to involve trusted professionals from your network.
`
  } as const satisfies Record<HomeIndustryId, string>;

  let selectedIndustryId = $state<HomeIndustryId>('insurance');

  const selectedEmail = $derived(opportunityEmailByIndustryId[selectedIndustryId]);

  const selectIndustry = (industryId: HomeIndustryId) => {
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
      industries={homeIndustries}
      {selectedIndustryId}
      onselect={selectIndustry}
    />
  </div>

  <div class="min-h-0 flex-1 overflow-auto bg-white">
    <div>
      <div
        class="whitespace-pre-wrap px-[17px] pb-[4px] pt-[20px] font-body text-[14px] font-book leading-[1.65] tracking-normal text-stone-600 sm:px-[19px] sm:pt-[22px]"
      >{selectedEmail}</div>
      <img class="ml-[17px] mt-[26px] block w-[126px] sm:ml-[19px]" src="/logo_full.png" alt="Overbase" />
    </div>
  </div>
</div>
