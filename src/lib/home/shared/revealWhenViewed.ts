import type { Action } from 'svelte/action';

// The section is visible by default (markup ships with `is-viewed`) so content
// shows without JavaScript; the action removes the class and hands it to the
// observer. Brief intersections are debounced by the 45ms transition delay on
// `.is-viewed` in HomeSection — a class toggled off within that window never
// produces a visible change.
export const revealWhenViewed: Action<HTMLElement> = (node) => {
  if (!('IntersectionObserver' in window)) {
    return;
  }

  node.classList.remove('is-viewed');

  const observer = new IntersectionObserver(
    ([entry]) => node.classList.toggle('is-viewed', entry.isIntersecting),
    { rootMargin: '-8% 0px -8% 0px', threshold: 0.04 }
  );

  observer.observe(node);

  return {
    destroy: () => observer.disconnect()
  };
};
