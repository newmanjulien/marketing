import type { ParamMatcher } from '@sveltejs/kit';
import { isNormalizedSuccessRoomSlug } from '../../shared/successRoomSlugs';

export const match = isNormalizedSuccessRoomSlug satisfies ParamMatcher;
