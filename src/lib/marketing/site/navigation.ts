export type NavLinkItem = {
  label: string;
  href: string;
};

export const productNavItems = [
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
] satisfies NavLinkItem[];
