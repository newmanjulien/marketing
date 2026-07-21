import type { Component } from 'svelte';

export type LegalPageMetadata = {
  title: string;
  updatedAt: string;
  contentWidth?: 'narrow' | 'standard';
};

type LegalPageModule = {
  default: Component;
  page: LegalPageMetadata;
};

export type LegalPage = LegalPageMetadata & {
  slug: string;
  updatedAtLabel: string;
  bodyComponent: Component;
};

export type LegalPageIndexItem = LegalPageMetadata & {
  slug: string;
  href: string;
  updatedAtLabel: string;
};

export type LegalTableColumn = {
  key: string;
  label: string;
};

export type LegalTableRow = Record<string, string | readonly string[]>;

const legalDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC'
});

const legalPageModules = import.meta.glob<LegalPageModule>('/src/content/legal/pages/*.svx');

const legalPageLoaders = new Map(
  Object.entries(legalPageModules).map(([path, load]) => [
    path.split('/').pop()!.replace(/\.svx$/, ''),
    load
  ])
);

const formatLegalDate = (updatedAt: string) => legalDateFormatter.format(new Date(updatedAt));

// Presentation order for the legal index. Must list every page exactly once.
const legalPageOrder = [
  'terms',
  'billing-and-payment-terms',
  'dpa',
  'acceptable-use',
  'privacy-policy',
  'security-policy',
  'subprocessors'
];

const orderedLegalPages = legalPageOrder.map((slug) => {
  const loadLegalPage = legalPageLoaders.get(slug);

  if (!loadLegalPage) {
    throw new Error(`legalPageOrder lists "${slug}" but no page file matches it`);
  }

  return { slug, loadLegalPage };
});

if (orderedLegalPages.length !== legalPageLoaders.size) {
  const unordered = [...legalPageLoaders.keys()].filter((slug) => !legalPageOrder.includes(slug));

  throw new Error(`Legal pages missing from legalPageOrder: ${unordered.join(', ')}`);
}

export const getLegalPageSlugs = () => [...legalPageOrder];

export const getLegalPage = async (slug: string): Promise<LegalPage | undefined> => {
  const loadLegalPage = legalPageLoaders.get(slug);

  if (!loadLegalPage) {
    return undefined;
  }

  const { default: bodyComponent, page } = await loadLegalPage();

  return {
    slug,
    ...page,
    updatedAtLabel: formatLegalDate(page.updatedAt),
    bodyComponent
  };
};

export const getLegalPageIndexItems = (): Promise<LegalPageIndexItem[]> =>
  Promise.all(
    orderedLegalPages.map(async ({ slug, loadLegalPage }) => {
      const { page } = await loadLegalPage();

      return {
        slug,
        href: `/legal/${slug}`,
        ...page,
        updatedAtLabel: formatLegalDate(page.updatedAt)
      };
    })
  );
