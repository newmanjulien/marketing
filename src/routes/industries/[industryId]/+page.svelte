<script lang="ts">
  import IndustryPage from '$lib/industries/IndustryPage.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

{#key data.industryId}
  <IndustryPage content={data.content} />
{/key}
