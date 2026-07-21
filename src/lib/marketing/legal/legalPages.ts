import type { Component } from 'svelte';
import { resolve } from '$app/paths';

type LegalPageModule = {
  default: Component;
  page: {
    title: string;
    updatedAt: string;
  };
};

export type LegalPage = {
  title: string;
  updatedAtLabel: string;
  bodyComponent: Component;
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

// Presentation order for the legal index. Must list every page exactly once.
export const legalPageSlugs = [
  'terms',
  'billing-and-payment-terms',
  'dpa',
  'acceptable-use',
  'privacy-policy',
  'security-policy',
  'subprocessors'
];

if (new Set(legalPageSlugs).size !== legalPageSlugs.length) {
  throw new Error('legalPageSlugs contains a duplicate slug');
}

if (legalPageSlugs.length !== legalPageLoaders.size) {
  throw new Error('legalPageSlugs must list every legal page');
}

const orderedLegalPages = legalPageSlugs.map((slug) => {
  const loadLegalPage = legalPageLoaders.get(slug);

  if (!loadLegalPage) {
    throw new Error(`legalPageSlugs lists "${slug}" but no page file matches it`);
  }

  return { slug, loadLegalPage };
});

export const getLegalPage = async (slug: string): Promise<LegalPage | undefined> => {
  const loadLegalPage = legalPageLoaders.get(slug);

  if (!loadLegalPage) {
    return undefined;
  }

  const { default: bodyComponent, page } = await loadLegalPage();

  return {
    title: page.title,
    updatedAtLabel: legalDateFormatter.format(new Date(page.updatedAt)),
    bodyComponent
  };
};

export const getLegalPageIndexItems = () =>
  Promise.all(
    orderedLegalPages.map(async ({ slug, loadLegalPage }) => ({
      slug,
      href: resolve('/legal/[slug]', { slug }),
      title: (await loadLegalPage()).page.title
    }))
  );
