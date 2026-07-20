import type { IndustryPageContent } from "../types";
import { partnershipsIntroParagraph } from "./shared";

export const accountingContent = {
  heading: "Overbase for accounting",
  introParagraphs: [
    "Accountants have a large network of natural partners—advisory firms they form strategic alliances with, lawyers who refer potential clients, and boutique accounting firms that refer clients once they outgrow them",
    partnershipsIntroParagraph,
  ],
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
          alt: "Gmail opportunity email showing an attached report from Overbase.",
          width: 1408,
          height: 655,
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
          alt: "Gmail opportunity email showing an attached report from Overbase.",
          width: 1408,
          height: 699,
        },
      },
    ],
  },
} satisfies IndustryPageContent;
