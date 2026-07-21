import { error } from '@sveltejs/kit';
import type { Cookies, RequestEvent } from '@sveltejs/kit';
import { ConvexError } from 'convex/values';
import { dev } from '$app/environment';
import { getSuccessRoomPath } from '$lib/success-room/domain/urls';
import {
  successRoomAccessDeniedCode,
  successRoomResourceNotEnabledCode,
  successRoomSessionLifetimeMs
} from '../../../../shared/successRoomAccess';

const sessionCookieMaxAgeSeconds = successRoomSessionLifetimeMs / 1000;

const successRoomSessionCookieName = (roomSlug: string) => `success-room-${roomSlug}-session`;

export const getSuccessRoomSessionToken = (cookies: Cookies, roomSlug: string) =>
  cookies.get(successRoomSessionCookieName(roomSlug)) ?? null;

export const setSuccessRoomSessionToken = (
  cookies: Cookies,
  roomSlug: string,
  sessionToken: string
) => {
  cookies.set(successRoomSessionCookieName(roomSlug), sessionToken, {
    path: getSuccessRoomPath(roomSlug),
    // Kit's `secure` default only relaxes on `localhost`; dev runs on 127.0.0.1.
    secure: !dev,
    maxAge: sessionCookieMaxAgeSeconds
  });
};

export const clearSuccessRoomSessionToken = (cookies: Cookies, roomSlug: string) => {
  cookies.delete(successRoomSessionCookieName(roomSlug), {
    path: getSuccessRoomPath(roomSlug),
    // Kit's `secure` default only relaxes on `localhost`; dev runs on 127.0.0.1,
    // and Safari drops `Secure` cookie writes (including deletions) over http.
    secure: !dev
  });
};

export const isSuccessRoomAccessError = (loadError: unknown) =>
  loadError instanceof ConvexError && loadError.data === successRoomAccessDeniedCode;

export const isSuccessRoomResourceNotEnabledError = (loadError: unknown) =>
  loadError instanceof ConvexError && loadError.data === successRoomResourceNotEnabledCode;

export const requireSuccessRoomSessionToken = (cookies: Cookies, roomSlug: string) => {
  const sessionToken = getSuccessRoomSessionToken(cookies, roomSlug);

  if (!sessionToken) {
    error(401, 'Success room access required');
  }

  return sessionToken;
};

// Convex validators remain the runtime schema check; this only guarantees the
// body is a plain JSON object so bad input fails as 400, not 500.
const readJsonObjectBody = async (request: Request) => {
  const body = await request.json().catch(() => null);

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    error(400, 'Request body must be a JSON object');
  }

  return body as Record<string, unknown>;
};

// Chokepoint for the success room API routes: resolves the session cookie,
// parses the body, and maps the expected Convex errors the way page loads do —
// disabled resource to a 404, expired/deleted session to a 401 with the stale
// cookie cleared.
export const handleSuccessRoomApiRequest = async <
  Body extends Record<string, unknown> = Record<string, never>
>(
  { cookies, params, request }: RequestEvent<{ roomSlug: string }>,
  run: (input: { sessionToken: string; body: Body }) => Promise<Response>
) => {
  const sessionToken = requireSuccessRoomSessionToken(cookies, params.roomSlug);
  const body = (request.method === 'POST' ? await readJsonObjectBody(request) : {}) as Body;

  try {
    return await run({ sessionToken, body });
  } catch (mutationError) {
    if (isSuccessRoomResourceNotEnabledError(mutationError)) {
      error(404, 'Success room resource not found');
    }

    if (!isSuccessRoomAccessError(mutationError)) {
      throw mutationError;
    }

    clearSuccessRoomSessionToken(cookies, params.roomSlug);
    error(401, 'Success room access required');
  }
};
