import type { ParamMatcher } from '@sveltejs/kit';
import { industries, type IndustryId } from '$lib/marketing/industries/industries';

export const match = ((value: string): value is IndustryId =>
  industries.some((industry) => industry.id === value)) satisfies ParamMatcher;
