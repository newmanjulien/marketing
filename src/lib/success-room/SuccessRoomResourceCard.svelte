<script lang="ts">
  import { getSuccessRoomResourceLink } from './successRooms';
  import type { SuccessRoom, SuccessRoomResource } from './successRoomTypes';

  let {
    room,
    resource
  }: {
    room: SuccessRoom;
    resource: SuccessRoomResource;
  } = $props();

  const link = $derived(getSuccessRoomResourceLink(room, resource));
</script>

<a
  href={link.href}
  target={link.isRouted ? undefined : link.target}
  rel={link.isRouted ? undefined : link.rel}
  class="group block w-full max-w-[324px] text-stone-900 outline-none"
  aria-label={`Open ${resource.title}`}
>
  <div
    class="flex aspect-[16/11] w-full items-center justify-center overflow-hidden rounded-[8px] border border-stone-200 bg-white p-[18px] shadow-[0_1px_4px_rgba(28,25,23,0.06)] transition-colors duration-200 group-hover:border-stone-300 group-focus-visible:ring-2 group-focus-visible:ring-stone-900/20"
  >
    <img
      src={resource.previewImageHref}
      alt=""
      class="max-h-full max-w-full object-contain"
      loading="lazy"
      decoding="async"
    />
  </div>

  <div class="mt-[16px] min-w-0">
    <div
      class="block break-words font-book text-[17px] leading-[1.08] tracking-normal text-stone-750 transition-colors group-hover:text-stone-900"
    >
      {resource.title}
    </div>
  </div>
</a>
