<script lang="ts">
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import PageFrame from '$lib/ui/PageFrame.svelte';
  import { getKickoffMeeting, type KickoffCell } from '$shared/successRoomKickoffSchedule';
  import KickoffMeetingPanel from '../kickoff-schedule/KickoffMeetingPanel.svelte';
  import { createSuccessRoomResourceDraft } from '../persistence/resourceDraft.svelte';
  import { getSuccessRoomResourcePath } from '../domain/urls';
  import type {
    SuccessRoomResourceRoom,
    SuccessRoomRoutedResource,
    SuccessRoomResourceState
  } from '../domain/types';

  let {
    room,
    resource,
    state: roomState,
    meetingCell
  }: {
    room: SuccessRoomResourceRoom;
    resource: SuccessRoomRoutedResource;
    state: SuccessRoomResourceState;
    meetingCell: KickoffCell;
  } = $props();

  const draft = createSuccessRoomResourceDraft(
    () => room,
    () => resource,
    () => roomState
  );
</script>

<PageFrame>
  <ContentMeasure as="article" width="narrow">
    {@const snapshot = draft.current}
    {@const meeting =
      snapshot.kind === 'kickoff-schedule'
        ? getKickoffMeeting(snapshot.kickoffSchedule, meetingCell)
        : null}

    {#if snapshot.kind === 'kickoff-schedule' && meeting}
      <KickoffMeetingPanel
        team={snapshot.resource.team}
        backHref={getSuccessRoomResourcePath(room.slug, snapshot.resource.slug)}
        bind:meeting={
          () => meeting,
          (next) =>
            draft.dispatchKickoffScheduleAction({ type: 'patch-meeting', ...meetingCell, meeting: next })
        }
      />
    {/if}
  </ContentMeasure>
</PageFrame>
