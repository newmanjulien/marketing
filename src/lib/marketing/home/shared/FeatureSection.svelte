<script lang="ts">
  import type { Snippet } from 'svelte';
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import { revealWhenViewed } from './revealWhenViewed';

  let {
    title,
    body,
    children
  }: {
    title: string;
    body: string;
    children: Snippet;
  } = $props();
</script>

<section class="home-view-reveal is-viewed px-[18px] sm:px-8" {@attach revealWhenViewed}>
  <ContentMeasure>
    <h2 class="font-heading text-[25px] font-book leading-[1.14] tracking-normal text-stone-750">
      {title}
    </h2>

    <p class="mt-[8px] max-w-[720px] text-[19px] font-book leading-[1.55] tracking-normal text-stone-500/80 sm:text-[18px]">
      {body}
    </p>

    <div class="mt-[30px]">
      {@render children()}
    </div>
  </ContentMeasure>
</section>

<style>
  .home-view-reveal {
    opacity: 0;
    transition:
      opacity 700ms ease-out,
      visibility 0ms linear 300ms;
    visibility: hidden;
    will-change: opacity;
  }

  .home-view-reveal.is-viewed {
    opacity: 1;
    transition:
      opacity 700ms ease-out 45ms,
      visibility 0ms linear 45ms;
    visibility: visible;
  }

  @media (prefers-reduced-motion: reduce) {
    .home-view-reveal,
    .home-view-reveal.is-viewed {
      transition: none;
    }
  }
</style>
