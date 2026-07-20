import { accountingContent } from "./content/accounting";
import { consultingContent } from "./content/consulting";
import { governmentRelationsContent } from "./content/governmentRelations";
import { insuranceContent } from "./content/insurance";
import { lawContent } from "./content/law";
import type { IndustryId } from "./industryNavigation";
import type { IndustryPageContent } from "./types";

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

export const industryPages = {
  insurance: insuranceContent,
  law: lawContent,
  "government-relations": governmentRelationsContent,
  consulting: consultingContent,
  accounting: accountingContent,
} as const satisfies Record<IndustryId, IndustryPageContent>;
