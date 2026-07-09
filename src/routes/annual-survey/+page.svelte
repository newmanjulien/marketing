<script lang="ts">
  import LandingPage from '$lib/survey/pages/LandingPage.svelte';
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();
</script>

<LandingPage {form} />
