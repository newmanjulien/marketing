<script lang="ts">
  import IndustryPage from '$lib/marketing/industries/IndustryPage.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.industry.heading}</title>
</svelte:head>

{#key data.industry.id}
  <IndustryPage industry={data.industry} />
{/key}
