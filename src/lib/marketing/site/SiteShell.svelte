<script lang="ts">
  import type { Snippet } from 'svelte';
  import DesktopHeaderActions from './DesktopHeaderActions.svelte';
  import DesktopSideMenu from './DesktopSideMenu.svelte';
  import Footer from './Footer.svelte';
  import MobileHeader from './MobileHeader.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-[100dvh] flex-col bg-[var(--site-bg)]">
  <DesktopSideMenu />
  <DesktopHeaderActions />
  <MobileHeader />
  <div class="flex-1">
    {@render children()}
  </div>
  <Footer />
</div>
