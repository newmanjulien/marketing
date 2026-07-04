import { error } from '@sveltejs/kit';
import { getDocsPage } from '$lib/docs/docsPages';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const docsPage = await getDocsPage(params.category, params.slug);

  if (!docsPage) {
    error(404, 'Docs page not found');
  }

  return {
    docsPage
  };
};
