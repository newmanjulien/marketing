export const docsSections = [
  { key: 'overview', label: 'Overview' },
  { key: 'instructions', label: 'Instructions' }
] as const;

export type DocsSectionDefinition = (typeof docsSections)[number];
