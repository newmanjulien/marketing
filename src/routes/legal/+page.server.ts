import { getLegalPageIndexItems } from '$lib/legal/legalPages';
import type { PageServerLoad } from './$types';

// Server-only so the index ships plain metadata instead of every legal page's body component.
export const load: PageServerLoad = async () => ({
  legalPages: await getLegalPageIndexItems()
});
