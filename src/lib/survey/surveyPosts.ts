import type { SurveyPost, SurveyPostDefinition } from './surveyTypes';

const surveyDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC'
});

export const surveyPostDefinitions = [
  {
    slug: '2026-law-firm-cmos',
    load: () => import('$content/survey/entries/2026-law-firm-cmos.svx')
  },
  {
    slug: '2026-insurance-cmos',
    load: () => import('$content/survey/entries/2026-insurance-cmos.svx')
  },
  {
    slug: '2026-consulting-cmos',
    load: () => import('$content/survey/entries/2026-consulting-cmos.svx')
  },
  {
    slug: '2026-accounting-cmos',
    load: () => import('$content/survey/entries/2026-accounting-cmos.svx')
  },
  {
    slug: '2026-gov-cmos',
    load: () => import('$content/survey/entries/2026-gov-cmos.svx')
  },
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
