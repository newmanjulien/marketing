import type { SurveyPost, SurveyPostModule } from './types';

const surveyDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC'
});

const surveyPostModules = import.meta.glob<SurveyPostModule>(
  '../../../content/survey/entries/*.svx'
);
const surveyPostLoaders = new Map(
  Object.entries(surveyPostModules).map(([path, load]) => [
    path.slice(path.lastIndexOf('/') + 1, -4),
    load
  ])
);

const formatSurveyDate = (publishedAt: string) => surveyDateFormatter.format(new Date(publishedAt));

export const getSurveyPost = async (slug: string): Promise<SurveyPost | undefined> => {
  const loadPost = surveyPostLoaders.get(slug);

  if (!loadPost) {
    return undefined;
  }

  const { default: bodyComponent, post } = await loadPost();

  return {
    slug,
    ...post,
    publishedAtLabel: formatSurveyDate(post.publishedAt),
    bodyComponent
  };
};
