import type { ParamMatcher } from '@sveltejs/kit';
import { isIndustryId } from '$lib/marketing/industries/industryContent';

export const match = isIndustryId satisfies ParamMatcher;
