import { accountingContent } from "./content/accounting";
import { consultingContent } from "./content/consulting";
import { governmentRelationsContent } from "./content/governmentRelations";
import { insuranceContent } from "./content/insurance";
import { lawContent } from "./content/law";
import type { IndustryId } from "./industryNavigation";
import type {
  IndustryContentDefinition,
  IndustryPageContent,
  IndustryPageSections,
} from "./types";

const sharedSectionCopy: IndustryPageSections = {
  setup: {
    id: "setup",
    heading: "Connect sales data",
    body: "Both you and your partners securely connect sales data from wherever it lives. You stay in full control of who accesses what data",
  },
  emailFormat: {
    id: "emailFormat",
    heading: "Design a custom email format",
    body: "Design a custom email format that perfectly matches your unique business. Your team keeps working how they currently work",
  },
  opportunityEmail: {
    id: "opportunityEmail",
    heading: "Receive opportunities by email",
    body: "Your team receives emails with actionable revenue opportunities right in their inbox. No new dashboard or tools to learn",
  },
} as const;

const industryPages = {
  insurance: insuranceContent,
  law: lawContent,
  "government-relations": governmentRelationsContent,
  consulting: consultingContent,
  accounting: accountingContent,
} as const satisfies Record<IndustryId, IndustryContentDefinition>;

const isIndustryId = (industryId: string): industryId is IndustryId =>
  Object.hasOwn(industryPages, industryId);

export const getIndustryPageContent = (
  industryId: string,
): IndustryPageContent | null => {
  if (!isIndustryId(industryId)) {
    return null;
  }

  return {
    ...industryPages[industryId],
    sections: sharedSectionCopy,
  };
};
