<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import type { SurveyPost } from './surveyTypes';

  let { post }: { post: SurveyPost } = $props();
  let BodyComponent = $derived(post.bodyComponent);
</script>

<svelte:head>
  <meta name="description" content={post.description} />
</svelte:head>

<PageFrame>
  <ContentMeasure as="article" width="copy">
    <a
      href="/annual-survey"
      class="text-[14px] font-medium leading-none tracking-normal text-stone-500 transition-colors duration-200 hover:text-stone-900"
    >
      Survey
    </a>

    <header class="mt-[28px] border-b border-stone-200 pb-[34px]">
      <p class="text-[14px] font-book leading-none tracking-normal text-stone-500">
        {post.publishedAtLabel}
      </p>
      <h1
        class="mt-[18px] font-heading text-[32px] font-medium leading-[1.05] tracking-normal text-stone-900"
      >
        {post.title}
      </h1>
      <p class="mt-[20px] text-[16px] font-book leading-[1.55] tracking-normal text-stone-700">
        {post.introduction}
      </p>
    </header>

    <div class="mt-[38px]">
      <BodyComponent />
    </div>
  </ContentMeasure>
</PageFrame>
