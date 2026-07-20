import type { DocsPage, DocsPageEntry, DocsSectionModule } from './docsTypes';
import { docsSections, type DocsSectionDefinition } from './docsSections';

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

const docsSectionModules = import.meta.glob<DocsSectionModule>('../../content/docs/*/*/*.svx');

export const getDocsPageParams = () =>
  docsPageEntries.map(({ category, slug }) => ({ category, slug }));

export const getDocsPage = async (category: string, slug: string): Promise<DocsPage | undefined> => {
  const pageEntry = docsPageEntries.find(
    (entry) => entry.category === category && entry.slug === slug
  );

  if (!pageEntry) {
    return undefined;
  }

  const sectionLoaders: { section: DocsSectionDefinition; load: () => Promise<DocsSectionModule> }[] = [];

  for (const section of docsSections) {
    const load = docsSectionModules[`../../content/docs/${category}/${slug}/${section.key}.svx`];

    if (!load) {
      return undefined;
    }

    sectionLoaders.push({ section, load });
  }

  const sections = await Promise.all(
    sectionLoaders.map(async ({ section, load }) => ({
      ...section,
      component: (await load()).default
    }))
  );

  return {
    ...pageEntry,
    sections
  };
};
