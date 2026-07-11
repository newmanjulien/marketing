import type { Action } from 'svelte/action';

const revealDelayMs = 45;
const observerRootMargin = '-8% 0px -8% 0px';
const observerThreshold = 0.04;

export const revealWhenViewed: Action<HTMLElement> = (node) => {
  let observer: IntersectionObserver | undefined;
  let revealTimer: ReturnType<typeof setTimeout> | undefined;

  const clearRevealTimer = () => {
    if (revealTimer) {
      clearTimeout(revealTimer);
      revealTimer = undefined;
    }
  };

  const hideSection = () => {
    clearRevealTimer();
    node.classList.remove('is-viewed');
  };

  const showSection = () => {
    clearRevealTimer();
    revealTimer = setTimeout(() => {
      node.classList.add('is-viewed');
      revealTimer = undefined;
    }, revealDelayMs);
  };

  if (!('IntersectionObserver' in window)) {
    node.classList.add('is-viewed');
  } else {
    hideSection();

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          showSection();
        } else {
          hideSection();
        }
      },
      {
        rootMargin: observerRootMargin,
        threshold: observerThreshold
      }
    );

    observer.observe(node);
  }

  return {
    destroy() {
      clearRevealTimer();
      observer?.disconnect();
    }
  };
};
