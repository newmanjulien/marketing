import type { DocsSection, DocsSectionDefinition } from './docsTypes';

export const docsSections = [
  { key: 'overview', label: 'Overview' },
  { key: 'instructions', label: 'Instructions' }
] as const satisfies readonly DocsSectionDefinition[];

const docsSectionKeys = new Set<string>(docsSections.map(({ key }) => key));

export const isDocsSection = (section: string): section is DocsSection => docsSectionKeys.has(section);
