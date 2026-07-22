import { error, fail, redirect } from '@sveltejs/kit';
import type { Cookies, RequestEvent } from '@sveltejs/kit';
import { getFormActionRedirectPath } from '../domain/urls';
import {
  clearSuccessRoomSessionToken,
  getSuccessRoomSessionToken,
  isSuccessRoomAccessError,
  setSuccessRoomSessionToken
} from './access.server';
import { api } from '$convex/_generated/api';
import type {
  SuccessRoomAssetResourceSlug,
  SuccessRoomRoutedResourceSlug
} from '$shared/successRoomResources';
import { convex } from './convexClient.server';

const getUnlockedSuccessRoomPayload = async <Payload>(
  cookies: Cookies,
  roomSlug: string,
  loadPayload: (sessionToken: string) => Promise<Payload>
) => {
  const sessionToken = getSuccessRoomSessionToken(cookies, roomSlug);

  if (!sessionToken) {
    return null;
  }

  try {
    return await loadPayload(sessionToken);
  } catch (loadError) {
    if (isSuccessRoomAccessError(loadError)) {
      clearSuccessRoomSessionToken(cookies, roomSlug);
      return null;
    }

    throw loadError;
  }
};

export const getUnlockedSuccessRoomLandingPage = (cookies: Cookies, roomSlug: string) =>
  getUnlockedSuccessRoomPayload(cookies, roomSlug, (sessionToken) =>
    convex.query(api.rooms.getLandingPage, { sessionToken })
  );

export const getUnlockedSuccessRoomBasePage = (cookies: Cookies, roomSlug: string) =>
  getUnlockedSuccessRoomPayload(cookies, roomSlug, (sessionToken) =>
    convex.query(api.rooms.getBasePage, { sessionToken })
  );

export const resolveUnlockedSuccessRoomAsset = (
  cookies: Cookies,
  roomSlug: string,
  resourceSlug: SuccessRoomAssetResourceSlug
) =>
  getUnlockedSuccessRoomPayload(cookies, roomSlug, (sessionToken) =>
    convex.query(api.rooms.resolveAssetResource, { sessionToken, resourceSlug })
  );

export const getUnlockedSuccessRoomResourcePage = (
  cookies: Cookies,
  roomSlug: string,
  resourceSlug: SuccessRoomRoutedResourceSlug
) =>
  getUnlockedSuccessRoomPayload(cookies, roomSlug, (sessionToken) =>
    convex.query(api.rooms.getRoutedResourcePage, { sessionToken, resourceSlug })
  );

export const getLockedSuccessRoomPayload = async (roomSlug: string) => {
  const room = await convex.query(api.rooms.getPublicRoom, { slug: roomSlug });

  if (!room) {
    error(404, 'Success room not found');
  }

  return { locked: true as const, room };
};

export const unlockSuccessRoom = async ({
  cookies,
  params: { roomSlug },
  request,
  url
}: RequestEvent<{ roomSlug: string }>) => {
  const formData = await request.formData();
  const password = formData.get('password');

  if (typeof password !== 'string' || password.trim() === '') {
    return fail(400, {
      message: 'Enter the password for this room.'
    });
  }

  const sessionToken = await convex.mutation(api.auth.login, {
    slug: roomSlug,
    lastName: password
  });

  if (!sessionToken) {
    return fail(401, {
      message: "That password doesn't match."
    });
  }

  setSuccessRoomSessionToken(cookies, roomSlug, sessionToken);
  redirect(303, getFormActionRedirectPath(url));
};
