import { consultingContent } from './content/consulting';
import { governmentRelationsContent } from './content/governmentRelations';
import { insuranceContent } from './content/insurance';
import { lawContent } from './content/law';
import { techContent } from './content/tech';
import type {
  IndustryContentDefinition,
  IndustryPageContent,
  IndustryPageSections,
} from './types';

const sharedIntroParagraphs = [
  "Selling with ecosystem partners should create a steady stream of warm, high-fit opportunities that are easier to start and faster to close",
  "But in practice, partnerships rarely work cleanly. Coordination is hard, overlap is hidden, and incentives get in the way. Overbase changes that",
] as const;

const sharedSectionCopy: IndustryPageSections = {
  setup: {
    id: "setup",
    heading: "Share data",
    body: "Both you and your partners securely share sales data from wherever it lives. You stay in full control of what accesses what data",
  },
  emailFormat: {
    id: "emailFormat",
    heading: "Design email formats",
    body: "Pick what insight you want your team to receive by email. Then design custom email formats that perfectly match how your team is already selling",
  },
  opportunityEmail: {
    id: "opportunityEmail",
    heading: "Get opportunities by email",
    body: "Your team receives emails with actionable revenue opportunities right in their inbox. Nicely packaged up and with the right people CCed",
  },
} as const;

const industryPages = {
  insurance: insuranceContent,
  law: lawContent,
  "government-relations": governmentRelationsContent,
  consulting: consultingContent,
  tech: techContent,
} as const satisfies Record<string, IndustryContentDefinition>;

type IndustryPageId = keyof typeof industryPages;

const isIndustryPageId = (industryId: string): industryId is IndustryPageId =>
  industryId in industryPages;

export const getIndustryPageContent = (
  industryId: string,
): IndustryPageContent | null => {
  if (!isIndustryPageId(industryId)) {
    return null;
  }

  const page: IndustryContentDefinition = industryPages[industryId];

  return {
    heading: page.heading,
    introParagraphs: sharedIntroParagraphs,
    sections: sharedSectionCopy,
    screenshots: page.screenshots,
  };
};
