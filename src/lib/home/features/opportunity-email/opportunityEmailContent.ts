import {
  homeIndustries,
  type HomeIndustry,
  type HomeIndustryId,
} from "../../industryContent";

const renewalOpportunityEmail = `Hi Stephen,

A whitespace analysis for the Exterra renewal is attached.

We identified new policies worth $400,000 which you might propose at your renewal meeting next month.

Each proposed policy has a benchmark. Those were calculated with data from Allianz and Chubb. The right people from both carriers are CCed.`;

const lawFirmOpportunityEmail = `Hi Shayne,
Hi Laura,

An activist hedge fund bought a 5% stake in ADP.

You might want to see if this could be relevant to one of your attorneys, Shayne. And to one of your bankers, Laura.

Discussion in a Bloomberg forum:
https://blinks.bloomberg.com/rooms/IB_ROOM_ID_98725`;

const financeOpportunityEmail = `Hi Laura,
Hi Shayne,

An activist hedge fund bought a 5% stake in ADP.

You might want to see if this could be relevant to one of your bankers, Laura. And to one of your attorneys, Shayne.

Discussion in a Bloomberg forum:
https://blinks.bloomberg.com/rooms/IB_ROOM_ID_98725`;

const consultingOpportunityEmail = `Hi Amira,

You have a meeting with Juan Mendoza at PepsiCo. And as you know, Nicolas is encouraging folks to "bring the firm" to meetings when possible.

You might consider inviting Ajay Agrawal from the tech team who could help PepsiCo identify cyber challenges.

Food and Beverage has seen a rise in cyber needs in the past quarter. They've also purchased more cyber from Datadog and other partners.`;

const techOpportunityEmail = `Hi Ethan,

A few people from the Chevron account mentioned 'legacy identity systems' in recent calls. They also mentioned authentication delays on calls with Microsoft and other partners.

This may be a cue to discuss identity modernization. And you might check out these recordings:

https://gong.io/c/492047116583921046
https://gong.io/c/305819475021384759`;

const marketingOpportunityEmail = `Hi Ram,

A few people from the Walmart account mentioned 'site migration' in recent calls. They also mentioned this on calls with Salesforce and other partners.

This may be a cue to discuss SEO migration support. And you might check out these recordings:

https://gong.io/c/749201847502910472
https://gong.io/c/305819475021384759`;

const opportunityEmailByIndustryId = {
  insurance: renewalOpportunityEmail,
  law: lawFirmOpportunityEmail,
  finance: financeOpportunityEmail,
  consulting: consultingOpportunityEmail,
  tech: techOpportunityEmail,
  marketing: marketingOpportunityEmail,
} as const satisfies Record<HomeIndustryId, string>;

export type OpportunityIndustry = HomeIndustry & {
  email: string;
};

export type OpportunityIndustryId = HomeIndustryId;

export const opportunityIndustries = homeIndustries.map((industry) => ({
  ...industry,
  email: opportunityEmailByIndustryId[industry.id],
})) satisfies readonly OpportunityIndustry[];
