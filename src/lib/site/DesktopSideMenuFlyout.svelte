<script lang="ts">
  import { page } from '$app/state';
  import { CaretRightIcon } from 'phosphor-svelte';
  import type { NavLinkItem } from './navigation';

  let {
    label,
    href,
    links,
  }: {
    label: string;
    href: string;
    links: readonly NavLinkItem[];
  } = $props();

  const activePath = $derived(page.url.pathname);
</script>

<div class="group relative w-fit">
  <a
    {href}
    class="flex items-center gap-[6px] text-stone-700 outline-none hover:text-stone-900 focus-visible:text-stone-900"
    aria-haspopup="true"
  >
    <span>{label}</span>
    <CaretRightIcon
      class="transition-transform duration-150 group-hover:rotate-90 group-focus-within:rotate-90"
      size={13}
      weight="regular"
      aria-hidden="true"
    />
  </a>

  <div
    class="z-layer-chrome-popover pointer-events-none absolute left-0 top-full w-[214px] pt-[10px] opacity-0 transition delay-100 duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:delay-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-focus-within:delay-0"
  >
    <div class="flex flex-col gap-[13px] rounded-[8px] bg-stone-50 px-[14px] py-[13px] shadow-[0_4px_12px_rgba(28,25,23,0.035)] ring-1 ring-stone-200/60">
      {#each links as link (link.href)}
        <a
          href={link.href}
          class={[
            'block text-[14px] font-book leading-none text-stone-700 hover:text-stone-900 focus-visible:text-stone-900 focus-visible:outline-none',
            { 'text-stone-900': activePath === link.href }
          ]}
          aria-current={activePath === link.href ? 'page' : undefined}
        >
          {link.label}
        </a>
      {/each}
    </div>
  </div>
</div>
