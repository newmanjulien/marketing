<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import PillTabs from '$lib/ui/PillTabs.svelte';
  import type { PillTab } from '$lib/ui/PillTabs.svelte';
  import SuccessRoomDocumentsPanel from './SuccessRoomDocumentsPanel.svelte';
  import SuccessRoomHeader from './SuccessRoomHeader.svelte';
  import SuccessRoomQuestionsPanel from './SuccessRoomQuestionsPanel.svelte';
  import { createSuccessRoomLandingDraft } from './successRoomDrafts.svelte';
  import SuccessRoomTeamPanel from './SuccessRoomTeamPanel.svelte';
  import type { SuccessRoom, SuccessRoomState } from './successRoomTypes';

  const successRoomSections = [
    {
      key: 'documents',
      label: 'Documents'
    },
    {
      key: 'team',
      label: 'Team'
    },
    {
      key: 'questions',
      label: 'Questions'
    }
  ] as const satisfies readonly PillTab[];

  let { room, state: roomState }: { room: SuccessRoom; state: SuccessRoomState } = $props();

  const draft = createSuccessRoomLandingDraft(
    () => room,
    () => roomState
  );
</script>

<PageFrame>
  <ContentMeasure as="section" width="narrow">
    <SuccessRoomHeader
      eyebrow="Success room"
      title={room.prospectName}
      description={room.description}
    />

    <PillTabs
      idBase={`success-room-${room.slug}`}
      tabs={successRoomSections}
      ariaLabel={`${room.prospectName} success room sections`}
      defaultActiveTabKey="documents"
      listClass="mt-[34px]"
      panelClass="mt-[38px]"
    >
      {#snippet children(section)}
        {#if section.key === 'documents'}
          <SuccessRoomDocumentsPanel {room} />
        {:else if section.key === 'team'}
          <SuccessRoomTeamPanel roomSlug={room.slug} team={room.team} />
        {:else if section.key === 'questions'}
          <SuccessRoomQuestionsPanel
            questions={draft.questions}
            onQuestionsChange={draft.setQuestions}
          />
        {/if}
      {/snippet}
    </PillTabs>
  </ContentMeasure>
</PageFrame>
