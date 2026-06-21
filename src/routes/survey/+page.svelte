<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <meta
    name="description"
    content="Notes from Overbase on partner data, shared sales workflows, and revenue collaboration."
  />
</svelte:head>

<PageFrame topPadding="standard">
  <ContentMeasure as="section" width="narrow">
    <header class="max-w-[620px]">
      <p class="text-[14px] font-medium leading-none tracking-normal text-stone-500">Survey</p>
      <h1
        class="mt-[14px] font-heading text-[32px] font-medium leading-[1.05] tracking-normal text-stone-900"
      >
        Most innovative CIOs of 2026
      </h1>
      <p class="mt-[20px] text-[16px] font-normal leading-[1.55] tracking-normal text-stone-700">
        Every summer, we survey the CIOs and the leadership of the best professional services firms
        to find out who are the most innovative CIOs in each industry
      </p>
    </header>

    <img
      src="/684997b8f748d8c055f3798d.avif"
      alt="Innovative CIO survey"
      class="mt-[34px] block w-full rounded-[8px] object-cover"
      loading="eager"
      decoding="async"
    />

    <div class="mt-[40px] divide-y divide-stone-200 border-y border-stone-200">
      {#each data.posts as post}
        <article class="py-[24px]">
          <a href={`/survey/${post.slug}`} class="group block">
            <div class="flex flex-col gap-[16px] md:flex-row md:items-start md:justify-between md:gap-[32px]">
              <div class="max-w-[560px]">
                <h2
                  class="font-heading text-[20px] font-medium leading-[1.2] tracking-normal text-stone-900 transition-colors duration-200 group-hover:text-stone-600"
                >
                  {post.title}
                </h2>
                <p class="mt-[10px] text-[16px] font-normal leading-[1.55] tracking-normal text-stone-600">
                  {post.description}
                </p>
              </div>
              <p class="shrink-0 text-[14px] font-normal leading-none tracking-normal text-stone-500">
                {post.publishedAtLabel}
              </p>
            </div>
          </a>
        </article>
      {/each}
    </div>
  </ContentMeasure>
</PageFrame>
