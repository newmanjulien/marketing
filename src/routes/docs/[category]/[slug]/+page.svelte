<script lang="ts">
  import DocsPage from '$lib/marketing/docs/DocsPage.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Overbase › {data.docsPage.title}</title>
</svelte:head>

<DocsPage page={data.docsPage} />
