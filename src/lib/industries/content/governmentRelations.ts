import type { IndustryContentDefinition } from "../types";

export const governmentRelationsContent = {
  heading: "Overbase for GR firms",
  introParagraphs: [
    "Government relations firms have a large network of natural partners—data providers who track when clients need help, lawyers who pass along files, and headhunters who flag open roles where you can recommend your contacts",
    "These partnerships drive growth, but many opportunities never surface. Because everyone's data is trapped in separate systems",
  ],
  screenshots: {
    setup: {
      src: "/screenshots/government-relations1.png",
      alt: "Overbase add data source modal showing supported data source categories.",
      width: 2226,
      height: 1498,
    },
    opportunityGroups: [
      {
        emailFormat: {
          src: "/screenshots/government-relations2.png",
          alt: "Overbase generated opportunity email preview.",
          width: 2348,
          height: 1560,
        },
        opportunityEmail: {
          src: "/screenshots/government-relations3.png",
          alt: "Gmail opportunity email showing an attached insurance renewal report from Overbase.",
          width: 1408,
          height: 670,
        },
      },
    ],
  },
} satisfies IndustryContentDefinition;
