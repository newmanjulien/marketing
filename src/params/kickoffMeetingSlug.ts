import type { ParamMatcher } from '@sveltejs/kit';
import { isKickoffMeetingSlug } from '$shared/successRoomKickoffSchedule';

export const match = isKickoffMeetingSlug satisfies ParamMatcher;
