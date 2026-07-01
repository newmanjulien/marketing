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

const homeIndustryMetadata = {
  insurance: {
    icon: UmbrellaIcon,
    heroProofLabel: "See how insurance brokers use Overbase",
  },
  law: {
    icon: ScalesIcon,
    heroProofLabel: "See how law firms use Overbase",
  },
  "government-relations": {
    icon: BankIcon,
    heroProofLabel: "See how GR firms use Overbase",
  },
  consulting: {
    icon: HandshakeIcon,
    heroProofLabel: "See how consulting firms use Overbase",
  },
  accounting: {
    icon: CalculatorIcon,
    heroProofLabel: "See how accounting firms use Overbase",
  },
} as const satisfies Record<
  IndustryId,
  {
    icon: Component;
    heroProofLabel: string;
  }
>;

export const homeIndustries = industryNavigationItems.map((industry) => ({
  ...industry,
  ...homeIndustryMetadata[industry.id],
})) satisfies ReadonlyArray<
  IndustryNavigationItem & {
    icon: Component;
    heroProofLabel: string;
  }
>;

export type HomeIndustry = (typeof homeIndustries)[number];
export type HomeIndustryId = HomeIndustry["id"];
