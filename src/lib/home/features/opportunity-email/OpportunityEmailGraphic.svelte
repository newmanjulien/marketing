<script lang="ts">
  import { onMount } from 'svelte';
  import {
    homeIndustries,
    type HomeIndustryId
  } from '$lib/home/industryContent';
  import OpportunityIndustryTabs from './OpportunityIndustryTabs.svelte';

  const AUTO_ADVANCE_START_DELAY_MS = 3_660;
  const AUTO_ADVANCE_INTERVAL_MS = 4_000;

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

Our review of Linamar’s tax return suggests the client is expanding into Europe. This may be an opportunity to help them assess cyber considerations related to data protection.

Tax Partner Scott Duarte would be the best person to connect with for additional context.

Topics to explore with Scott: Linamar’s new sources of revenue outside of Canada and the U.S., increased travel activity in Europe, and new professional services engagements related to European real estate.`
  } as const satisfies Record<HomeIndustryId, string>;

  const opportunityExplanationByIndustryId = {
    insurance:
      'Carrier data lets insurance brokerages give brokers the benchmarks they need to make sure clients are fully insured',
    law:
      'Minute-by-minute monitoring of your existing data sources lets your lawyers get hired for matters',
    'government-relations':
      'Minute-by-minute monitoring of your legislative data lets you turn policy change into an engagements',
    consulting:
      'The institutional knowledge from across your consulting firm and from your partners lets you win more pitches',
    accounting:
      'Securely analyzing client documents lets accounting firms spot opportunities to offer a broader range of services to existing clients'
  } as const satisfies Record<HomeIndustryId, string>;

  let selectedIndustryId = $state<HomeIndustryId>('insurance');
  let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null;
  let autoAdvanceStopped = false;

  const selectedEmail = $derived(opportunityEmailByIndustryId[selectedIndustryId]);
  const selectedExplanation = $derived(opportunityExplanationByIndustryId[selectedIndustryId]);

  const clearAutoAdvanceTimer = () => {
    if (autoAdvanceTimer === null) {
      return;
    }

    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  };

  const scheduleNextIndustry = (currentIndex: number) => {
    clearAutoAdvanceTimer();

    if (autoAdvanceStopped || currentIndex >= homeIndustries.length - 1) {
      return;
    }

    autoAdvanceTimer = setTimeout(() => {
      if (autoAdvanceStopped) {
        return;
      }

      const nextIndex = currentIndex + 1;
      selectedIndustryId = homeIndustries[nextIndex].id;
      scheduleNextIndustry(nextIndex);
    }, AUTO_ADVANCE_INTERVAL_MS);
  };

  const selectIndustry = (industryId: HomeIndustryId) => {
    autoAdvanceStopped = true;
    clearAutoAdvanceTimer();
    selectedIndustryId = industryId;
  };

  onMount(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    autoAdvanceTimer = setTimeout(
      () => scheduleNextIndustry(0),
      prefersReducedMotion ? 0 : AUTO_ADVANCE_START_DELAY_MS
    );

    return clearAutoAdvanceTimer;
  });
</script>

<div
  class="flex h-[390px] flex-col overflow-hidden rounded-[9px] border border-stone-200/70 bg-white shadow-[0_1px_0_rgba(48,47,45,0.03)] sm:h-[410px]"
>
  <div
    class="flex min-h-[56px] items-center overflow-x-auto border-b border-stone-200/70 bg-stone-50/50 px-[10px] py-[10px] sm:px-[14px]"
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
        class="whitespace-pre-wrap px-[18px] pb-[4px] pt-[22px] font-body text-[14px] font-book leading-[1.68] tracking-normal text-stone-600 sm:px-[26px] sm:pt-[26px] sm:text-[15px]"
      >{selectedEmail}</div>
      <img class="ml-[18px] mt-[26px] block w-[126px] sm:ml-[26px]" src="/logo_full.png" alt="Overbase" />
    </div>
  </div>
</div>

<p
  class="mt-[18px] max-w-[650px] px-[2px] text-[15px] font-book leading-[1.55] tracking-normal text-stone-400 sm:mt-[20px] sm:text-[16px]"
>
  {selectedExplanation}
</p>
