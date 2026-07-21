import { industryIds, industryPages } from '$lib/marketing/industries/industryContent';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => industryIds.map((industryId) => ({ industryId }));

export const load: PageLoad = ({ params }) => ({
  industryId: params.industryId,
  content: industryPages[params.industryId]
});
