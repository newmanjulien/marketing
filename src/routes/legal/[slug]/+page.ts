import { error } from '@sveltejs/kit';
import { getLegalPage } from '$lib/legal/legalPages';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const legalPage = await getLegalPage(params.slug);

  if (!legalPage) {
    error(404, 'Legal page not found');
  }

  return {
    legalPage
  };
};
