import {
  BankIcon,
  DesktopTowerIcon,
  HandshakeIcon,
  MegaphoneIcon,
  ScalesIcon,
  UmbrellaIcon,
} from "phosphor-svelte";
import type { Component } from "svelte";

const renewalOpportunityEmail = `Hi Stephen,

The report for the upcoming Exterra renewal is attached.

We identified new policies worth $400,000 which you might propose to them at your renewal meeting next month.

Each proposed policy has a benchmark and those were calculated with data from Allianz and Chubb. The right people from both carriers are CCed.`;

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

You have an upcoming meeting with Juan Mendoza at PepsiCo. As you know, Nicolas has been encouraging folks to "bring the firm" to this type of meeting.

Assuming that it's appropriate to bring someone, you might consider Ajay Agrawal from the tech team who could help identify cyber challenges.

The Food and Beverage industry has seen a sharp rise in cyber issues in the past quarter. And they've been purchasing more cyber services from Datadog and other partners.`;

const itOpportunityEmail = `Hi Ethan,

A few different people from the Chevron account have mentioned 'legacy identity systems' in recent calls.

They also mentioned authentication delays on calls with Microsoft and other partners.

This may or may not be a cue to discuss identity modernization or managed access governance. But you might want to check out the recordings.

https://gong.io/c/492047116583921046
https://gong.io/c/305819475021384759`;

const marketingOpportunityEmail = `Hi Ram,

A few different people from the Walmart account have mentioned 'site migration' in recent calls.

They also mentioned this on calls with Salesforce and other partners.

This may or may not be a cue to sell SEO migration support. But you might want to check out the recordings.

https://gong.io/c/749201847502910472
https://gong.io/c/305819475021384759`;

export const opportunityIndustries = [
  {
    id: "insurance",
    label: "Insurance",
    icon: UmbrellaIcon,
    email: renewalOpportunityEmail,
  },
  {
    id: "law",
    label: "Law",
    icon: ScalesIcon,
    email: lawFirmOpportunityEmail,
  },
  {
    id: "finance",
    label: "Finance",
    icon: BankIcon,
    email: financeOpportunityEmail,
  },
  {
    id: "consulting",
    label: "Consulting",
    icon: HandshakeIcon,
    email: consultingOpportunityEmail,
  },
  {
    id: "it",
    label: "IT",
    icon: DesktopTowerIcon,
    email: itOpportunityEmail,
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: MegaphoneIcon,
    email: marketingOpportunityEmail,
  },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  icon: Component;
  email: string;
}>;

export type OpportunityIndustry = (typeof opportunityIndustries)[number];
export type OpportunityIndustryId = OpportunityIndustry["id"];
