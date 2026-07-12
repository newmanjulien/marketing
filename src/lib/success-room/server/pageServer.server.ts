import { error, fail, redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { getFormActionRedirectPath } from '$lib/forms/formActionUrls';
import {
  clearSuccessRoomAccessToken,
  getSuccessRoomAccessToken,
  isSuccessRoomAccessError,
  setSuccessRoomAccessToken
} from './access.server';
import { api } from '../../../../convex/_generated/api';
import type {
  SuccessRoomAssetResourceSlug,
  SuccessRoomRoutedResourceSlug
} from '$lib/success-room/domain/config';
import { successRoomDescription } from '$lib/success-room/domain/config';
import { createConvexClient } from '$lib/server/convexClient.server';

const getUnlockedSuccessRoomPayload = async <Payload>(
  cookies: Cookies,
  roomSlug: string,
  loadPayload: (accessToken: string) => Promise<Payload>
) => {
  const accessToken = getSuccessRoomAccessToken(cookies, roomSlug);

  if (!accessToken) {
    return null;
  }

  try {
    return await loadPayload(accessToken);
  } catch (loadError) {
    if (!isSuccessRoomAccessError(loadError)) {
      throw loadError;
    }

    clearSuccessRoomAccessToken(cookies, roomSlug);
    return null;
  }
};

export const getUnlockedSuccessRoomLandingPage = async (cookies: Cookies, roomSlug: string) =>
  getUnlockedSuccessRoomPayload(cookies, roomSlug, (accessToken) =>
    createConvexClient().query(api.successRooms.getLandingPage, {
      slug: roomSlug,
      accessToken
    })
  );

export const getUnlockedSuccessRoomBasePage = async (cookies: Cookies, roomSlug: string) =>
  getUnlockedSuccessRoomPayload(cookies, roomSlug, (accessToken) =>
    createConvexClient().query(api.successRooms.getBasePage, {
      slug: roomSlug,
      accessToken
    })
  );

export const resolveUnlockedSuccessRoomAsset = async (
  cookies: Cookies,
  roomSlug: string,
  resourceSlug: SuccessRoomAssetResourceSlug
) =>
  getUnlockedSuccessRoomPayload(cookies, roomSlug, (accessToken) =>
    createConvexClient().query(api.successRooms.resolveAssetResource, {
      slug: roomSlug,
      accessToken,
      resourceSlug
    })
  );

export const getUnlockedSuccessRoomResourcePage = async (
  cookies: Cookies,
  roomSlug: string,
  resourceSlug: SuccessRoomRoutedResourceSlug
) =>
  getUnlockedSuccessRoomPayload(cookies, roomSlug, (accessToken) =>
    createConvexClient().query(api.successRooms.getRoutedResourcePage, {
      slug: roomSlug,
      accessToken,
      resourceSlug
    })
  );

export const getLockedSuccessRoomPayload = async (roomSlug: string) => {
  const room = await createConvexClient().query(api.successRooms.getPublicRoom, {
    slug: roomSlug
  });

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
  roomSlug,
  request,
  url
}: {
  cookies: Cookies;
  roomSlug: string;
  request: Request;
  url: URL;
}) => {
  const formData = await request.formData();
  const password = formData.get('password');

  if (typeof password !== 'string' || password.trim() === '') {
    return fail(400, {
      message: 'Enter the password for this room.'
    });
  }

  const accessToken = await createConvexClient().query(api.successRooms.verifyPassword, {
    slug: roomSlug,
    password
  });

  if (!accessToken) {
    return fail(401, {
      message: "That password doesn't match."
    });
  }

  setSuccessRoomAccessToken(cookies, roomSlug, accessToken);
  redirect(303, getFormActionRedirectPath(url));
};
