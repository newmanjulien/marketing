import type { SurveyPost, SurveyPostDefinition } from './surveyTypes';

const surveyDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC'
});

export const surveyPostDefinitions = [
  {
    slug: 'innovative-law-firm-cios',
    load: () => import('$content/survey/entries/innovative-law-firm-cios.svx')
  }
] as const satisfies readonly SurveyPostDefinition[];

const formatSurveyDate = (publishedAt: string) => surveyDateFormatter.format(new Date(publishedAt));

export const getSurveyPost = async (slug: string): Promise<SurveyPost | undefined> => {
  const definition = surveyPostDefinitions.find((post) => post.slug === slug);

  if (!definition) {
    return undefined;
  }

  const postModule = await definition.load();
  const { post } = postModule;

  return {
    slug: definition.slug,
    ...post,
    publishedAtLabel: formatSurveyDate(post.publishedAt),
    bodyComponent: postModule.default
  };
};
