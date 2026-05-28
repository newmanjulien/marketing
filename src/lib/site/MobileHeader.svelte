<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { ListIcon, XIcon } from 'phosphor-svelte';
  import MobileMenu from './MobileMenu.svelte';

  let open = $state(false);
  const MenuIcon = $derived(open ? XIcon : ListIcon);
  const menuIconSize = $derived(open ? 25 : 26);

  afterNavigate(() => {
    open = false;
  });
</script>

<header class="fixed left-0 top-0 z-30 flex h-[50px] w-full items-center justify-between bg-white px-[20px] md:hidden">
  <a href="/" class="h-[27px] w-[45px]" aria-label="Home">
    <img src="/logo.png" alt="" class="h-full w-full object-contain" />
  </a>

  <button
    type="button"
    class="-mr-[4px] inline-flex h-[38px] w-[38px] items-center justify-center text-stone-950"
    aria-label={open ? 'Close menu' : 'Open menu'}
    aria-expanded={open}
    onclick={() => (open = !open)}
  >
    <MenuIcon size={menuIconSize} weight="regular" />
  </button>

  {#if open}
    <MobileMenu />
  {/if}
</header>
