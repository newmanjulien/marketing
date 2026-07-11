import type { DocsPage, DocsPageRegistryEntry, DocsSectionModule } from './docsTypes';
import { docsSections, isDocsSection, type DocsSection } from './docsSections';

const docsCategoryLabels: Record<string, string> = {
  insurance: 'Insurance'
};

const docsPageEntries: DocsPageRegistryEntry[] = [
  {
    category: 'insurance',
    slug: 'applied-epic-access',
    title: 'Applied Epic Requirements',
    description: 'Read-only Applied Epic API and user access requirements for implementation teams.'
  },
  {
    category: 'insurance',
    slug: 'microsoft-outlook-calendar-integration',
    title: 'Microsoft Outlook Calendar Integration for Renewal Intelligence',
    description: 'Read-only Microsoft 365 calendar access requirements for Renewal Intelligence.'
  },
  {
    category: 'insurance',
    slug: 'zoominfo-client-data-enrichment',
    title: 'ZoomInfo Integration for Client Data Enrichment',
    description: 'ZoomInfo company enrichment requirements for client and account data quality.'
  }
];

const docsSectionModules = import.meta.glob<DocsSectionModule>('../../content/docs/*/*/*.svx');

type DocsSectionLoader = () => Promise<DocsSectionModule>;
type DocsSectionLoaders = Partial<Record<DocsSection, DocsSectionLoader>>;
type ResolvedDocsSection = (typeof docsSections)[number] & {
  load: DocsSectionLoader;
};

const getDocsPageKey = (category: string, slug: string) => `${category}/${slug}`;

const getDocsSectionPathParts = (path: string) => {
  const [category, slug, filename] = path.split('/').slice(-3);
  const section = filename.slice(0, -4);

  return isDocsSection(section) ? { category, slug, section } : undefined;
};

const docsPageRegistry = new Map(
  docsPageEntries.map((entry) => [getDocsPageKey(entry.category, entry.slug), entry])
);

const docsPageSectionLoaders = new Map<string, DocsSectionLoaders>();

for (const [path, load] of Object.entries(docsSectionModules)) {
  const pathParts = getDocsSectionPathParts(path);

  if (pathParts) {
    const pageKey = getDocsPageKey(pathParts.category, pathParts.slug);
    const pageLoaders = docsPageSectionLoaders.get(pageKey) ?? {};

    pageLoaders[pathParts.section] = load;
    docsPageSectionLoaders.set(pageKey, pageLoaders);
  }
}

const resolveRequiredSections = (
  sectionLoaders: DocsSectionLoaders | undefined
): ResolvedDocsSection[] | undefined => {
  if (!sectionLoaders) {
    return undefined;
  }

  const resolvedSections: ResolvedDocsSection[] = [];

  for (const section of docsSections) {
    const load = sectionLoaders[section.key];

    if (!load) {
      return undefined;
    }

    resolvedSections.push({
      ...section,
      load
    });
  }

  return resolvedSections;
};

export const getDocsPage = async (category: string, slug: string): Promise<DocsPage | undefined> => {
  const pageKey = getDocsPageKey(category, slug);
  const pageEntry = docsPageRegistry.get(pageKey);
  const requiredSections = resolveRequiredSections(docsPageSectionLoaders.get(pageKey));

  if (!pageEntry || !requiredSections) {
    return undefined;
  }

  const sections = await Promise.all(
    requiredSections.map(async ({ load, ...section }) => {
      const sectionModule = await load();

      return {
        ...section,
        component: sectionModule.default
      };
    })
  );

  return {
    ...pageEntry,
    categoryLabel: docsCategoryLabels[pageEntry.category] ?? pageEntry.category,
    sections
  };
};
