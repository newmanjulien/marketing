import { BankIcon } from 'phosphor-svelte';

export const governmentRelations = {
  id: 'government-relations',
  label: 'Government relations',
  icon: BankIcon,
  summary:
    'See how GR professionals grow their practice by turning their network into new clients and more business',
  heading: 'Overbase for GR firms',
  intro:
    'Government relations firms have a large network of natural partners—data providers who track when clients need help, lawyers who pass along files, and headhunters who flag open roles where you can recommend your contacts',
  revenueOutcomeParagraphs: [
    'When shared data surfaces a client who suddenly needs advocacy, that engagement is routed to you first',
    'You land new retainers and mandates without chasing them, while lawyers and data providers in your network send opportunities your way. It compounds into a durable book of policy work'
  ],
  networkResults: {
    opportunities: { count: '29', rate: '69%' },
    newClients: { count: '23', rate: '55%' },
    moreBusiness: { count: '19', rate: '38%' }
  },
  ctaSubject: 'government relations',
  ctaWorkPhrase: 'GR works',
  scenarios: [
    {
      id: 'opportunities',
      label: '1. Spot opportunities',
      description:
        'Overbase turns data vendors into business opportunities. We monitor your FiscalNote and help you reach out to clients at just the right time. All by text message',
      message: `Check out this new proposed tax credit program in Arizona:
https://azleg.gov/active-bills/5858hggj

The bill will be voted on in two months and there might be an opportunity to help Plug Power submit comments during rulemaking

You know Jackson Reinstein, Plug Power's VP Strategy. Want me to draft a message you can send to him?`
    },
    {
      id: 'referrals',
      label: '2. Get more referrals',
      description:
        "Overbase turns your relationships with other professionals into easy referrals. We analyze both sides' client meetings and propose opportunities for referrals. All by text message",
      message: `Sophia at Cadwalader has a client facing a regulatory issue under California's new tax rules

Details here: ob.link/62921

Let me know if you want Sophia to propose an intro next time she talks to them`
    },
    {
      id: 'relationships',
      label: '3. Develop relationships',
      description:
        'Overbase turns your relationships with executive search firms into opportunities to place your contacts in key accounts. All by text message',
      message: `Elena at Korn Ferry is starting a search for the Head of Government Affairs job at Rivian

Details on the job post: ob.link/23985

Let me know if you or one of your colleagues have candidates you might introduce her to`
    }
  ]
} as const;
