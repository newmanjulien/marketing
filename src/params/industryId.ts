import type { ParamMatcher } from '@sveltejs/kit';
import { isIndustryId } from '$lib/marketing/industries/industries';

export const match = isIndustryId satisfies ParamMatcher;
