import { cubicOut } from 'svelte/easing';
import { prefersReducedMotion } from 'svelte/motion';
import type { TransitionConfig } from 'svelte/transition';

const accordionMotion = {
  openDurationMs: 360,
  closeDurationMs: 200,
  panelMarginTopPx: 16,
  openOvershoot: 0.018,
  openSettleStart: 0.84
} as const;

const getAccordionOpenProgress = (t: number) => {
  if (t < accordionMotion.openSettleStart) {
    return cubicOut(t / accordionMotion.openSettleStart) * (1 + accordionMotion.openOvershoot);
  }

  const settleProgress =
    (t - accordionMotion.openSettleStart) / (1 - accordionMotion.openSettleStart);

  return 1 + accordionMotion.openOvershoot * (1 - cubicOut(settleProgress));
};

export const mutualSuccessPlanOpen = (node: Element): TransitionConfig => {
  const height = node.scrollHeight;
  const reducedMotion = prefersReducedMotion.current;

  return {
    duration: reducedMotion ? 1 : accordionMotion.openDurationMs,
    css: (t) => {
      const progress = reducedMotion ? t : getAccordionOpenProgress(t);

      return `
        height: ${height * progress}px;
        margin-top: ${accordionMotion.panelMarginTopPx * Math.min(progress, 1)}px;
        overflow: hidden;
      `;
    }
  };
};

export const mutualSuccessPlanClose = (node: Element): TransitionConfig => {
  const height = node.scrollHeight;
  const reducedMotion = prefersReducedMotion.current;

  return {
    duration: reducedMotion ? 1 : accordionMotion.closeDurationMs,
    easing: cubicOut,
    css: (t) => `
      height: ${height * t}px;
      margin-top: ${accordionMotion.panelMarginTopPx * t}px;
      overflow: hidden;
    `
  };
};
