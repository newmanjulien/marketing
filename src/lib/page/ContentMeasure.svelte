<script lang="ts">
  import type { Snippet } from 'svelte';

  type ContentMeasureElement = 'article' | 'div' | 'section';
  type ContentMeasureWidth = 'standard' | 'narrow' | 'copy';

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
    standard: 'max-w-[702px]',
    narrow: 'max-w-[648px]',
    copy: 'max-w-[576px]'
  };
</script>

<svelte:element this={as} class={['mx-auto w-full', widthClasses[width], className]}>
  {@render children()}
</svelte:element>
