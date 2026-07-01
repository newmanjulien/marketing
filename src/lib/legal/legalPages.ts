import type { LegalPage, LegalPageModule } from './legalTypes';

const legalDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC'
});

const legalPageModules = import.meta.glob<LegalPageModule>('../../content/legal/pages/*.svx');

const getSlugFromPath = (path: string) => path.match(/\/([^/]+)\.svx$/)?.[1];

const legalPageLoaders = new Map(
  Object.entries(legalPageModules).flatMap(([path, load]) => {
    const slug = getSlugFromPath(path);

    return slug ? [[slug, load]] : [];
  })
);

const formatLegalDate = (updatedAt: string) => legalDateFormatter.format(new Date(updatedAt));

export const getLegalPage = async (slug: string): Promise<LegalPage | undefined> => {
  const loadLegalPage = legalPageLoaders.get(slug);

  if (!loadLegalPage) {
    return undefined;
  }

  const pageModule = await loadLegalPage();
  const { page } = pageModule;

  return {
    slug,
    ...page,
    updatedAtLabel: formatLegalDate(page.updatedAt),
    bodyComponent: pageModule.default
  };
};
