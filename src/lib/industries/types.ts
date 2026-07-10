export type IndustryScreenshot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type IndustrySectionId = "setup" | "emailFormat" | "opportunityEmail";

export type IndustryPageSection<SectionId extends IndustrySectionId = IndustrySectionId> = {
  id: SectionId;
  heading: string;
  body: string;
};

export type IndustryPageSections = {
  readonly [SectionId in IndustrySectionId]: IndustryPageSection<SectionId>;
};

export type IndustryScreenshotGroup = {
  emailFormat: IndustryScreenshot;
  opportunityEmail: IndustryScreenshot;
};

export type IndustryScreenshots = {
  setup: IndustryScreenshot;
  opportunityGroups: readonly [
    IndustryScreenshotGroup,
    ...IndustryScreenshotGroup[],
  ];
};

export type IndustryContentDefinition = {
  heading: string;
  introParagraphs: readonly [string, string];
  screenshots: IndustryScreenshots;
};

export type IndustryPageContent = {
  heading: string;
  introParagraphs: readonly string[];
  sections: IndustryPageSections;
  screenshots: IndustryScreenshots;
};
