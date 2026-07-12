export type PortalAuthRoute = 'login' | 'join';

const PORTAL_ORIGIN = 'https://portal.overbase.app';
const MARKETING_ORIGIN = 'https://overbase.app';

function isSafeRelativePath(path: string) {
  return path.startsWith('/') && !path.startsWith('//');
}

function createMarketingReturnUrl(path: string) {
  if (!isSafeRelativePath(path)) {
    return new URL('/', MARKETING_ORIGIN).href;
  }

  return new URL(path, MARKETING_ORIGIN).href;
}

function createPortalAuthUrl(route: PortalAuthRoute, marketingReturnUrl: string) {
  const url = new URL(`/${route}`, PORTAL_ORIGIN);
  url.searchParams.set('returnTo', marketingReturnUrl);
  return url.href;
}

export function createPortalAuthUrlForMarketingPath(route: PortalAuthRoute, marketingPath: string) {
  return createPortalAuthUrl(route, createMarketingReturnUrl(marketingPath));
}

export function createPortalAuthUrlForCurrentPage(route: PortalAuthRoute, pageUrl: URL) {
  const returnPath = `${pageUrl.pathname}${pageUrl.search}${pageUrl.hash}`;
  return createPortalAuthUrl(route, createMarketingReturnUrl(returnPath));
}
