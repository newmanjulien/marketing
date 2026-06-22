import type { IndustryContentDefinition } from "../types";

export const governmentRelationsContent = {
  heading: "Overbase for GR firms",
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
          height: 677,
        },
      },
    ],
  },
} satisfies IndustryContentDefinition;
