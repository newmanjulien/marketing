<script lang="ts">
  import { siteNavItems } from '$lib/data/siteNav';

  export let activePath = '/';
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
    {#each siteNavItems as item}
      <a
        href={item.href}
        class={`w-fit hover:text-stone-700 ${activePath === item.href ? 'text-stone-900' : ''}`}
      >
        {item.label}
      </a>
    {/each}
  </nav>
</aside>
