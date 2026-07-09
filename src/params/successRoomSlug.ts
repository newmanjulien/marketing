import type { ParamMatcher } from '@sveltejs/kit';
import { isNormalizedSuccessRoomSlug } from '../../shared/successRoomSlugs';

export const match: ParamMatcher = isNormalizedSuccessRoomSlug;
