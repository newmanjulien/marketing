<script lang="ts">
  import DesktopHeaderActions from '$lib/marketing/site/DesktopHeaderActions.svelte';
  import DesktopSideMenu from '$lib/marketing/site/DesktopSideMenu.svelte';
  import Footer from '$lib/marketing/site/Footer.svelte';
  import MobileHeader from '$lib/marketing/site/MobileHeader.svelte';
  import '../app.css';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
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
