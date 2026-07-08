<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import MobileMenuToggleIcon from './MobileMenuToggleIcon.svelte';
  import MobileMenu from './MobileMenu.svelte';

  let open = $state(false);

  afterNavigate(() => {
    open = false;
  });
</script>

<header
  class="z-layer-chrome sticky top-0 flex h-[var(--site-mobile-header-height)] w-full items-center justify-between bg-white px-[20px] lg:hidden"
>
  <a href="/" class="h-[27px] w-[45px]" aria-label="Home">
    <img src="/logo.png" alt="" class="h-full w-full object-contain" />
  </a>

  <button
    type="button"
    class="-mr-[4px] inline-flex h-[38px] w-[38px] items-center justify-center text-stone-950"
    aria-label={open ? 'Close menu' : 'Open menu'}
    aria-expanded={open}
    aria-controls="mobile-menu"
    onclick={() => (open = !open)}
  >
    <MobileMenuToggleIcon {open} />
  </button>

  {#if open}
    <MobileMenu />
  {/if}
</header>
