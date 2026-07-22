import { ScalesIcon } from "phosphor-svelte";

export const law = {
  id: "law",
  label: "Law firms",
  icon: ScalesIcon,
  summary:
    "See how lawyers grow their practice by turning their network into new clients and more business",
  heading: "Overbase for law firms",
  intro:
    "Law firms have a large network of natural partners—data providers who track when clients need legal help, other lawyers who pass along relevant cases, and headhunters who flag open roles where you can recommend your contacts",
  revenueOutcomeParagraphs: [
    "When a data provider flags a client facing legal exposure, or a fellow firm passes along a matter outside their practice, the opportunity comes straight to you",
    "You add new clients and matters without cold outreach, and referrals flow back to your partners. Your network becomes a steady pipeline of billable work",
  ],
  networkResults: {
    opportunities: { count: "31", rate: "72%" },
    newClients: { count: "26", rate: "59%" },
    moreBusiness: { count: "22", rate: "43%" },
  },
  ctaSubject: "law firms",
  ctaWorkPhrase: "lawyers work",
  scenarios: [
    {
      id: "opportunities",
      label: "1. Spot opportunities",
      description:
        "Overbase turns data vendors into business opportunities. We monitor your Bloomberg subscription and help you reach out to clients at just the right time. All by text message",
      message: `An activist hedge fund bought a 5% stake in ADP

Here's the discussion in a Bloomberg forum: https://blinks.bloomberg.com/rooms/IB_ROOM_ID_98725

You know ADP's COO Jim Watts. And your colleague Ray Velez knows Robert Barnes who is Head of Corp Dev

Want me to draft a message you can send to Jim?`,
    },
    {
      id: "referrals",
      label: "2. Get more referrals",
      description:
        "Overbase turns your relationships with other professionals into easy referrals. We analyze both sides' client meetings and propose opportunities for referrals. All by text message",
      message: `Travis at Maples and Calder has a client who is looking for counsel in New York

It's a commercial real estate acquisition. Details here: ob.link/95922

Let me know if you want Travis to propose an intro next time he talks to them`,
    },
    {
      id: "relationships",
      label: "3. Develop relationships",
      description:
        "Overbase turns your relationships with executive search firms into opportunities to place your contacts in key accounts. All by text message",
      message: `Nadia at Korn Ferry is starting a search for the GC job at PepsiCo

Details on the job post: ob.link/15289

Let me know if you or one of your colleagues have candidates you might introduce her to`,
    },
  ],
} as const;
