import type { PortalAuthRoute } from "$lib/marketing/portalAuthLinks";

export type NavLinkItem = {
  label: string;
  href: string;
};

export const productNavItems = [
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
] satisfies NavLinkItem[];

export const authNavItems = [
  { label: "Log in", authRoute: "login", variant: "secondary" },
  { label: "Join", authRoute: "join", variant: "primary" },
] satisfies {
  label: string;
  authRoute: PortalAuthRoute;
  variant: "primary" | "secondary";
}[];
