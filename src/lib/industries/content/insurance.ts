import type { IndustryContentDefinition } from "../types";

export const insuranceContent = {
  heading: "Overbase for insurance brokers",
  introParagraphs: [
    "Commercial insurance brokers have a large network of natural partners—carriers who can help spot new coverage needs, law and accounting firms that see great referral leads, and industry associations with built-in members",
    "These partnerships drive growth, but many opportunities never surface. Because everyone's data is trapped in separate systems",
  ],
  screenshots: {
    setup: {
      src: "/screenshots/insurance1.png",
      alt: "Overbase add data source modal showing supported data source categories.",
      width: 2220,
      height: 1500,
    },
    opportunityGroups: [
      {
        emailFormat: {
          src: "/screenshots/insurance2.png",
          alt: "Overbase generated opportunity email preview.",
          width: 2348,
          height: 1560,
        },
        opportunityEmail: {
          src: "/screenshots/insurance3.png",
          alt: "Gmail opportunity email showing an attached insurance renewal report from Overbase.",
          width: 1408,
          height: 655,
        },
      },
    ],
  },
} satisfies IndustryContentDefinition;
