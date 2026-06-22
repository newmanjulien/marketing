export const industryNavigationItems = [
  { id: "insurance", label: "Insurance", href: "/industries/insurance" },
  { id: "law", label: "Law", href: "/industries/law" },
  {
    id: "government-relations",
    label: "Government Relations",
    href: "/industries/government-relations",
  },
  { id: "consulting", label: "Consulting", href: "/industries/consulting" },
  { id: "tech", label: "Tech consulting", href: "/industries/tech" },
] as const;

export type IndustryNavigationItem = (typeof industryNavigationItems)[number];
export type IndustryId = IndustryNavigationItem["id"];

export const getIndustryHref = (industryId: IndustryId) =>
  industryNavigationItems.find((industry) => industry.id === industryId)?.href ??
  `/industries/${industryId}`;
