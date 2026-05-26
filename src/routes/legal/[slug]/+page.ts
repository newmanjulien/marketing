import { error } from '@sveltejs/kit';
import { getLegalPage } from '$lib/data/legalPages';

export function load({ params }) {
  const legalPage = getLegalPage(params.slug);

  if (!legalPage) {
    error(404, 'Legal page not found');
  }

  return {
    legalPage
  };
}
