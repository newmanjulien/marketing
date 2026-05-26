<script lang="ts">
  import { List, X } from 'phosphor-svelte';
  import MobileMenu from './MobileMenu.svelte';

  export let activePath = '/';
  export let currentUrl: URL;
  export let currentHash = '';

  let open = false;

  $: MenuIcon = open ? X : List;
  $: menuIconSize = open ? 25 : 26;
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
    on:click={() => (open = !open)}
  >
    <svelte:component this={MenuIcon} size={menuIconSize} weight="regular" />
  </button>

  {#if open}
    <MobileMenu {activePath} {currentUrl} {currentHash} />
  {/if}
</header>
