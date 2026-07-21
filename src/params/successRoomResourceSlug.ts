import type { ParamMatcher } from '@sveltejs/kit';
import { isSuccessRoomResourceSlug } from '$lib/success-room/domain/resourceSlugs';

export const match = isSuccessRoomResourceSlug satisfies ParamMatcher;
