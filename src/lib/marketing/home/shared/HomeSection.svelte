<script lang="ts">
  import type { Snippet } from 'svelte';
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import { revealWhenViewed } from './revealWhenViewed';

  let {
    children
  }: {
    children: Snippet;
  } = $props();
</script>

<section class="home-view-reveal is-viewed px-[18px] sm:px-8" {@attach revealWhenViewed}>
  <ContentMeasure>
    {@render children()}
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
