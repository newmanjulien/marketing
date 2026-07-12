import { accountingContent } from "./content/accounting";
import { consultingContent } from "./content/consulting";
import { governmentRelationsContent } from "./content/governmentRelations";
import { insuranceContent } from "./content/insurance";
import { lawContent } from "./content/law";
import type {
  IndustryContentDefinition,
  IndustryPageContent,
  IndustryPageSections,
} from "./types";

const sharedSectionCopy: IndustryPageSections = {
  setup: {
    id: "setup",
    heading: "Share data",
    body: "Both you and your partners securely share sales data from wherever it lives. You stay in full control of what accesses what data",
  },
  emailFormat: {
    id: "emailFormat",
    heading: "Design email formats",
    body: "Pick what insight you want your team to receive by email. Then design custom email formats that perfectly match how your team already operates",
  },
  opportunityEmail: {
    id: "opportunityEmail",
    heading: "Receive opportunities by email",
    body: "Your team receives emails with actionable revenue opportunities right in their inbox. Nicely packaged up and with the right people CCed",
  },
} as const;

const industryPages = {
  insurance: insuranceContent,
  law: lawContent,
  "government-relations": governmentRelationsContent,
  consulting: consultingContent,
  accounting: accountingContent,
} as const satisfies Record<string, IndustryContentDefinition>;

type IndustryPageId = keyof typeof industryPages;

const isIndustryPageId = (industryId: string): industryId is IndustryPageId =>
  Object.hasOwn(industryPages, industryId);

export const getIndustryPageContent = (
  industryId: string,
): IndustryPageContent | null => {
  if (!isIndustryPageId(industryId)) {
    return null;
  }

  return {
    ...industryPages[industryId],
    sections: sharedSectionCopy,
  };
};
