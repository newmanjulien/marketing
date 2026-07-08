<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    children,
    class: className
  }: {
    children: Snippet;
    class?: string;
  } = $props();
</script>

<main class={['px-[22px] pb-[120px] pt-[var(--page-frame-top-space)] sm:px-0', className]}>
  {@render children()}
</main>
