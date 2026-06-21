<script lang="ts">
  import SurveyPostPage from '$lib/survey/SurveyPostPage.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<SurveyPostPage post={data.post} />
