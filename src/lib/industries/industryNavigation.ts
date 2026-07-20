export const industryNavigationItems = [
  { id: "insurance", label: "Insurance broker", href: "/industries/insurance" },
  { id: "law", label: "Law firm", href: "/industries/law" },
  {
    id: "government-relations",
    label: "Government Relations",
    href: "/industries/government-relations",
  },
  {
    id: "consulting",
    label: "Consulting firm",
    href: "/industries/consulting",
  },
  {
    id: "accounting",
    label: "Accounting firm",
    href: "/industries/accounting",
  },
] as const;

export type IndustryNavigationItem = (typeof industryNavigationItems)[number];
export type IndustryId = IndustryNavigationItem["id"];

export const industryIds = industryNavigationItems.map((item) => item.id);

export const isIndustryId = (value: string): value is IndustryId =>
  industryIds.includes(value as IndustryId);
