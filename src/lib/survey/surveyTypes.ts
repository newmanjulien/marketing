import type { Component } from 'svelte';

export type SurveyPostContent = {
  title: string;
  description: string;
  publishedAt: string;
  introduction: string;
};

export type SurveyPostModule = {
  default: Component;
  post: SurveyPostContent;
};

export type SurveyPostDefinition = {
  slug: string;
  load: () => Promise<SurveyPostModule>;
};

export type SurveyPostSummary = Omit<SurveyPostContent, 'introduction'> & {
  slug: string;
  publishedAtLabel: string;
};

export type SurveyPost = SurveyPostSummary & {
  introduction: string;
  bodyComponent: Component;
};
