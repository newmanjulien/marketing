<script lang="ts">
  import LegalPage from '$lib/marketing/legal/LegalPage.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Overbase › {data.legalPage.title}</title>
</svelte:head>

<LegalPage page={data.legalPage} />
