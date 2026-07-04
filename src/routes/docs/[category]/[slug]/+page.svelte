<script lang="ts">
  import DocsPage from '$lib/docs/DocsPage.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

{#key `${data.docsPage.category}/${data.docsPage.slug}`}
  <DocsPage page={data.docsPage} />
{/key}
