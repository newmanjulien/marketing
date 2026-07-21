<script lang="ts">
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import PageFrame from '$lib/ui/PageFrame.svelte';
  import EditableTextResourcePanel from '../editable-text/EditableTextResourcePanel.svelte';
  import KickoffSchedulePanel from '../kickoff-schedule/KickoffSchedulePanel.svelte';
  import Header from '../shell/Header.svelte';
  import MutualSuccessPlanResourcePanel from '../plan/MutualSuccessPlanResourcePanel.svelte';
  import { createSuccessRoomResourceDraft } from '../persistence/resourceDraft.svelte';
  import { getSuccessRoomPath } from '../domain/urls';
  import type {
    SuccessRoomResourceRoom,
    SuccessRoomRoutedResource,
    SuccessRoomResourceState
  } from '../domain/types';

  let {
    room,
    resource,
    state: roomState
  }: {
    room: SuccessRoomResourceRoom;
    resource: SuccessRoomRoutedResource;
    state: SuccessRoomResourceState;
  } = $props();

  const draft = createSuccessRoomResourceDraft(
    () => room,
    () => resource,
    () => roomState
  );
</script>

<PageFrame>
  <ContentMeasure as="article" width="narrow">
    <Header
      backHref={getSuccessRoomPath(room.slug, 'documents')}
      backLabel="Success room"
      title={resource.title}
      description={resource.description}
    />

    {@const snapshot = draft.current}
    {#if snapshot.kind === 'mutual-success-plan'}
      <MutualSuccessPlanResourcePanel
        resource={snapshot.resource}
        plan={snapshot.plan}
        onPlanAction={draft.dispatchPlanAction}
      />
    {:else if snapshot.kind === 'editable-text'}
      <EditableTextResourcePanel
        {room}
        resource={snapshot.resource}
        bind:editableState={() => snapshot.editableText, draft.setEditableTextState}
        onAttachmentPersisted={draft.applyPersistedEditableTextAttachment}
      />
    {:else if snapshot.kind === 'kickoff-schedule'}
      <KickoffSchedulePanel
        bind:schedule={() => snapshot.kickoffSchedule, draft.setKickoffScheduleState}
      />
    {/if}
  </ContentMeasure>
</PageFrame>
