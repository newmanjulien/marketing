<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import PillTabs from '$lib/ui/PillTabs.svelte';
  import type { PillTab } from '$lib/ui/PillTabs.svelte';
  import SuccessRoomDocumentsPanel from './SuccessRoomDocumentsPanel.svelte';
  import SuccessRoomHeader from './SuccessRoomHeader.svelte';
  import SuccessRoomQuestionsPanel from './SuccessRoomQuestionsPanel.svelte';
  import SuccessRoomTeamPanel from './SuccessRoomTeamPanel.svelte';
  import type { SuccessRoom } from './successRoomTypes';

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

  let { room }: { room: SuccessRoom } = $props();
</script>

<PageFrame topPadding="standard">
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
      panelClass="mt-[38px]"
    >
      {#snippet children(section)}
        {#if section.key === 'documents'}
          <SuccessRoomDocumentsPanel {room} />
        {:else if section.key === 'team'}
          <SuccessRoomTeamPanel team={room.team} />
        {:else if section.key === 'questions'}
          <SuccessRoomQuestionsPanel />
        {/if}
      {/snippet}
    </PillTabs>
  </ContentMeasure>
</PageFrame>
