<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';

  let { title, body, children }: { title: string; body: Snippet; children: Snippet } = $props();

  // `viewed` starts true so the markup ships with `is-viewed` and content
  // shows without JavaScript; the attachment flips it off and lets an
  // IntersectionObserver on the section drive it from then on. Brief
  // intersections are debounced by the 45ms transition delay
  // on `.is-viewed` in the style block below — a class toggled off within
  // that window never produces a visible change.
  let viewed = $state(true);

  const revealWhenViewed: Attachment = (node) => {
    viewed = false;

    const observer = new IntersectionObserver(
      // Entries are delivered oldest-first and crossings can batch into one
      // callback; only the newest entry reflects the element's current state.
      (entries) => (viewed = entries.at(-1)!.isIntersecting),
      { rootMargin: '-8% 0px', threshold: 0.04 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  };
</script>

<section class="reveal px-[18px] sm:px-8" class:is-viewed={viewed} {@attach revealWhenViewed}>
  <ContentMeasure>
    <h2 class="font-heading text-[25px] font-book leading-[1.14] text-stone-750">
      {title}
    </h2>

    <p class="mt-[8px] max-w-[720px] text-[18px] font-book leading-[1.55] text-stone-500/80">
      {@render body()}
    </p>

    <div class="mt-[30px]">
      {@render children()}
    </div>
  </ContentMeasure>
</section>

<style>
  .reveal {
    opacity: 0;
    transition:
      opacity 700ms ease-out,
      visibility 0ms linear 700ms;
    visibility: hidden;
    will-change: opacity;
  }

  .reveal.is-viewed {
    opacity: 1;
    transition:
      opacity 700ms ease-out 45ms,
      visibility 0ms linear 45ms;
    visibility: visible;
  }

  @media (prefers-reduced-motion: reduce) {
    .reveal,
    .reveal.is-viewed {
      transition: none;
    }
  }
</style>
