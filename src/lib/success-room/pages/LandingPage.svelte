<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import PillTabs from '$lib/ui/PillTabs.svelte';
  import type { PillTab } from '$lib/ui/PillTabs.svelte';
  import ResourceCard from '../documents/ResourceCard.svelte';
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

  let {
    room,
    state: successRoomState
  }: { room: SuccessRoomLandingRoom; state: SuccessRoomLandingState } = $props();

  const draft = createSuccessRoomLandingDraft(
    () => room,
    () => successRoomState
  );
  const hasSelectedBenefits = $derived(draft.selectedBenefitKeys.length > 0);
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
    requestedSectionKey && successRoomSections.some((section) => section.key === requestedSectionKey)
      ? requestedSectionKey
      : 'benefits'
  );

  const updateSectionUrl = async (sectionKey: string, replace = false) => {
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
      defaultActiveTabKey="benefits"
      activeTabKey={activeSectionKey}
      onActiveTabKeyChange={(sectionKey) => updateSectionUrl(sectionKey)}
      animatedTabKeys={['pain-points']}
      listClass="mt-[34px]"
      panelClass="mt-[38px]"
    >
      {#snippet children(section)}
        {#if section.key === 'documents'}
          <nav
            class="grid grid-cols-1 gap-[14px] sm:grid-cols-2 sm:gap-[18px]"
            aria-label={`${room.prospectName} success room resources`}
          >
            {#each room.resources as resource (resource.slug)}
              <ResourceCard {room} {resource} />
            {/each}
          </nav>
        {:else if section.key === 'benefits'}
          <BenefitsPanel
            benefitCards={room.benefitCards}
            bind:selectedBenefitKeys={draft.selectedBenefitKeys}
          />
        {:else if section.key === 'team'}
          <TeamPanel team={draft.team} onAddTeamMember={draft.addTeamMember} />
        {:else if section.key === 'pain-points'}
          <PainPointsPanel
            selectedBenefitCount={draft.selectedBenefitKeys.length}
            bind:painPoints={draft.painPoints}
          />
        {/if}
      {/snippet}
    </PillTabs>
  </ContentMeasure>
</PageFrame>
