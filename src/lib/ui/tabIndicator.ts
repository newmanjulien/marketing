import type { Attachment } from 'svelte/attachments';

// Slides a highlight element to whichever child carries the matching
// `data-indicator-key`. The attachment measures that child relative to the
// container and exposes its box as CSS vars; the highlight animates purely in
// CSS off those vars, so the container just needs to render an element reading
// `--indicator-{x,y,width,height,opacity}`. The attachment re-runs whenever
// `key` changes; teardown intentionally leaves the CSS vars behind so the
// highlight animates from the old tab to the new one.
export function tabIndicator(key: string): Attachment<HTMLElement> {
  return (node) => {
    let frame = 0;
    const observer = new ResizeObserver(schedule);

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

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  };
}
