<script lang="ts">
  import type { Snippet } from 'svelte';

  type ContentMeasureElement = 'article' | 'div' | 'section';
  type ContentMeasureWidth = 'standard' | 'narrow' | 'wide' | 'copy';
  type ContentMeasureAlign = 'left' | 'center';

  let {
    as = 'div',
    width = 'standard',
    align = 'left',
    children,
    class: className
  }: {
    as?: ContentMeasureElement;
    width?: ContentMeasureWidth;
    align?: ContentMeasureAlign;
    children: Snippet;
    class?: string;
  } = $props();

  const widthClasses = {
    standard: 'max-w-[740px]',
    narrow: 'max-w-[680px]',
    wide: 'max-w-[820px]',
    copy: 'max-w-[600px]'
  };

  const alignClasses = {
    left: '',
    center: 'text-center'
  };
</script>

<svelte:element
  this={as}
  class={['mx-auto w-full', widthClasses[width], alignClasses[align], className]}
>
  {@render children()}
</svelte:element>
