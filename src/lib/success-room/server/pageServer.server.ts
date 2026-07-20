import { error, fail, redirect } from '@sveltejs/kit';
import type { Cookies, RequestEvent } from '@sveltejs/kit';
import { getFormActionRedirectPath } from '$lib/forms/formActionUrls';
import {
  clearSuccessRoomSessionToken,
  getSuccessRoomSessionToken,
  isSuccessRoomAccessError,
  setSuccessRoomSessionToken
} from './access.server';
import { api } from '../../../../convex/_generated/api';
import type {
  SuccessRoomAssetResourceSlug,
  SuccessRoomRoutedResourceSlug
} from '$lib/success-room/domain/config';
import { successRoomDescription } from '$lib/success-room/domain/config';
import { convex } from '$lib/server/convexClient.server';

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
    if (!isSuccessRoomAccessError(loadError)) {
      throw loadError;
    }

    clearSuccessRoomSessionToken(cookies, roomSlug);
    return null;
  }
};

export const getUnlockedSuccessRoomLandingPage = async (cookies: Cookies, roomSlug: string) =>
  getUnlockedSuccessRoomPayload(cookies, roomSlug, (sessionToken) =>
    convex.query(api.rooms.getLandingPage, { sessionToken })
  );

export const getUnlockedSuccessRoomBasePage = async (cookies: Cookies, roomSlug: string) =>
  getUnlockedSuccessRoomPayload(cookies, roomSlug, (sessionToken) =>
    convex.query(api.rooms.getBasePage, { sessionToken })
  );

export const resolveUnlockedSuccessRoomAsset = async (
  cookies: Cookies,
  roomSlug: string,
  resourceSlug: SuccessRoomAssetResourceSlug
) =>
  getUnlockedSuccessRoomPayload(cookies, roomSlug, (sessionToken) =>
    convex.query(api.rooms.resolveAssetResource, { sessionToken, resourceSlug })
  );

export const getUnlockedSuccessRoomResourcePage = async (
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

  return {
    locked: true as const,
    room: {
      slug: room.slug,
      prospectName: room.prospectName,
      description: successRoomDescription
    }
  };
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

  const login = await convex.action(api.auth.login, {
    slug: roomSlug,
    password
  });

  if ('failure' in login) {
    if (login.failure === 'locked') {
      return fail(429, {
        message: 'Too many attempts. Wait a few minutes and try again.'
      });
    }

    return fail(401, {
      message: "That password doesn't match."
    });
  }

  setSuccessRoomSessionToken(cookies, roomSlug, login.sessionToken);
  redirect(303, getFormActionRedirectPath(url));
};
