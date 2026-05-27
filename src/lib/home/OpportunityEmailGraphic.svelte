<script lang="ts">
  import {
    BankIcon,
    DesktopTowerIcon,
    HandshakeIcon,
    MegaphoneIcon,
    ScalesIcon,
    UmbrellaIcon
  } from 'phosphor-svelte';
  import type { Component } from 'svelte';

  type OpportunityIndustryId = 'insurance' | 'law' | 'consulting' | 'it' | 'marketing' | 'finance';

  type OpportunityIndustry = {
    id: OpportunityIndustryId;
    label: string;
    icon: Component;
    email: string;
  };

  const renewalOpportunityEmail = `Hi Stephen,

The report for the upcoming Exterra renewal is attached.

We identified new policies worth $400,000 which you might propose to them at your renewal meeting next month.

Each proposed policy has a benchmark and those were calculated with data from Allianz and Chubb. The right people from both carriers are CCed.`;

  const lawFirmOpportunityEmail = `Hi Shayne,
Hi Laura,

An activist hedge fund bought a 5% stake in ADP.

You might want to see if this could be relevant to one of your partners, Shayne. And to one of your bankers, Laura.

Discussion in a Bloomberg forum:
https://blinks.bloomberg.com/rooms/IB_ROOM_ID_98725`;

  const financeOpportunityEmail = `Hi Shayne,
Hi Laura,

An activist hedge fund bought a 5% stake in ADP.

You might want to see if this could be relevant to one of your partners, Shayne. And to one of your bankers, Laura.

Discussion in a Bloomberg forum:
https://blinks.bloomberg.com/rooms/IB_ROOM_ID_98725`;

  const consultingOpportunityEmail = `Hi Amira,

You have an upcoming meeting with Juan Mendoza at PepsiCo.

As you know, Nicolas has been encouraging folks to "bring the firm" to this type of meeting.

Assuming that it's appropriate to bring someone, here's a colleagues you might invite: Ajay Agrawal from the tech team might be able to help identify cyber challenges

The Food and Beverage industry has seen a sharp rise in cyber issues in the past quarter. They've been purchasing more cyber services from Datadog and other partners.`;

  const itOpportunityEmail = `Hi Ethan,

A few different people from the Chevron account have mentioned 'legacy identity systems' in recent calls.

They also mentioned authentication delays and access reviews on calls with Microsoft and other partners.

This may or may not be a cue to discuss identity modernization or managed access governance. But you might want to check out the recordings.

https://gong.io/c/492047116583921046
https://gong.io/c/305819475021384759`;

  const marketingOpportunityEmail = `Hi Ram,

A few different people from the Walmart account have mentioned 'site migration' in recent calls.

They also mentioned this on calls with Salesforce and other partners.

This may or may not be a cue to sell SEO migration support. But you might want to check out the recordings.

https://gong.io/c/749201847502910472
https://gong.io/c/305819475021384759`;

  const opportunityIndustries: OpportunityIndustry[] = [
    {
      id: 'insurance',
      label: 'Insurance',
      icon: UmbrellaIcon,
      email: renewalOpportunityEmail
    },
    {
      id: 'law',
      label: 'Law',
      icon: ScalesIcon,
      email: lawFirmOpportunityEmail
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: BankIcon,
      email: financeOpportunityEmail
    },
    {
      id: 'consulting',
      label: 'Consulting',
      icon: HandshakeIcon,
      email: consultingOpportunityEmail
    },
    {
      id: 'it',
      label: 'IT',
      icon: DesktopTowerIcon,
      email: itOpportunityEmail
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: MegaphoneIcon,
      email: marketingOpportunityEmail
    }
  ];

  const firstIndustry = opportunityIndustries[0];

  let selectedIndustryId = firstIndustry.id;

  $: selectedIndustry =
    opportunityIndustries.find((industry) => industry.id === selectedIndustryId) ?? firstIndustry;

  function selectIndustry(industry: OpportunityIndustry) {
    selectedIndustryId = industry.id;
  }
</script>

<div
  class="flex h-[380px] flex-col overflow-hidden rounded-[8px] border border-stone-200/70 bg-white shadow-[0_1px_0_rgba(48,47,45,0.03)]"
>
  <div
    class="flex min-h-[52px] flex-col gap-[10px] border-b border-stone-200/70 bg-stone-50 px-[12px] py-[10px] sm:flex-row sm:items-start sm:justify-between sm:px-[13px]"
  >
    <div class="flex min-w-0 flex-1 flex-wrap items-center gap-[6px]">
      {#each opportunityIndustries as industry}
        <button
          type="button"
          class={`inline-flex h-[33px] items-center gap-[7px] rounded-[7px] px-[10px] text-[13px] font-normal leading-none tracking-normal transition-colors sm:text-[14px] ${
            selectedIndustryId === industry.id
              ? 'border border-stone-300 bg-white text-stone-800 shadow-[0_1px_0_rgba(48,47,45,0.03)]'
              : 'border border-transparent text-stone-400 hover:text-stone-600'
          }`}
          aria-pressed={selectedIndustryId === industry.id}
          on:click={() => selectIndustry(industry)}
        >
          <svelte:component this={industry.icon} size={15} weight="bold" />
          <span>{industry.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <div class="min-h-0 flex-1 overflow-auto bg-white">
    <div>
      <pre
        class="whitespace-pre-wrap px-[17px] pb-[4px] pt-[20px] text-[13px] font-normal leading-[1.65] tracking-normal text-stone-400 md:px-[19px] md:pt-[22px]"
      ><code>{selectedIndustry.email}</code></pre>
      <img class="ml-[17px] mt-[26px] block w-[126px] md:ml-[19px]" src="/logo_full.png" alt="Overbase" />
    </div>
  </div>
</div>
