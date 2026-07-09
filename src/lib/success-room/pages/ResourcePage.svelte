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
    SuccessRoom,
    SuccessRoomRoutedResource,
    SuccessRoomState
  } from '../domain/types';

  let {
    room,
    resource,
    state: roomState
  }: {
    room: SuccessRoom;
    resource: SuccessRoomRoutedResource;
    state: SuccessRoomState;
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
      backHref={getSuccessRoomHref(room)}
      backLabel="Success room"
      title={resource.title}
      description={resource.description}
    />

    {#if resource.kind === 'mutual-success-plan'}
      <MutualSuccessPlanResourcePanel
        {room}
        {resource}
        plan={draft.plan}
        onPlanChange={draft.updatePlan}
      />
    {:else if resource.kind === 'editable-text'}
      <EditableTextResourcePanel
        {room}
        {resource}
        state={draft.getEditableTextState(resource)}
        onStateChange={(nextState) => draft.setEditableTextState(resource.slug, nextState)}
      />
    {:else if resource.kind === 'kickoff-schedule'}
      <KickoffSchedulePanel
        columns={kickoffScheduleColumns}
        schedule={draft.getKickoffScheduleState(resource)}
        onStateChange={(nextState) => draft.setKickoffScheduleState(resource.slug, nextState)}
      />
    {/if}
  </ContentMeasure>
</PageFrame>
