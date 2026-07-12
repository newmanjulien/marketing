<script lang="ts">
  import DocsPage from '$lib/docs/DocsPage.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<DocsPage page={data.docsPage} />
