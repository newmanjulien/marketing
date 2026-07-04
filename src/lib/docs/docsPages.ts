import type {
  DocsPage,
  DocsPageRegistryEntry,
  DocsSection,
  DocsSectionModule
} from './docsTypes';
import { docsSections, isDocsSection } from './docsSections';

const docsCategoryLabels: Record<string, string> = {
  insurance: 'Insurance'
};

const docsPageEntries: DocsPageRegistryEntry[] = [
  {
    category: 'insurance',
    slug: 'applied-epic-access',
    title: 'Applied Epic Requirements',
    description: 'Read-only Applied Epic API and user access requirements for implementation teams.',
    updatedAt: '2026-07-04'
  },
  {
    category: 'insurance',
    slug: 'microsoft-outlook-calendar-integration',
    title: 'Microsoft Outlook Calendar Integration for Renewal Intelligence',
    description: 'Read-only Microsoft 365 calendar access requirements for Renewal Intelligence.',
    updatedAt: '2026-07-04'
  },
  {
    category: 'insurance',
    slug: 'zoominfo-client-data-enrichment',
    title: 'ZoomInfo Integration for Client Data Enrichment',
    description: 'ZoomInfo company enrichment requirements for client and account data quality.',
    updatedAt: '2026-07-04'
  }
];

const docsDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC'
});

const docsSectionModules = import.meta.glob<DocsSectionModule>('../../content/docs/*/*/*.svx');

type DocsSectionLoader = () => Promise<DocsSectionModule>;
type DocsSectionLoaders = Partial<Record<DocsSection, DocsSectionLoader>>;
type ResolvedDocsSection = (typeof docsSections)[number] & {
  load: DocsSectionLoader;
};

const getDocsPageKey = (category: string, slug: string) => `${category}/${slug}`;

const getDocsSectionPathParts = (path: string) => {
  const match = path.match(/\/docs\/([^/]+)\/([^/]+)\/([^/]+)\.svx$/);

  if (!match) {
    return undefined;
  }

  const section = match[3];

  return isDocsSection(section)
    ? { category: match[1], slug: match[2], section }
    : undefined;
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

const formatDocsDate = (updatedAt: string) => docsDateFormatter.format(new Date(updatedAt));

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
    updatedAtLabel: pageEntry.updatedAt ? formatDocsDate(pageEntry.updatedAt) : undefined,
    sections
  };
};
