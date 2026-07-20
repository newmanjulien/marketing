export type IndustryScreenshot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type IndustryScreenshotGroup = {
  emailFormat: IndustryScreenshot;
  opportunityEmail: IndustryScreenshot;
};

export type IndustryScreenshots = {
  setup: IndustryScreenshot;
  opportunityGroups: readonly IndustryScreenshotGroup[];
};

export type IndustryPageContent = {
  heading: string;
  introParagraphs: readonly string[];
  screenshots: IndustryScreenshots;
};
