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

export type SurveyPost = SurveyPostContent & {
  slug: string;
  publishedAtLabel: string;
  bodyComponent: Component;
};
