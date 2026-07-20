<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import PillTabs from '$lib/ui/PillTabs.svelte';
  import type { PillTab } from '$lib/ui/PillTabs.svelte';
  import DocumentsPanel from '../documents/DocumentsPanel.svelte';
  import Header from '../shell/Header.svelte';
  import BenefitsPanel from '../plan/BenefitsPanel.svelte';
  import BenefitPromptsPanel from './BenefitPromptsPanel.svelte';
  import TeamImagePreloader from '../team/TeamImagePreloader.svelte';
  import TeamPanel from '../team/TeamPanel.svelte';
  import { createSuccessRoomLandingDraft } from '../persistence/landingDraft.svelte';
  import { customBenefitPainPointKey } from '../../../../shared/successRoomBenefits';
  import type { SuccessRoomLandingRoom, SuccessRoomLandingState } from '../domain/types';

  const baseSuccessRoomSections = [
    {
      key: 'benefits',
      label: 'Benefits'
    },
    {
      key: 'pain-points',
      label: 'Pain points'
    },
    {
      key: 'goals',
      label: 'Goals'
    },
    {
      key: 'team',
      label: 'Team'
    },
    {
      key: 'documents',
      label: 'Documents'
    }
  ] as const satisfies readonly PillTab[];

  type SuccessRoomSection = (typeof baseSuccessRoomSections)[number];

  // These sections only exist once benefits are selected, and animate in and out
  // with that selection.
  const benefitDependentSectionKeys: readonly SuccessRoomSection['key'][] = [
    'pain-points',
    'goals'
  ];

  const resolveActiveSectionKey = (
    sections: readonly SuccessRoomSection[],
    requestedSectionKey: string | null
  ) => sections.find((section) => section.key === requestedSectionKey)?.key ?? 'benefits';

  let {
    room,
    state: successRoomState
  }: { room: SuccessRoomLandingRoom; state: SuccessRoomLandingState } = $props();

  const draft = createSuccessRoomLandingDraft(
    () => room,
    () => successRoomState
  );
  const hasSelectedBenefits = $derived(draft.selectedBenefitCount > 0);
  const selectedBenefits = $derived([
    ...room.benefitCards
      .filter((card) => draft.selectedBenefitKeys.includes(card.key))
      .map((card) => ({ key: card.key, label: card.title })),
    ...(draft.customBenefitSelected
      ? [{ key: customBenefitPainPointKey, label: draft.customBenefitInput }]
      : [])
  ]);
  const successRoomSections = $derived(
    baseSuccessRoomSections.filter(
      (section) => hasSelectedBenefits || !benefitDependentSectionKeys.includes(section.key)
    )
  );
  const requestedSectionKey = $derived(page.url.searchParams.get('section'));
  const activeSectionKey = $derived(
    resolveActiveSectionKey(successRoomSections, requestedSectionKey)
  );

  const updateSectionUrl = async (sectionKey: SuccessRoomSection['key'], { replace = false } = {}) => {
    const url = new URL(page.url);

    if (sectionKey === 'benefits') {
      url.searchParams.delete('section');
    } else {
      url.searchParams.set('section', sectionKey);
    }

    await goto(url, { replaceState: replace, keepFocus: true, noScroll: true });
  };

  $effect(() => {
    if (requestedSectionKey && requestedSectionKey !== activeSectionKey) {
      updateSectionUrl(activeSectionKey, { replace: true });
    }
  });
</script>

<PageFrame>
  <ContentMeasure as="section" width="narrow">
    <Header
      eyebrow="Success room"
      title={room.prospectName}
      description={room.description}
    />

    <TeamImagePreloader team={draft.team} />

    <PillTabs
      tabs={successRoomSections}
      ariaLabel={`${room.prospectName} success room sections`}
      bind:activeTabKey={() => activeSectionKey, (sectionKey) => updateSectionUrl(sectionKey)}
      animatedTabKeys={benefitDependentSectionKeys}
      listClass="mt-[34px]"
      panelClass="mt-[38px]"
    >
      {#snippet children(section)}
        {#if section.key === 'documents'}
          <DocumentsPanel {room} />
        {:else if section.key === 'benefits'}
          <BenefitsPanel
            benefitCards={room.benefitCards}
            bind:selectedBenefitKeys={draft.selectedBenefitKeys}
            bind:customBenefitInput={draft.customBenefitInput}
            bind:customBenefitSelected={draft.customBenefitSelected}
          />
        {:else if section.key === 'team'}
          <TeamPanel team={draft.team} onAddTeamMember={draft.addTeamMember} />
        {:else if section.key === 'pain-points'}
          <BenefitPromptsPanel
            {selectedBenefits}
            description="For each benefit you selected, tell us the pain points and related metrics keeping you from it."
            promptFor={(label) => `What's keeping you from “${label}”?`}
            valuesByBenefitKey={draft.painPointsByBenefitKey}
            onValueChange={draft.setBenefitPainPoint}
          />
        {:else if section.key === 'goals'}
          <BenefitPromptsPanel
            {selectedBenefits}
            description="For each benefit you selected, tell us the goals and how you measure them."
            promptFor={(label) =>
              `What KPIs do you currently use to track “${label}”? Are there existing projects to achieve this?`}
            valuesByBenefitKey={draft.goalsByBenefitKey}
            onValueChange={draft.setBenefitGoal}
          />
        {/if}
      {/snippet}
    </PillTabs>
  </ContentMeasure>
</PageFrame>
