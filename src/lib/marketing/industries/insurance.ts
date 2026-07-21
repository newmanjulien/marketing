import { UmbrellaIcon } from "phosphor-svelte";

export const insurance = {
  id: "insurance",
  label: "Insurance brokers",
  icon: UmbrellaIcon,
  summary:
    "See how insurance brokers grow their practice by turning their network into new clients and more business",
  heading: "Overbase for insurance brokers",
  intro:
    "Commercial insurance brokers have a large network of natural partners—carriers who can help spot new coverage needs, law and accounting firms that see great referral leads, and industry associations with built-in members",
  revenueOutcomeParagraphs: [
    "When a partner spots a coverage gap or an upcoming renewal in your shared data, that lead lands with you first",
    "You win new commercial accounts you would never have heard about, while your carriers and referral partners send business back your way. Every connection compounds into more premium under management",
  ],
  networkResults: {
    opportunities: { count: "46", rate: "76%" },
    newClients: { count: "38", rate: "61%" },
    moreBusiness: { count: "34", rate: "49%" },
  },
  ctaHeading: "Built for insurance brokers",
  ctaWorkPhrase: "brokers work",
  scenarios: [
    {
      id: "upsell",
      label: "1. Upsell current clients",
      description:
        "Overbase turns carrier relationships into easy upselling. We use data from carriers to get the benchmarks that let you easily upsell clients. Then we send it to you by text message",
      message: `We did the whitespace analysis for your renewal meeting with Exterra

Check it out: ob.link/75758

We found potential new policies worth $400,000. Each policy has a benchmark that was calculated with data from Allianz`,
    },
    {
      id: "referrals",
      label: "2. Get more referrals",
      description:
        "Overbase turns your relationships with other professionals into easy referrals. We analyze both sides' client meetings and propose opportunities for referrals. All by text message",
      message: `John at EY has a tax client who is launching a new mining project

Details here: ob.link/85966

Let me know if you want John to propose an intro next time he talks to them`,
    },
    {
      id: "recruiters",
      label: "3. Develop relationships",
      description:
        "Overbase turns your relationships with executive search firms into opportunities to place your contacts in key accounts. All by text message",
      message: `Tom at Spencer Stuart is starting a search for the CFO job at Carrier

Details on the job post: ob.link/61047

Let me know if you or one of your colleagues have candidates you might introduce him to`,
    },
  ],
} as const;
