import type { Attachment } from 'svelte/attachments';

// The section is visible by default (markup ships with `is-viewed`) so content
// shows without JavaScript; the attachment removes the class and hands it to
// the observer. Brief intersections are debounced by the 45ms transition delay
// on `.is-viewed` in FeatureSection — a class toggled off within that window
// never produces a visible change.
export const revealWhenViewed: Attachment<HTMLElement> = (node) => {
  node.classList.remove('is-viewed');

  const observer = new IntersectionObserver(
    // Entries are delivered oldest-first and crossings can batch into one
    // callback; only the newest entry reflects the element's current state.
    (entries) => node.classList.toggle('is-viewed', entries.at(-1)!.isIntersecting),
    { rootMargin: '-8% 0px -8% 0px', threshold: 0.04 }
  );

  observer.observe(node);

  return () => observer.disconnect();
};
