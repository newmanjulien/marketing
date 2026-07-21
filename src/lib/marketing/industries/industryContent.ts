import { resolve } from "$app/paths";

const industries = [
  { id: "insurance", label: "Insurance broker" },
  { id: "law", label: "Law firm" },
  { id: "government-relations", label: "Government Relations" },
  { id: "consulting", label: "Consulting firm" },
  { id: "accounting", label: "Accounting firm" },
] as const;

export const industryNavigationItems = industries.map((industry) => ({
  ...industry,
  href: resolve("/industries/[industryId=industryId]", { industryId: industry.id }),
}));

export type IndustryId = (typeof industries)[number]["id"];

export const industryIds = industries.map((industry) => industry.id);

export const isIndustryId = (value: string): value is IndustryId =>
  industryIds.includes(value as IndustryId);

type IndustryScreenshot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type IndustryScreenshotGroup = {
  emailFormat: IndustryScreenshot;
  opportunityEmail: IndustryScreenshot;
};

export type IndustryPageContent = {
  heading: string;
  introParagraphs: readonly string[];
  screenshots: {
    setup: IndustryScreenshot;
    opportunityGroups: readonly IndustryScreenshotGroup[];
  };
};

// The three how-it-works sections read the same on every industry page; only
// the heading, intro, and screenshots vary per industry.
export const industrySectionCopy = {
  setup: {
    heading: "Connect sales data",
    body: "Both you and your partners securely connect sales data from wherever it lives. You stay in full control of who accesses what data",
  },
  emailFormat: {
    heading: "Design a custom email format",
    body: "Design a custom email format that perfectly matches your unique business. Your team keeps working how they currently work",
  },
  opportunityEmail: {
    heading: "Receive opportunities by email",
    body: "Your team receives emails with actionable revenue opportunities right in their inbox. No new dashboard or tools to learn",
  },
} as const;

const partnershipsIntroParagraph =
  "These partnerships drive growth, but many opportunities never surface. Because everyone's data is trapped in separate systems";

export const industryPages = {
  insurance: {
    heading: "Overbase for insurance brokers",
    introParagraphs: [
      "Commercial insurance brokers have a large network of natural partners—carriers who can help spot new coverage needs, law and accounting firms that see great referral leads, and industry associations with built-in members",
      partnershipsIntroParagraph,
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
  },
  law: {
    heading: "Overbase for law firms",
    introParagraphs: [
      "Law firms have a large network of natural partners—data providers who track when clients need legal help, other lawyers who pass along relevant cases, and headhunters who flag open roles where you can recommend your contacts",
      partnershipsIntroParagraph,
    ],
    screenshots: {
      setup: {
        src: "/screenshots/law1.png",
        alt: "Overbase add data source modal showing supported data source categories.",
        width: 2216,
        height: 1470,
      },
      opportunityGroups: [
        {
          emailFormat: {
            src: "/screenshots/law2_1.png",
            alt: "Overbase generated opportunity email preview.",
            width: 2348,
            height: 1560,
          },
          opportunityEmail: {
            src: "/screenshots/law3_1.png",
            alt: "Gmail opportunity email showing an attached report from Overbase.",
            width: 1408,
            height: 657,
          },
        },
        {
          emailFormat: {
            src: "/screenshots/law2_2.png",
            alt: "Overbase generated opportunity email preview.",
            width: 2348,
            height: 1560,
          },
          opportunityEmail: {
            src: "/screenshots/law3_2.png",
            alt: "Gmail opportunity email showing an attached report from Overbase.",
            width: 1408,
            height: 694,
          },
        },
      ],
    },
  },
  "government-relations": {
    heading: "Overbase for GR firms",
    introParagraphs: [
      "Government relations firms have a large network of natural partners—data providers who track when clients need help, lawyers who pass along files, and headhunters who flag open roles where you can recommend your contacts",
      partnershipsIntroParagraph,
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
            alt: "Gmail opportunity email showing an attached report from Overbase.",
            width: 1408,
            height: 670,
          },
        },
      ],
    },
  },
  consulting: {
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
  },
  accounting: {
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
  },
} as const satisfies Record<IndustryId, IndustryPageContent>;
