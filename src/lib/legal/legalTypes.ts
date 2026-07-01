import type { Component } from 'svelte';

export type LegalPageContentWidth = 'narrow' | 'standard';

export type LegalPageMetadata = {
  title: string;
  updatedAt: string;
  contentWidth?: LegalPageContentWidth;
};

export type LegalPageModule = {
  default: Component;
  page: LegalPageMetadata;
};

export type LegalPage = LegalPageMetadata & {
  slug: string;
  updatedAtLabel: string;
  bodyComponent: Component;
};

export type LegalTableColumn = {
  key: string;
  label: string;
};

export type LegalTableCell = string | readonly string[];

export type LegalTableRow = Record<string, LegalTableCell>;
