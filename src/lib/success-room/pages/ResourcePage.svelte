<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import EditableTextResourcePanel from '../editable-text/EditableTextResourcePanel.svelte';
  import KickoffSchedulePanel from '../kickoff-schedule/KickoffSchedulePanel.svelte';
  import Header from '../shell/Header.svelte';
  import MutualSuccessPlanResourcePanel from '../plan/MutualSuccessPlanResourcePanel.svelte';
  import { kickoffScheduleColumns } from '../domain/config';
  import { createSuccessRoomResourceDraft } from '../persistence/resourceDraft.svelte';
  import { getSuccessRoomHref } from '../domain/resources';
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
      backHref={getSuccessRoomHref(room, 'documents')}
      backLabel="Success room"
      title={resource.title}
      description={resource.description}
    />

    {#if resource.kind === 'mutual-success-plan'}
      <MutualSuccessPlanResourcePanel
        {resource}
        plan={draft.plan}
        onPlanChange={draft.updatePlan}
      />
    {:else if resource.kind === 'editable-text'}
      <EditableTextResourcePanel
        {room}
        {resource}
        bind:editableState={draft.editableTextState}
      />
    {:else if resource.kind === 'kickoff-schedule'}
      <KickoffSchedulePanel
        columns={kickoffScheduleColumns}
        bind:schedule={draft.kickoffScheduleState}
      />
    {/if}
  </ContentMeasure>
</PageFrame>
