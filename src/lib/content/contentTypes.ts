export type ContentTextSegment = {
  text: string;
  href?: string;
};

export type ContentParagraph = ContentTextSegment[];

export type ContentLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type ContentSection = {
  body: string;
};
