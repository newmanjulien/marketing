<script lang="ts">
  import LegalPage from '$lib/components/legal/LegalPage.svelte';

  export let data;
</script>

<LegalPage page={data.legalPage} />
