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
    standard: 'max-w-[740px]',
    narrow: 'max-w-[680px]',
    wide: 'max-w-[820px]',
    copy: 'max-w-[600px]'
  };
</script>

<svelte:element this={as} class={['mx-auto w-full', widthClasses[width], className]}>
  {@render children()}
</svelte:element>
