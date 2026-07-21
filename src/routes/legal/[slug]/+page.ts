import { error } from '@sveltejs/kit';
import { getLegalPage, getLegalPageSlugs } from '$lib/marketing/legal/legalPages';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => getLegalPageSlugs().map((slug) => ({ slug }));

export const load: PageLoad = async ({ params }) => {
  const legalPage = await getLegalPage(params.slug);

  if (!legalPage) {
    error(404, 'Legal page not found');
  }

  return {
    legalPage
  };
};
