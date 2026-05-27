<script lang="ts">
  import { page } from '$app/state';
  import { primaryNavItems } from './navigation';

  const activePath = $derived(page.url.pathname);
</script>

<aside class="fixed left-[54px] top-[36px] hidden md:block" aria-label="Primary">
  <a
    href="/"
    class="mb-[28px] block h-[25px] w-[41px]"
    aria-label="Home"
  >
    <img src="/logo.png" alt="" class="h-full w-full object-contain" />
  </a>

  <nav class="flex flex-col gap-[15px] text-[13.5px] font-normal leading-none text-stone-500">
    {#each primaryNavItems as item (item.href)}
      <a
        href={item.href}
        class={[
          'w-fit hover:text-stone-700',
          { 'text-stone-900': activePath === item.href }
        ]}
        aria-current={activePath === item.href ? 'page' : undefined}
      >
        {item.label}
      </a>
    {/each}
  </nav>
</aside>
