<script lang="ts">
  import type { Snippet } from 'svelte';

  type ContentMeasureElement = 'article' | 'div' | 'section';
  type ContentMeasureWidth = 'standard' | 'narrow' | 'wide' | 'copy';

  let {
    as = 'div',
    width = 'standard',
    children,
    class: className
  }: {
    as?: ContentMeasureElement;
    width?: ContentMeasureWidth;
    children: Snippet;
    class?: string;
  } = $props();

  const widthClasses = {
    standard: 'max-w-[780px]',
    narrow: 'max-w-[720px]',
    wide: 'max-w-[860px]',
    copy: 'max-w-[640px]'
  };
</script>

<svelte:element this={as} class={['mx-auto w-full', widthClasses[width], className]}>
  {@render children()}
</svelte:element>
