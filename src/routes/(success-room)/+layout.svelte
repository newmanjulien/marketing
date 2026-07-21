<script lang="ts">
  import { page } from '$app/state';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <title>Overbase › {page.data.room.prospectName}</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{@render children()}
