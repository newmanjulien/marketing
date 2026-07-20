import type { ParamMatcher } from '@sveltejs/kit';
import { isIndustryId } from '$lib/industries/industryNavigation';

export const match: ParamMatcher = isIndustryId;
