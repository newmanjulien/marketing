import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import type { EntryGenerator, PageLoad } from './$types';

const sections = [
  { key: 'overview', label: 'Overview' },
  { key: 'instructions', label: 'Instructions' }
] as const;

type DocsPageEntry = {
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  slug: string;
};

const pages: DocsPageEntry[] = [
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

const sectionModules = import.meta.glob<{ default: Component }>('/src/content/docs/*/*/*.svx');

export const entries: EntryGenerator = () =>
  pages.map(({ category, slug }) => ({ category, slug }));

export const load: PageLoad = async ({ params }) => {
  const { category, slug } = params;

  const pageEntry = pages.find((entry) => entry.category === category && entry.slug === slug);

  if (!pageEntry) {
    error(404, 'Docs page not found');
  }

  return {
    ...pageEntry,
    sections: await Promise.all(
      sections.map(async (section) => {
        const loadSection = sectionModules[`/src/content/docs/${category}/${slug}/${section.key}.svx`];

        if (!loadSection) {
          throw new Error(
            `Docs page "${category}/${slug}" is listed in pages but is missing its ${section.key}.svx section file`
          );
        }

        return { ...section, component: (await loadSection()).default };
      })
    )
  };
};
