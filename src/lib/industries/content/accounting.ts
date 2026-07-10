import type { IndustryContentDefinition } from "../types";

export const accountingContent = {
  heading: "Overbase for accounting",
  screenshots: {
    setup: {
      src: "/screenshots/consulting1.png",
      alt: "Overbase add data source modal showing supported data source categories.",
      width: 2226,
      height: 1500,
    },
    opportunityGroups: [
      {
        emailFormat: {
          src: "/screenshots/accounting2_1.png",
          alt: "Overbase generated opportunity email preview.",
          width: 2348,
          height: 1560,
        },
        opportunityEmail: {
          src: "/screenshots/accounting3_1.png",
          alt: "Gmail opportunity email showing an attached insurance renewal report from Overbase.",
          width: 1408,
          height: 709,
        },
      },
      {
        emailFormat: {
          src: "/screenshots/accounting2_2.png",
          alt: "Overbase generated opportunity email preview.",
          width: 2348,
          height: 1560,
        },
        opportunityEmail: {
          src: "/screenshots/accounting3_2.png",
          alt: "Gmail opportunity email showing an attached insurance renewal report from Overbase.",
          width: 1408,
          height: 699,
        },
      },
    ],
  },
} satisfies IndustryContentDefinition;
