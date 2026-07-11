import type { Component } from 'svelte';
import type { DocsSectionDefinition } from './docsSections';

export type DocsPageSection = DocsSectionDefinition & {
  component: Component;
};

export type DocsPageMetadata = {
  title: string;
  description?: string;
};

export type DocsPageRegistryEntry = DocsPageMetadata & {
  category: string;
  slug: string;
};

export type DocsSectionModule = {
  default: Component;
};

export type DocsPage = DocsPageMetadata & {
  category: string;
  categoryLabel: string;
  slug: string;
  sections: DocsPageSection[];
};
