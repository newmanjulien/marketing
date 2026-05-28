import type { IndustryContentDefinition } from "../types";

export const marketingContent = {
  heading: "Overbase for marketing agencies",
  screenshots: {
    setup: {
      src: "/screenshots/marketing1.png",
      alt: "Overbase add data source modal showing supported data source categories.",
      width: 2224,
      height: 1488,
    },
    opportunityGroups: [
      {
        emailFormat: {
          src: "/screenshots/marketing2.png",
          alt: "Overbase generated opportunity email preview.",
          width: 2348,
          height: 1560,
        },
        opportunityEmail: {
          src: "/screenshots/marketing3.png",
          alt: "Gmail opportunity email showing an attached insurance renewal report from Overbase.",
          width: 1408,
          height: 677,
        },
      },
    ],
  },
} satisfies IndustryContentDefinition;
