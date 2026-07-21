import type { Component } from 'svelte';

const docsSections = [
  { key: 'overview', label: 'Overview' },
  { key: 'instructions', label: 'Instructions' }
] as const;

type DocsPageSection = (typeof docsSections)[number] & {
  component: Component;
};

type DocsPageEntry = {
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  slug: string;
};

export type DocsPage = DocsPageEntry & {
  sections: DocsPageSection[];
};

const docsPageEntries: DocsPageEntry[] = [
  {
    category: 'insurance',
    categoryLabel: 'Insurance',
    slug: 'applied-epic-access',
    title: 'Applied Epic Requirements',
    description: 'Read-only Applied Epic API and user access requirements for implementation teams.'
  },
  {
    category: 'insurance',
    categoryLabel: 'Insurance',
    slug: 'microsoft-outlook-calendar-integration',
    title: 'Microsoft Outlook Calendar Integration for Renewal Intelligence',
    description: 'Read-only Microsoft 365 calendar access requirements for Renewal Intelligence.'
  },
  {
    category: 'insurance',
    categoryLabel: 'Insurance',
    slug: 'zoominfo-client-data-enrichment',
    title: 'ZoomInfo Integration for Client Data Enrichment',
    description: 'ZoomInfo company enrichment requirements for client and account data quality.'
  }
];

const docsSectionModules = import.meta.glob<{ default: Component }>('/src/content/docs/*/*/*.svx');

export const getDocsPageParams = () =>
  docsPageEntries.map(({ category, slug }) => ({ category, slug }));

export const getDocsPage = async (category: string, slug: string): Promise<DocsPage | undefined> => {
  const pageEntry = docsPageEntries.find(
    (entry) => entry.category === category && entry.slug === slug
  );

  if (!pageEntry) {
    return undefined;
  }

  const sections = await Promise.all(
    docsSections.map(async (section) => {
      const load = docsSectionModules[`/src/content/docs/${category}/${slug}/${section.key}.svx`];

      if (!load) {
        throw new Error(
          `Docs page "${category}/${slug}" is listed in docsPageEntries but is missing its ${section.key}.svx section file`
        );
      }

      return { ...section, component: (await load()).default };
    })
  );

  return {
    ...pageEntry,
    sections
  };
};
