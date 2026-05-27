<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    topPadding = 'standard',
    children
  }: {
    topPadding?: 'standard' | 'compact';
    children: Snippet;
  } = $props();

  const topPaddingClasses = {
    standard: 'pt-[74px] md:pt-[43px]',
    compact: 'pt-[43px]'
  };
</script>

<main class={['px-[22px] pb-[120px] md:px-0', topPaddingClasses[topPadding]]}>
  {@render children()}
</main>
