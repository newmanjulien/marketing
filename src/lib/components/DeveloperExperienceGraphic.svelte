<script lang="ts">
  import {
    BankIcon,
    BuildingsIcon,
    HandshakeIcon,
    ScalesIcon,
    UmbrellaIcon
  } from 'phosphor-svelte';
  import DeveloperActionDropdown from './DeveloperActionDropdown.svelte';
  import type { Component } from 'svelte';

  type DeveloperPersonaId = 'insurance' | 'law' | 'consulting' | 'real-estate' | 'finance';

  type DeveloperExperienceAction = {
    id: string;
    label: string;
    code: string;
  };

  type DeveloperExperiencePersona = {
    id: DeveloperPersonaId;
    label: string;
    icon: Component;
    actions: DeveloperExperienceAction[];
  };

  const renewalOpportunityEmail = `Hi Stephen,

The report for the upcoming Exterra renewal is attached.

We identified new policies worth $400,000 which you might propose to them at your renewal meeting next month.

Each proposed policy has a benchmark and those were calculated with data from Allianz and Chubb. The right people from both carriers are CCed.`;

  const developerExperiencePersonas: DeveloperExperiencePersona[] = [
    {
      id: 'insurance',
      label: 'Insurance',
      icon: UmbrellaIcon,
      actions: [
        {
          id: 'create-contact',
          label: 'Create contact',
          code: renewalOpportunityEmail
        },
        {
          id: 'update-contact',
          label: 'Update contact',
          code: renewalOpportunityEmail
        },
        {
          id: 'track-event',
          label: 'Track event',
          code: renewalOpportunityEmail
        },
        {
          id: 'add-contact-property',
          label: 'Add contact property',
          code: renewalOpportunityEmail
        }
      ]
    },
    {
      id: 'law',
      label: 'Law',
      icon: ScalesIcon,
      actions: [
        {
          id: 'create-contact',
          label: 'Create contact',
          code: renewalOpportunityEmail
        },
        {
          id: 'sync-contact-properties',
          label: 'Sync contact properties',
          code: renewalOpportunityEmail
        },
        {
          id: 'analyze-event-stream',
          label: 'Analyze event stream',
          code: renewalOpportunityEmail
        },
        {
          id: 'generate-lifecycle-segment',
          label: 'Generate lifecycle segment',
          code: renewalOpportunityEmail
        }
      ]
    },
    {
      id: 'consulting',
      label: 'Consulting',
      icon: HandshakeIcon,
      actions: [
        {
          id: 'create-opportunity',
          label: 'Create opportunity',
          code: renewalOpportunityEmail
        },
        {
          id: 'score-engagement-fit',
          label: 'Score engagement fit',
          code: renewalOpportunityEmail
        },
        {
          id: 'route-consulting-intro',
          label: 'Route intro',
          code: renewalOpportunityEmail
        }
      ]
    },
    {
      id: 'real-estate',
      label: 'Real Estate',
      icon: BuildingsIcon,
      actions: [
        {
          id: 'match-property-owners',
          label: 'Match property owners',
          code: renewalOpportunityEmail
        },
        {
          id: 'sync-property-profile',
          label: 'Sync property profile',
          code: renewalOpportunityEmail
        },
        {
          id: 'create-owner-intro',
          label: 'Create owner intro',
          code: renewalOpportunityEmail
        }
      ]
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: BankIcon,
      actions: [
        {
          id: 'identify-capital-need',
          label: 'Identify capital need',
          code: renewalOpportunityEmail
        },
        {
          id: 'sync-underwriting-profile',
          label: 'Sync underwriting profile',
          code: renewalOpportunityEmail
        },
        {
          id: 'route-finance-opportunity',
          label: 'Route opportunity',
          code: renewalOpportunityEmail
        }
      ]
    }
  ];

  const firstPersona = developerExperiencePersonas[0];

  let selectedPersonaId = firstPersona.id;
  let selectedActionId = firstPersona.actions[0].id;

  $: selectedPersona =
    developerExperiencePersonas.find((persona) => persona.id === selectedPersonaId) ?? firstPersona;

  $: selectedAction =
    selectedPersona.actions.find((action) => action.id === selectedActionId) ?? selectedPersona.actions[0];

  function selectPersona(persona: DeveloperExperiencePersona) {
    selectedPersonaId = persona.id;
    selectedActionId = persona.actions[0].id;
  }

  function selectAction(actionId: string) {
    selectedActionId = actionId;
  }
</script>

<div
  class="flex h-[430px] flex-col overflow-hidden rounded-[8px] border border-stone-200/70 bg-white shadow-[0_1px_0_rgba(48,47,45,0.03)]"
>
  <div
    class="flex min-h-[52px] flex-col gap-[10px] border-b border-stone-200/70 bg-stone-50 px-[12px] py-[10px] sm:flex-row sm:items-start sm:justify-between sm:px-[13px]"
  >
    <div class="flex min-w-0 flex-1 flex-wrap items-center gap-[6px]">
      {#each developerExperiencePersonas as persona}
        <button
          type="button"
          class={`inline-flex h-[33px] items-center gap-[7px] rounded-[7px] px-[10px] text-[13px] font-normal leading-none tracking-normal transition-colors sm:text-[14px] ${
            selectedPersonaId === persona.id
              ? 'border border-stone-300 bg-white text-stone-800 shadow-[0_1px_0_rgba(48,47,45,0.03)]'
              : 'border border-transparent text-stone-400 hover:text-stone-600'
          }`}
          aria-pressed={selectedPersonaId === persona.id}
          on:click={() => selectPersona(persona)}
        >
          <svelte:component this={persona.icon} size={15} weight="bold" />
          <span>{persona.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <div class="min-h-0 flex-1 overflow-auto bg-white">
    <div>
      <pre
        class="whitespace-pre-wrap px-[17px] pb-[4px] pt-[20px] text-[13px] font-normal leading-[1.65] tracking-normal text-stone-400 md:px-[19px] md:pt-[22px]"
      ><code>{selectedAction.code}</code></pre>
      <img class="ml-[17px] mt-[26px] block w-[126px] md:ml-[19px]" src="/logo_full.png" alt="Overbase" />
    </div>
  </div>

  <div class="flex min-h-[54px] shrink-0 items-center justify-end border-t border-stone-200/70 bg-white px-[14px] py-[9px]">
    <DeveloperActionDropdown
      actions={selectedPersona.actions}
      {selectedActionId}
      onSelect={selectAction}
    />
  </div>
</div>
