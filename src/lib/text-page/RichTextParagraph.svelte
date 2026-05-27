<script lang="ts">
  import type { RichTextParagraph } from './textPageTypes';

  let { paragraph }: { paragraph: RichTextParagraph } = $props();

  const inlineLinkClasses =
    'font-normal text-stone-500 underline decoration-stone-300 decoration-1 underline-offset-[3px] hover:text-stone-900';
</script>

<p class="text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700">
  {#if typeof paragraph === 'string'}
    {paragraph}
  {:else}
    {#each paragraph as segment}
      {#if segment.href}
        <a href={segment.href} class={inlineLinkClasses}>
          {segment.text}
        </a>
      {:else}
        {segment.text}
      {/if}
    {/each}
  {/if}
</p>
