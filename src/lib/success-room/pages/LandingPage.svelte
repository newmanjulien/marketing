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
  import PainPointsPanel from './PainPointsPanel.svelte';
  import TeamImagePreloader from '../team/TeamImagePreloader.svelte';
  import TeamPanel from '../team/TeamPanel.svelte';
  import { createSuccessRoomLandingDraft } from '../persistence/landingDraft.svelte';
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
      key: 'team',
      label: 'Team'
    },
    {
      key: 'documents',
      label: 'Documents'
    }
  ] as const satisfies readonly PillTab[];

  type SuccessRoomSection = (typeof baseSuccessRoomSections)[number];

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
  const successRoomSections = $derived(
    baseSuccessRoomSections.filter((section) => {
      if (section.key === 'pain-points') {
        return hasSelectedBenefits;
      }

      return true;
    })
  );
  const requestedSectionKey = $derived(page.url.searchParams.get('section'));
  const activeSectionKey = $derived(
    resolveActiveSectionKey(successRoomSections, requestedSectionKey)
  );

  const updateSectionUrl = async (sectionKey: SuccessRoomSection['key'], replace = false) => {
    const url = new URL(page.url);

    if (sectionKey === 'benefits') {
      url.searchParams.delete('section');
    } else {
      url.searchParams.set('section', sectionKey);
    }

    const href = `${url.pathname}${url.search}${url.hash}`;

    await goto(href, { replaceState: replace, keepFocus: true, noScroll: true });
  };

  $effect(() => {
    if (requestedSectionKey && requestedSectionKey !== activeSectionKey) {
      updateSectionUrl(activeSectionKey, true);
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
      idBase={`success-room-${room.slug}`}
      tabs={successRoomSections}
      ariaLabel={`${room.prospectName} success room sections`}
      activeTabKey={activeSectionKey}
      onActiveTabKeyChange={(sectionKey) => updateSectionUrl(sectionKey)}
      animatedTabKeys={['pain-points']}
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
          <PainPointsPanel
            selectedBenefitCount={draft.selectedBenefitCount}
            bind:painPoints={draft.painPoints}
          />
        {/if}
      {/snippet}
    </PillTabs>
  </ContentMeasure>
</PageFrame>
