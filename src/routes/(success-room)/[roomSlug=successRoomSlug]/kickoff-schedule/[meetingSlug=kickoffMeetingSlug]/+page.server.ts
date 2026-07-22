import { error } from '@sveltejs/kit';
import {
  getLockedSuccessRoomPayload,
  getUnlockedSuccessRoomResourcePage,
  unlockSuccessRoom
} from '$lib/success-room/server/pageServer.server';
import { isSuccessRoomResourceNotEnabledError } from '$lib/success-room/server/access.server';
import { getKickoffMeeting, parseKickoffMeetingSlug } from '$shared/successRoomKickoffSchedule';
import { kickoffScheduleResourceSlug } from '$shared/successRoomResources';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
  try {
    const payload = await getUnlockedSuccessRoomResourcePage(
      cookies,
      params.roomSlug,
      kickoffScheduleResourceSlug
    );

    if (!payload) {
      return getLockedSuccessRoomPayload(params.roomSlug);
    }

    // The matcher already guarantees the slug parses; the null check narrows.
    const meetingCell = parseKickoffMeetingSlug(params.meetingSlug);

    if (
      payload.state.kind !== 'kickoff-schedule' ||
      !meetingCell ||
      !getKickoffMeeting(payload.state.kickoffSchedule, meetingCell)
    ) {
      error(404, 'Success room meeting not found');
    }

    return { ...payload, meetingCell };
  } catch (loadError) {
    if (isSuccessRoomResourceNotEnabledError(loadError)) {
      error(404, 'Success room resource not found');
    }

    throw loadError;
  }
};

export const actions = {
  unlock: unlockSuccessRoom
} satisfies Actions;
