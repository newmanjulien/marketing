import type { LegalPage, LegalPageIndexItem, LegalPageModule } from './legalTypes';

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

const legalPageOrder = [
  'terms',
  'billing-and-payment-terms',
  'dpa',
  'acceptable-use',
  'privacy-policy',
  'security-policy',
  'subprocessors'
];

const getLegalPageOrder = (slug: string) => {
  const order = legalPageOrder.indexOf(slug);

  return order === -1 ? legalPageOrder.length : order;
};

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

export const getLegalPageIndexItems = async (): Promise<LegalPageIndexItem[]> => {
  const pages = await Promise.all(
    Array.from(legalPageLoaders.entries()).map(async ([slug, loadLegalPage]) => {
      const { page } = await loadLegalPage();

      return {
        slug,
        href: `/legal/${slug}`,
        ...page,
        updatedAtLabel: formatLegalDate(page.updatedAt)
      };
    })
  );

  return pages.sort((firstPage, secondPage) => {
    const orderDifference = getLegalPageOrder(firstPage.slug) - getLegalPageOrder(secondPage.slug);

    return orderDifference || firstPage.title.localeCompare(secondPage.title);
  });
};
