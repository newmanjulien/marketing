// Thrown as ConvexError data by the Convex backend and matched by the
// SvelteKit server to decide when a stale access cookie should be cleared.
export const successRoomAccessDeniedCode = 'Success room access denied';

// Thrown as ConvexError data when a routed resource exists but is not enabled
// for the room; the resource page load maps it to a 404.
export const successRoomResourceNotEnabledCode = 'Success room resource is not enabled';

// Single source of truth for how long access lasts: Convex session rows and
// the SvelteKit session cookie must expire together.
export const successRoomSessionLifetimeMs = 30 * 24 * 60 * 60 * 1000;
