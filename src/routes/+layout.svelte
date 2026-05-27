<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import SiteShell from '$lib/site/SiteShell.svelte';
  import '../app.css';

  let currentHash = '';

  $: if (browser && $page.url) {
    currentHash = window.location.hash;
  }
</script>

<svelte:window
  on:hashchange={() => {
    currentHash = window.location.hash;
  }}
/>

<SiteShell activePath={$page.url.pathname} currentUrl={$page.url} {currentHash}>
  <slot />
</SiteShell>
