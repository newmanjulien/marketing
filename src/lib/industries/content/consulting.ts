import type { IndustryPageContent } from "../types";
import { partnershipsIntroParagraph } from "./shared";

export const consultingContent = {
  heading: "Overbase for consulting firms",
  introParagraphs: [
    "Consulting firms have a large network of natural partners—technology vendors, other practice areas within your own firm whose clients have adjacent needs, and private equity firms that refer portfolio companies",
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
          src: "/screenshots/consulting2_1.png",
          alt: "Overbase generated opportunity email preview.",
          width: 2348,
          height: 1560,
        },
        opportunityEmail: {
          src: "/screenshots/consulting3_1.png",
          alt: "Gmail opportunity email showing an attached report from Overbase.",
          width: 1408,
          height: 723,
        },
      },
    ],
  },
} satisfies IndustryPageContent;
