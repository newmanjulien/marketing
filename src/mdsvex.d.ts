declare module '$content/survey/entries/*.svx' {
  import type { Component } from 'svelte';
  import type { SurveyPostContent } from '$lib/survey/domain/types';

  export const post: SurveyPostContent;

  const component: Component;
  export default component;
}

declare module '$content/legal/pages/*.svx' {
  import type { Component } from 'svelte';
  import type { LegalPageMetadata } from '$lib/legal/legalTypes';

  export const page: LegalPageMetadata;

  const component: Component;
  export default component;
}

declare module '$content/docs/*/*/*.svx' {
  import type { Component } from 'svelte';

  const component: Component;
  export default component;
}

declare module '*.svx' {
  import type { Component } from 'svelte';

  const component: Component;
  export default component;
}
