import type { PageMeta } from '$lib/page/pageMeta';

export type InlineTextSegment = {
  text: string;
  href?: string;
};

export type RichTextParagraph = string | InlineTextSegment[];

export type PageLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type TextPageSection = {
  body: string;
};

export type TextPageContent = PageMeta & {
  heading: string;
  introParagraphs: readonly RichTextParagraph[];
  links: readonly PageLink[];
  sections: readonly TextPageSection[];
};
