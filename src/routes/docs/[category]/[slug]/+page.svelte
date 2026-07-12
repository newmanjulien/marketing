<script lang="ts">
  import DocsPage from '$lib/docs/DocsPage.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

{#key `${data.docsPage.category}/${data.docsPage.slug}`}
  <DocsPage page={data.docsPage} />
{/key}
