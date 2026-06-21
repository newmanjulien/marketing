declare module '*.svx' {
  import type { Component } from 'svelte';
  import type { SurveyPostContent } from '$lib/survey/surveyTypes';

  export const post: SurveyPostContent;

  const component: Component;
  export default component;
}
