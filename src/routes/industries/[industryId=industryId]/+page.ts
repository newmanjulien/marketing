import { industryPages } from '$lib/industries/industryPageContent';
import { industryIds, type IndustryId } from '$lib/industries/industryNavigation';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => industryIds.map((industryId) => ({ industryId }));

export const load: PageLoad = ({ params }) => {
  // The industryId param matcher guarantees this is a valid IndustryId.
  const industryId = params.industryId as IndustryId;

  return {
    industryId,
    content: industryPages[industryId]
  };
};
