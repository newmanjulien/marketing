<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import SuccessRoomEditableTextResourcePanel from './SuccessRoomEditableTextResourcePanel.svelte';
  import SuccessRoomHeader from './SuccessRoomHeader.svelte';
  import SuccessRoomMutualSuccessPlanResourcePanel from './SuccessRoomMutualSuccessPlanResourcePanel.svelte';
  import { getSuccessRoomHref } from './successRooms';
  import type { SuccessRoom, SuccessRoomRoutedResource } from './successRoomTypes';

  let {
    room,
    resource
  }: {
    room: SuccessRoom;
    resource: SuccessRoomRoutedResource;
  } = $props();
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
      <SuccessRoomMutualSuccessPlanResourcePanel {room} {resource} />
    {:else if resource.kind === 'editable-text'}
      <SuccessRoomEditableTextResourcePanel {room} {resource} />
    {/if}
  </ContentMeasure>
</PageFrame>
