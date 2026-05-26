<script lang="ts">
  import DesktopHeaderActions from './DesktopHeaderActions.svelte';
  import DesktopSideMenu from './DesktopSideMenu.svelte';
  import Footer from './Footer.svelte';
  import MobileHeader from './MobileHeader.svelte';

  export let activePath = '/';
  export let currentUrl: URL;
  export let currentHash = '';
</script>

<div class="flex min-h-[100dvh] flex-col bg-[var(--site-bg)]">
  <DesktopSideMenu {activePath} />
  <DesktopHeaderActions {currentUrl} {currentHash} />
  <MobileHeader {activePath} {currentUrl} {currentHash} />
  <div class="flex-1">
    <slot />
  </div>
  <Footer />
</div>
