export const industryProofTimeline = {
  enterEase: 'cubic-bezier(0.22, 1, 0.36, 1)',
  labelEnterStartDelayMs: 1800,
  labelEnterStaggerMs: 95,
  labelEnterDurationMs: 360,
  detailDelayAfterLabelsMs: 800,
  detailEnterDurationMs: 320,
  autoAdvanceIntervalMs: 4_000
} as const;

export const ms = (value: number) => `${value}ms`;

export const getHeroIndustryLabelEnterAtMs = (index: number) =>
  industryProofTimeline.labelEnterStartDelayMs +
  index * industryProofTimeline.labelEnterStaggerMs;

const getHeroIndustryLabelsEnteredAtMs = (industryCount: number) =>
  getHeroIndustryLabelEnterAtMs(Math.max(0, industryCount - 1)) +
  industryProofTimeline.labelEnterDurationMs;

export const getHeroIndustryDetailEnterAtMs = (industryCount: number) =>
  getHeroIndustryLabelsEnteredAtMs(industryCount) +
  industryProofTimeline.detailDelayAfterLabelsMs;

export const getHeroIndustryAutoAdvanceStartDelayMs = (industryCount: number) =>
  getHeroIndustryDetailEnterAtMs(industryCount) +
  industryProofTimeline.detailEnterDurationMs;
