import { industries, industriesById } from '$lib/marketing/industries/industries';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => industries.map(({ id }) => ({ industryId: id }));

export const load: PageLoad = ({ params }) => ({
  industry: industriesById[params.industryId]
});
