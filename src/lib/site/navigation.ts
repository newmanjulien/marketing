import type { PortalAuthRoute } from "$lib/portalAuthLinks";

export type NavLinkItem = {
  label: string;
  href: string;
};

export const productNavItems = [
  { label: "Pricing", href: "/pricing" },
  { label: "Survey", href: "/annual-survey" },
] satisfies NavLinkItem[];

export const companyNavItems = [
  { label: "About", href: "/about" },
] satisfies NavLinkItem[];

export const footerNavItems = [
  ...companyNavItems,
  { label: "Legal", href: "/legal" },
] satisfies NavLinkItem[];

export const mobilePrimaryNavItems = [...productNavItems, ...companyNavItems] satisfies NavLinkItem[];

export const authNavItems = [
  { label: "Log in", authRoute: "login", variant: "secondary" },
  { label: "Join", authRoute: "join", variant: "primary" },
] satisfies {
  label: string;
  authRoute: PortalAuthRoute;
  variant: "primary" | "secondary";
}[];
