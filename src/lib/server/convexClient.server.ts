import { PUBLIC_CONVEX_SITE_URL, PUBLIC_CONVEX_URL } from '$env/static/public';
import { ConvexHttpClient } from 'convex/browser';

export const createConvexClient = () => new ConvexHttpClient(PUBLIC_CONVEX_URL);
export const convexSiteUrl = PUBLIC_CONVEX_SITE_URL;
