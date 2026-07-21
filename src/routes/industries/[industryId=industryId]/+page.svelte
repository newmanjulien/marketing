<script lang="ts">
  import IndustryPage from '$lib/marketing/industries/IndustryPage.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.content.heading}</title>
</svelte:head>

{#key data.industryId}
  <IndustryPage content={data.content} />
{/key}
