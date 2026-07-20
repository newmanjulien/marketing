<script lang="ts">
  import { page } from '$app/state';
  import { industryNavigationItems } from '$lib/industries/industryNavigation';
  import DesktopSideMenuFlyout from './DesktopSideMenuFlyout.svelte';
  import { productNavItems } from './navigation';

  const activePath = $derived(page.url.pathname);
</script>

<aside class="z-layer-chrome fixed left-[54px] top-[36px] hidden lg:block" aria-label="Primary">
  <a
    href="/"
    class="mb-[28px] block h-[25px] w-[41px]"
    aria-label="Home"
  >
    <img src="/logo.png" alt="" class="h-full w-full object-contain" />
  </a>

  <nav class="flex flex-col gap-[15px] text-[15px] font-book leading-none text-stone-700">
    <DesktopSideMenuFlyout label="Industries" href="/industries" links={industryNavigationItems} />

    {#each productNavItems as item (item.label)}
      <a
        href={item.href}
        class={[
          'w-fit hover:text-stone-900',
          { 'text-stone-900': activePath === item.href }
        ]}
        aria-current={activePath === item.href ? 'page' : undefined}
      >
        {item.label}
      </a>
    {/each}
  </nav>
</aside>
