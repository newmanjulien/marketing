export const industryNavigationItems = [
  { id: "insurance", label: "Insurance", href: "/industries/insurance" },
  { id: "law", label: "Law", href: "/industries/law" },
  {
    id: "government-relations",
    label: "GR",
    href: "/industries/government-relations",
  },
  { id: "consulting", label: "Consulting", href: "/industries/consulting" },
  { id: "accounting", label: "Accounting", href: "/industries/accounting" },
] as const;

export type IndustryNavigationItem = (typeof industryNavigationItems)[number];
export type IndustryId = IndustryNavigationItem["id"];
