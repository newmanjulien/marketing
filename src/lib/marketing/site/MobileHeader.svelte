<script lang="ts">
  import { afterNavigate } from '$app/navigation';
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
    <span class="relative block h-[26px] w-[26px]" aria-hidden="true">
      <span class="line line-top"></span>
      <span class="line line-bottom"></span>
    </span>
  </button>

  {#if open}
    <MobileMenu />
  {/if}
</header>

<style>
  .line {
    position: absolute;
    left: 3px;
    top: 50%;
    width: 20px;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
    transform-origin: center;
    transition: transform 260ms ease;
  }

  .line-top {
    transform: translateY(-4px) rotate(0deg);
  }

  .line-bottom {
    transform: translateY(4px) rotate(0deg);
  }

  button[aria-expanded='true'] .line-top {
    transform: translateY(0) rotate(45deg);
  }

  button[aria-expanded='true'] .line-bottom {
    transform: translateY(0) rotate(-45deg);
  }

  @media (prefers-reduced-motion: reduce) {
    .line {
      transition-duration: 1ms;
    }
  }
</style>
