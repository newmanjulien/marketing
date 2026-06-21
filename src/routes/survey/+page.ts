import { getSurveyPostSummaries } from '$lib/survey/surveyPosts';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  return {
    posts: await getSurveyPostSummaries()
  };
};
