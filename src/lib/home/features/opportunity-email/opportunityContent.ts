import type { HomeIndustryId } from "$lib/home/industryContent";

export type OpportunityScenario = {
  id: string;
  label: string; // dropdown label
  email: string; // email body (whitespace preserved)
  description: string; // sentence before the link, no trailing period
};

export type OpportunityIndustryContent = {
  linkTerm: string; // e.g. 'See how insurance brokers'
  scenarios: readonly [OpportunityScenario, ...OpportunityScenario[]]; // non-empty
};

// Placeholder copy for scenarios that don't have real content yet.
const loremEmail = `Hi there,

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`;

const loremDescription =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua";

export const opportunityContentByIndustryId = {
  insurance: {
    linkTerm: "See how insurance brokers",
    scenarios: [
      {
        id: "upsell",
        label: "Upsell existing clients",
        email: `Hi Stephen,

A whitespace analysis for the Exterra renewal is attached.

We identified new policies worth $400,000 which you might propose at your renewal meeting next month.

Each proposed policy has a benchmark. Those were calculated with data from Allianz and Chubb. The right people from both carriers are CCed.`,
        description:
          "Overbase used carrier data to let an insurance broker get the benchmarks they needed to help a client be fully insured",
      },
      {
        id: "new-business",
        label: "Win new clients",
        email: loremEmail,
        description: loremDescription,
      },
      {
        id: "retain",
        label: "Retain clients",
        email: loremEmail,
        description: loremDescription,
      },
    ],
  },

  law: {
    linkTerm: "See how law firms",
    scenarios: [
      {
        id: "upsell",
        label: "Upsell existing clients",
        email: `Hi Laura,

An activist hedge fund bought a 5% stake in ADP.

Here's the discussion in a Bloomberg forum: https://blinks.bloomberg.com/rooms/IB_ROOM_ID_98725

ADP is one of our 20 target accounts and it's Rob Rosenberg who is responsible for building the relationship. Rob is in touch with Joel Tennenberg at ADP.`,
        description:
          "Overbase monitored a law firm's Bloomberg to help one of their most connected lawyers reach out to a client at just the right time",
      },
      {
        id: "new-business",
        label: "Win new clients",
        email: loremEmail,
        description: loremDescription,
      },
    ],
  },

  "government-relations": {
    linkTerm: "See how GR firms",
    scenarios: [
      {
        id: "upsell",
        label: "Upsell existing clients",
        email: `Hi Ray,

Check out this new proposed tax credit program in Arizona:
https://azleg.gov/active-bills/5858hggj

The bill will be voted on in two weeks and there might be an opportunity to help Plug Power submit comments during rulemaking. Plug Power has 2 factories in Arizona.

Jackson Reinstein knows Plug Power's VP Strategy. And Sagar Agrawal knows their COO.`,
        description:
          "Overbase monitored a government relations firm's FiscalNote to spot a policy change that turned into a client engagement",
      },
      {
        id: "new-business",
        label: "Win new clients",
        email: loremEmail,
        description: loremDescription,
      },
    ],
  },

  consulting: {
    linkTerm: "See how consulting firms",
    scenarios: [
      {
        id: "upsell",
        label: "Upsell existing clients",
        email: `Hey Alex,

You're working on the JPMC pitch, and Jack London (CCed) in our NYC office has pitched them before.

I attached the PDF of the final proposal Jack submitted to them. As well as other docs which might give useful context for your pitch.

There's also a proposal our partner Thoughtworks submitted to them last month.`,
        description:
          "Overbase helped a consulting firm win pitches by bringing together the institutional knowledge that used to be hidden",
      },
      {
        id: "new-business",
        label: "Win new clients",
        email: loremEmail,
        description: loremDescription,
      },
      {
        id: "retain",
        label: "Retain clients",
        email: loremEmail,
        description: loremDescription,
      },
    ],
  },

  accounting: {
    linkTerm: "See how accounting firms",
    scenarios: [
      {
        id: "upsell",
        label: "Upsell existing clients",
        email: `Hi Shlok,

Our review of Linamar’s tax return suggests the client is expanding into Europe.

This may be an opportunity to help them assess Privacy & Data Protection considerations. Tax Partner Scott Duarte is the right person to connect with for details.

Topics to explore with Scott to understand the tax return: new sources of revenue outside of the US, increased travel activities in Europe, new professional services engagements in Europe.`,
        description:
          "Overbase securely analyzed a client's tax return to help an accounting firm spot a hidden opportunity to offer cyber services",
      },
      {
        id: "new-business",
        label: "Win new clients",
        email: loremEmail,
        description: loremDescription,
      },
      {
        id: "retain",
        label: "Retain clients",
        email: loremEmail,
        description: loremDescription,
      },
    ],
  },
} as const satisfies Record<HomeIndustryId, OpportunityIndustryContent>;
