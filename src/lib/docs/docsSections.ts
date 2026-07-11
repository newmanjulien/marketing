export const docsSections = [
  { key: 'overview', label: 'Overview' },
  { key: 'instructions', label: 'Instructions' }
] as const;

export type DocsSectionDefinition = (typeof docsSections)[number];
export type DocsSection = DocsSectionDefinition['key'];

const docsSectionKeys = new Set<string>(docsSections.map(({ key }) => key));

export const isDocsSection = (section: string): section is DocsSection => docsSectionKeys.has(section);
