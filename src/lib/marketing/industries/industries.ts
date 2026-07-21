import { resolve } from '$app/paths';
import type { Component } from 'svelte';
import type { NetworkResultsData } from '$lib/marketing/network-results/NetworkResultsGraphic.svelte';
import { insurance } from './insurance';
import { law } from './law';
import { governmentRelations } from './government-relations';
import { consulting } from './consulting';
import { accounting } from './accounting';

export type Scenario = {
  id: string;
  label: string; // dropdown label
  description: string; // caption under the conversation graphic, no trailing period
  message: string; // blank-line-separated paragraphs; each becomes a chat bubble
};

// The shape each industry data module (./insurance.ts, …) must export.
// Adding an industry = create its module and add it to `definitions`.
type IndustryDefinition = {
  id: string;
  label: string;
  icon: Component;
  summary: string;
  heading: string;
  intro: string;
  // The closing outcome section: shared heading, hand-written per industry.
  revenueOutcomeParagraphs: readonly string[];
  // Numbers for the results graphic in the closing section (one per funnel row).
  networkResults: NetworkResultsData;
  // Subject completing the bottom CTA heading "Built for ___" (e.g. "insurance brokers").
  ctaSubject: string;
  // Subject + verb completing "Overbase is made for how ___" (e.g. "brokers work", "GR works").
  ctaWorkPhrase: string;
  scenarios: readonly Scenario[];
};

const definitions = [
  insurance,
  law,
  governmentRelations,
  consulting,
  accounting
] satisfies readonly IndustryDefinition[];

export type IndustryId = (typeof definitions)[number]['id'];

export const industries = definitions.map((industry) => ({
  ...industry,
  href: resolve('/industries/[industryId=industryId]', { industryId: industry.id })
}));

export type Industry = (typeof industries)[number];

export const industriesById = Object.fromEntries(
  industries.map((industry) => [industry.id, industry])
) as Record<IndustryId, Industry>;

export const isIndustryId = (value: string): value is IndustryId =>
  Object.hasOwn(industriesById, value);
