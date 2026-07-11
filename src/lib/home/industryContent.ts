import {
  BankIcon,
  CalculatorIcon,
  HandshakeIcon,
  ScalesIcon,
  UmbrellaIcon,
} from "phosphor-svelte";
import {
  industryNavigationItems,
  type IndustryId,
  type IndustryNavigationItem,
} from "$lib/industries/industryNavigation";
import type { Component } from "svelte";

const homeIndustryIcons = {
  insurance: {
    icon: UmbrellaIcon,
  },
  law: {
    icon: ScalesIcon,
  },
  "government-relations": {
    icon: BankIcon,
  },
  consulting: {
    icon: HandshakeIcon,
  },
  accounting: {
    icon: CalculatorIcon,
  },
} as const satisfies Record<
  IndustryId,
  {
    icon: Component;
  }
>;

export const homeIndustries = industryNavigationItems.map((industry) => ({
  ...industry,
  ...homeIndustryIcons[industry.id],
})) satisfies ReadonlyArray<
  IndustryNavigationItem & {
    icon: Component;
  }
>;

export type HomeIndustry = (typeof homeIndustries)[number];
export type HomeIndustryId = HomeIndustry["id"];
