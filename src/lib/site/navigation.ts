import type { PortalAuthRoute } from '$lib/portalAuthLinks';

export type SiteNavItem = {
  label: string;
  href: string;
};

export type HeaderActionItem = {
  label: string;
  authRoute: PortalAuthRoute;
  variant: 'primary' | 'secondary';
};

export const siteNavItems: SiteNavItem[] = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Careers', href: '/careers' },
  { label: 'About', href: '/about' },
];

export const headerActionItems: HeaderActionItem[] = [
  { label: 'Log in', authRoute: 'login', variant: 'secondary' },
  { label: 'Join', authRoute: 'join', variant: 'primary' },
];
