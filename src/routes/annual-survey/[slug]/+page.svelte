<script lang="ts">
  import PostPage from '$lib/survey/pages/PostPage.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<PostPage post={data.post} />
