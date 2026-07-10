<script lang="ts">
  import { CaretRightIcon } from 'phosphor-svelte';
  import { getSuccessRoomResourceLink } from '../domain/resources';
  import type { SuccessRoomBaseRoom, SuccessRoomResource } from '../domain/types';

  let {
    room,
    resource
  }: {
    room: SuccessRoomBaseRoom;
    resource: SuccessRoomResource;
  } = $props();

  const link = $derived(getSuccessRoomResourceLink(room, resource));
</script>

<a
  href={link.href}
  target={link.isRouted ? undefined : link.target}
  rel={link.isRouted ? undefined : link.rel}
  class="group flex min-h-[92px] w-full items-center justify-between gap-[38px] rounded-[8px] border border-stone-200 bg-white px-[22px] py-[24px] text-stone-900 shadow-[0_1px_4px_rgba(28,25,23,0.06)] outline-none transition-[border-color,box-shadow] duration-200 hover:border-stone-300 hover:shadow-[0_6px_14px_rgba(28,25,23,0.06)] focus-visible:ring-2 focus-visible:ring-stone-900/20 sm:gap-[48px] sm:px-[24px]"
  aria-label={resource.actionLabel}
>
  <span
    class="min-w-0 break-words text-[16px] font-book leading-[1.4] tracking-normal text-stone-750 transition-colors duration-200 group-hover:text-stone-900"
  >
    {resource.actionLabel}
  </span>

  <span
    class="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full border border-stone-300 text-stone-700 transition-colors duration-200 group-hover:bg-stone-100 group-hover:text-stone-900"
    aria-hidden="true"
  >
    <CaretRightIcon size={16} weight="bold" />
  </span>
</a>
