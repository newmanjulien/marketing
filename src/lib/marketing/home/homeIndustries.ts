import { BankIcon, CalculatorIcon, HandshakeIcon, ScalesIcon, UmbrellaIcon } from 'phosphor-svelte';
import {
  industries,
  type IndustryId
} from '$lib/marketing/industries/industryContent';
import type { Component } from 'svelte';

const homeIndustryIcons = {
  insurance: UmbrellaIcon,
  law: ScalesIcon,
  'government-relations': BankIcon,
  consulting: HandshakeIcon,
  accounting: CalculatorIcon
} as const satisfies Record<IndustryId, Component>;

export const homeIndustries = industries.map((industry) => ({
  ...industry,
  icon: homeIndustryIcons[industry.id]
}));

export type HomeIndustry = (typeof homeIndustries)[number];
