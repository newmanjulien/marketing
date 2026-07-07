import type { Component } from 'svelte';

export type DocsSection = 'overview' | 'instructions';

export type DocsSectionDefinition = {
  key: DocsSection;
  label: string;
};

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
