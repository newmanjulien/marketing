import { getLegalPageIndexItems } from '$lib/legal/legalPages';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => ({
  legalPages: await getLegalPageIndexItems()
});
