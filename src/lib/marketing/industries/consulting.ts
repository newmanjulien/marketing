import { HandshakeIcon } from "phosphor-svelte";

export const consulting = {
  id: "consulting",
  label: "Consulting firms",
  icon: HandshakeIcon,
  summary:
    "See how consultants grow their practice by turning their network into new clients and more business",
  heading: "Overbase for consulting firms",
  intro:
    "Consulting firms have a large network of natural partners—technology vendors, other practice areas within your own firm whose clients have adjacent needs, and private equity firms that refer portfolio companies",
  revenueOutcomeParagraphs: [
    "When a technology vendor, a private equity firm, or an adjacent practice area spots a client need, that engagement comes to you first",
    "You open new accounts and expand current ones without prospecting, and referrals flow both ways. Your alliances become a reliable source of new project revenue",
  ],
  networkResults: {
    opportunities: { count: "42", rate: "78%" },
    newClients: { count: "33", rate: "64%" },
    moreBusiness: { count: "29", rate: "47%" },
  },
  ctaHeading: "Built for consulting firms",
  ctaWorkPhrase: "consultants work",
  scenarios: [
    {
      id: "pitches",
      label: "1. Win more pitches",
      description:
        "Overbase turns what your network knows into winning pitches. We bring together the institutional knowledge from your colleagues and from alliance partners. All by text message",
      message: `You're working on the JPMC pitch, and Jack London (CCed) in our NYC office has pitched them before.

I attached the PDF of the final proposal Jack submitted to them, plus the meeting notes from that engagement.

There's also a proposal our alliance partner Thoughtworks submitted to them last month.`,
    },
    {
      id: "referrals",
      label: "2. Get more referrals",
      description:
        "Overbase turns your relationships with other professionals into easy referrals. We analyze both sides' client meetings and propose opportunities for referrals. All by text message",
      message: `Henri at Marsh has a client who is looking for a new CRM implementation

Details here: ob.link/48213

Let me know if you want Henri to propose an intro next time he talks to them`,
    },
    {
      id: "recruiters",
      label: "3. Develop relationships",
      description:
        "Overbase turns your relationships with executive search firms into opportunities to place your contacts in key accounts. All by text message",
      message: `Marcus at Heidrick & Struggles is starting a search for the COO job at Nestlé

Details on the job post: ob.link/70614

Let me know if you or one of your colleagues have candidates you might introduce him to`,
    },
  ],
} as const;
