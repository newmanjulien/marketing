<script lang="ts">
  import type { Snippet } from 'svelte';
  import HomeSection from './HomeSection.svelte';

  let {
    title,
    body,
    children
  }: {
    title: string;
    body: string;
    children: Snippet;
  } = $props();
</script>

<HomeSection>
    <h2 class="font-heading text-[25px] font-book leading-[1.14] tracking-normal text-stone-750">
      {title}
    </h2>

    <p class="mt-[8px] max-w-[720px] text-[18px] font-book leading-[1.55] tracking-normal text-stone-500 sm:text-[17px]">
      {body}
    </p>

    <div class="mt-[30px]">
      {@render children()}
    </div>
</HomeSection>
