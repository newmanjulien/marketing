<script lang="ts">
  import LegalPage from '$lib/legal/LegalPage.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<LegalPage page={data.legalPage} />
