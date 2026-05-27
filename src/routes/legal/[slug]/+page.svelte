<script lang="ts">
  import LegalPage from '$lib/legal/LegalPage.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<LegalPage page={data.legalPage} />
