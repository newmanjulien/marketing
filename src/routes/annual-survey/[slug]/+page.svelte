<script lang="ts">
  import PostPage from '$lib/survey/pages/PostPage.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<PostPage post={data.post} />
