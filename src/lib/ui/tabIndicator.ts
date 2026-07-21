import type { Action } from 'svelte/action';

// Slides a highlight element to whichever child carries the matching
// `data-indicator-key`. The action measures that child relative to the
// container and exposes its box as CSS vars; the highlight animates purely in
// CSS off those vars, so the container just needs to render an element reading
// `--indicator-{x,y,width,height,opacity}`.
export const tabIndicator: Action<HTMLElement, string> = (node, initialKey) => {
  let key = initialKey;
  let frame = 0;
  const observer = new ResizeObserver(() => schedule());

  function measure() {
    const target = node.querySelector<HTMLElement>(`[data-indicator-key="${key}"]`);
    if (!target) {
      node.style.setProperty('--indicator-opacity', '0');
      return;
    }

    const navRect = node.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    node.style.setProperty('--indicator-x', `${rect.left - navRect.left}px`);
    node.style.setProperty('--indicator-y', `${rect.top - navRect.top}px`);
    node.style.setProperty('--indicator-width', `${rect.width}px`);
    node.style.setProperty('--indicator-height', `${rect.height}px`);
    node.style.setProperty('--indicator-opacity', '1');
  }

  function schedule() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(measure);
  }

  observer.observe(node);
  schedule();

  return {
    update(nextKey) {
      key = nextKey;
      schedule();
    },
    destroy() {
      cancelAnimationFrame(frame);
      observer.disconnect();
    }
  };
};
