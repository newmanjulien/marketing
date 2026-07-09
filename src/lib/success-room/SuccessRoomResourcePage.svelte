<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import SuccessRoomEditableTextResourcePanel from './SuccessRoomEditableTextResourcePanel.svelte';
  import SuccessRoomHeader from './SuccessRoomHeader.svelte';
  import SuccessRoomMutualSuccessPlanResourcePanel from './SuccessRoomMutualSuccessPlanResourcePanel.svelte';
  import { createSuccessRoomResourceDraft } from './successRoomDrafts.svelte';
  import { getSuccessRoomHref } from './successRooms';
  import type {
    SuccessRoom,
    SuccessRoomRoutedResource,
    SuccessRoomState
  } from './successRoomTypes';

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
    <SuccessRoomHeader
      backHref={getSuccessRoomHref(room)}
      backLabel="Success room"
      title={resource.title}
      description={resource.description}
    />

    {#if resource.kind === 'mutual-success-plan'}
      <SuccessRoomMutualSuccessPlanResourcePanel
        {room}
        {resource}
        plan={draft.plan}
        onPlanChange={draft.updatePlan}
      />
    {:else if resource.kind === 'editable-text'}
      <SuccessRoomEditableTextResourcePanel
        {room}
        {resource}
        state={draft.getEditableTextState(resource)}
        onStateChange={(nextState) => draft.setEditableTextState(resource.slug, nextState)}
      />
    {/if}
  </ContentMeasure>
</PageFrame>
