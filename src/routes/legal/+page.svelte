<script lang="ts">
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import PageFrame from '$lib/ui/PageFrame.svelte';
  import { ArrowUpRightIcon } from 'phosphor-svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Overbase › Legal</title>
</svelte:head>

<PageFrame>
  <ContentMeasure as="section" width="narrow">
    <header>
      <p class="text-[14px] font-medium leading-none text-stone-500">
        Legal
      </p>

      <h1
        class="mt-[28px] font-heading text-[42px] font-medium leading-[1.05] text-stone-750"
      >
        Policies, terms and security
      </h1>

      <p
        class="mt-[20px] text-[16px] font-book leading-[1.55] text-stone-700 sm:text-[17px]"
      >
        Review the policies, terms and security materials that govern Overbase products and services
      </p>
    </header>

    <nav class="mt-[36px]" aria-label="Legal pages">
      {#each data.legalPages as legalPage (legalPage.slug)}
        <a
          href={legalPage.href}
          class="group flex items-center justify-between gap-8 border-b border-stone-200 py-[22px] text-stone-700 transition-colors hover:text-stone-900"
        >
          <span
            class="min-w-0 flex-1 font-book text-[17px] leading-[1.08] text-stone-750 transition-colors group-hover:text-stone-900"
          >
            {legalPage.title}
          </span>

          <ArrowUpRightIcon
            size={21}
            weight="regular"
            class="shrink-0 text-stone-500 transition-colors group-hover:text-stone-900"
            aria-hidden="true"
          />
        </a>
      {/each}
    </nav>
  </ContentMeasure>
</PageFrame>
