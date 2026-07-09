import { error } from '@sveltejs/kit';
import { getSurveyPost } from '$lib/survey/domain/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const post = await getSurveyPost(params.slug);

  if (!post) {
    error(404, 'Survey post not found');
  }

  return {
    post
  };
};
