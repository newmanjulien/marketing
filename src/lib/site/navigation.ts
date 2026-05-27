import type { PortalAuthRoute } from '$lib/portalAuthLinks';

export const primaryNavItems = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Careers', href: '/careers' },
  { label: 'About', href: '/about' },
] satisfies { label: string; href: string }[];

export const authNavItems = [
  { label: 'Log in', authRoute: 'login', variant: 'secondary' },
  { label: 'Join', authRoute: 'join', variant: 'primary' },
] satisfies { label: string; authRoute: PortalAuthRoute; variant: 'primary' | 'secondary' }[];
