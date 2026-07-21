<script lang="ts">
  import SiteShell from '$lib/marketing/site/SiteShell.svelte';
  import '../app.css';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<SiteShell>
  {@render children()}
</SiteShell>
