<script lang="ts">
  import { ArrowUpRightIcon } from 'phosphor-svelte';
  import type { ContentLink, ContentParagraph, ContentSection } from './contentTypes';

  export let title: string;
  export let description: string;
  export let heading: string;
  export let introParagraphs: ContentParagraph[];
  export let links: ContentLink[] = [];
  export let sections: ContentSection[] = [];

  const inlineLinkClasses =
    'font-normal text-stone-500 underline decoration-stone-300 decoration-1 underline-offset-[3px] hover:text-stone-900';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

<main class="px-[22px] pb-[120px] pt-[74px] md:px-0 md:pt-[43px]">
  <section class="mx-auto w-full max-w-[680px]">
    <h1 class="font-heading text-[32px] font-medium leading-[1.05] tracking-normal text-stone-900">
      {heading}
    </h1>

    <div class="mt-[24px] flex max-w-[620px] flex-col gap-[22px]">
      {#each introParagraphs as paragraph}
        <p class="text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700">
          {#each paragraph as segment}
            {#if segment.href}
              <a href={segment.href} class={inlineLinkClasses}>
                {segment.text}
              </a>
            {:else}
              {segment.text}
            {/if}
          {/each}
        </p>
      {/each}
    </div>

    {#if links.length > 0}
      <nav class="mt-[42px]" aria-label="Page links">
        {#each links as link}
          <a
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            class="flex items-center justify-between gap-8 border-b border-stone-200/70 py-[24px] text-[15px] font-normal leading-none tracking-normal text-stone-700 transition-colors hover:text-stone-900 md:text-[16px]"
          >
            <span>{link.label}</span>
            <ArrowUpRightIcon size={21} weight="regular" class="shrink-0 text-stone-900" aria-hidden="true" />
          </a>
        {/each}
      </nav>
    {/if}
  </section>

  {#each sections as section}
    <section class="mx-auto mt-[64px] w-full max-w-[680px] pb-[96px]">
      <p class="max-w-[620px] text-[15px] font-normal leading-[1.55] tracking-normal text-stone-700 md:text-[16px]">
        {section.body}
      </p>
    </section>
  {/each}
</main>
