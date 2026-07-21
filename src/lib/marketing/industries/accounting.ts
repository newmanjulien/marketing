import { CalculatorIcon } from "phosphor-svelte";

export const accounting = {
  id: "accounting",
  label: "Accounting firms",
  icon: CalculatorIcon,
  summary:
    "See how accountants grow their practice by turning their network into new clients and more business",
  heading: "Overbase for accounting",
  intro:
    "Accountants have a large network of natural partners—advisory firms they form strategic alliances with, lawyers who refer potential clients, and boutique accounting firms that refer clients once they outgrow them",
  revenueOutcomeParagraphs: [
    "When an advisory partner or a referring lawyer sees a client who needs your services, the introduction lands with you first",
    "You bring on new clients without chasing leads, and you send opportunities back to your partners. Strategic alliances turn into a steady stream of new engagements and recurring fees",
  ],
  networkResults: {
    opportunities: { count: "34", rate: "71%" },
    newClients: { count: "28", rate: "58%" },
    moreBusiness: { count: "25", rate: "44%" },
  },
  ctaHeading: "Built for accounting firms",
  ctaWorkPhrase: "accountants work",
  scenarios: [
    {
      id: "upsell",
      label: "1. Upsell current clients",
      description:
        "Overbase turns the work your colleagues in other departments are doing into easy upselling. We securely analyze clients docs to spot hidden opportunities. All by text message",
      message: `Our review of Linamar’s tax return suggests they're expanding into Europe

This may be an opportunity to help with Privacy & Data Protection considerations. Tax Partner Scott Duarte is the right person to connect with for details

Topics to explore with Scott to understand the tax return: new sources of revenue outside of the US and increased travel to Europe`,
    },
    {
      id: "referrals",
      label: "2. Get more referrals",
      description:
        "Overbase turns your relationships with other professionals into easy referrals. We analyze both sides' client meetings and propose opportunities for referrals. All by text message",
      message: `Samantha at JPMC has a client who has an upcoming liquidity event

Details here: ob.link/75961

Let me know if you want Samantha to propose an intro next time she talks to them`,
    },
    {
      id: "recruiters",
      label: "3. Develop relationships",
      description:
        "Overbase turns your relationships with executive search firms into opportunities to place your contacts in key accounts. All by text message",
      message: `Priya at Spencer Stuart is starting a search for the CFO job at Kellanova

Details on the job post: ob.link/48372

Let me know if you or one of your colleagues have candidates you might introduce her to`,
    },
  ],
} as const;
