import type { ParamMatcher } from '@sveltejs/kit';
import { isSuccessRoomResourceSlug } from '$shared/successRoomResources';

export const match = isSuccessRoomResourceSlug satisfies ParamMatcher;
