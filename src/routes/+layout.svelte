<script lang="ts">
  import type { Snippet } from 'svelte';
  import SiteShell from '$lib/site/SiteShell.svelte';
  import '../app.css';

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <title>Overbase › Grow your practice</title>
</svelte:head>

<SiteShell>
  {@render children()}
</SiteShell>
