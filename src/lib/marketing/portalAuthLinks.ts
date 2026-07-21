export type PortalAuthRoute = 'login' | 'join';

const PORTAL_ORIGIN = 'https://portal.overbase.app';
const MARKETING_ORIGIN = 'https://overbase.app';

export function createPortalAuthUrl(route: PortalAuthRoute, marketingPath: string) {
  // Reject absolute and protocol-relative ("//host") paths so returnTo can
  // only point back into the marketing site.
  const isSafeRelativePath = marketingPath.startsWith('/') && !marketingPath.startsWith('//');
  const returnUrl = new URL(isSafeRelativePath ? marketingPath : '/', MARKETING_ORIGIN);
  const url = new URL(`/${route}`, PORTAL_ORIGIN);

  url.searchParams.set('returnTo', returnUrl.href);

  return url.href;
}
