import { PUBLIC_CONVEX_URL } from '$env/static/public';
import { ConvexHttpClient } from 'convex/browser';

export { PUBLIC_CONVEX_URL };

export const convex = new ConvexHttpClient(PUBLIC_CONVEX_URL);
