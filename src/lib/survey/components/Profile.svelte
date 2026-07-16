<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    label,
    title,
    imageSrc,
    imageAlt,
    caption,
    children
  }: {
    label: string;
    title: string;
    imageSrc: string;
    imageAlt: string;
    caption: string;
    children: Snippet;
  } = $props();
</script>

<section class="flex flex-col gap-[12px] sm:gap-[14px]">
  <p class="m-0 text-[15px] font-book uppercase leading-none tracking-normal text-stone-500">
    {label}
  </p>
  <h2 class="m-0 font-heading text-[26px] font-medium leading-[1.14] text-stone-900 sm:text-[29px]">
    {title}
  </h2>

  <figure class="mt-[6px] flex flex-col gap-[8px]">
    <img class="block h-auto w-full rounded-[6px]" src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" />
    <figcaption class="text-[14px] font-book leading-[1.35] text-stone-500">{caption}</figcaption>
  </figure>

  <div class="mt-[4px] flex flex-col gap-[14px] text-[17px] font-book leading-[1.55] text-stone-700 [&_p]:m-0">
    {@render children()}
  </div>
</section>
