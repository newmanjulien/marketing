import { error, fail, redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import {
  clearSuccessRoomAccessToken,
  getSuccessRoomAccessToken,
  isSuccessRoomAccessError,
  setSuccessRoomAccessToken
} from './access.server';
import {
  getProtectedSuccessRoomBasePage,
  getProtectedSuccessRoomLandingPage,
  getProtectedSuccessRoomResourcePage,
  getPublicSuccessRoom,
  resolveProtectedSuccessRoomAsset,
  verifySuccessRoomPassword
} from './convexQueries.server';
import type {
  SuccessRoomAssetResourceSlug,
  SuccessRoomRoutedResourceSlug
} from '$lib/success-room/domain/config';

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
    getProtectedSuccessRoomLandingPage(roomSlug, accessToken)
  );

export const getUnlockedSuccessRoomBasePage = async (cookies: Cookies, roomSlug: string) =>
  getUnlockedSuccessRoomPayload(cookies, roomSlug, (accessToken) =>
    getProtectedSuccessRoomBasePage(roomSlug, accessToken)
  );

export const resolveUnlockedSuccessRoomAsset = async (
  cookies: Cookies,
  roomSlug: string,
  resourceSlug: SuccessRoomAssetResourceSlug
) =>
  getUnlockedSuccessRoomPayload(cookies, roomSlug, (accessToken) =>
    resolveProtectedSuccessRoomAsset(roomSlug, accessToken, resourceSlug)
  );

export const getUnlockedSuccessRoomResourcePage = async (
  cookies: Cookies,
  roomSlug: string,
  resourceSlug: SuccessRoomRoutedResourceSlug
) =>
  getUnlockedSuccessRoomPayload(cookies, roomSlug, (accessToken) =>
    getProtectedSuccessRoomResourcePage(roomSlug, accessToken, resourceSlug)
  );

export const getLockedSuccessRoomPayload = async (roomSlug: string) => {
  const room = await getPublicSuccessRoom(roomSlug);

  if (!room) {
    error(404, 'Success room not found');
  }

  return {
    locked: true as const,
    room: {
      slug: room.slug,
      prospectName: room.prospectName,
      description: room.description
    }
  };
};

export const unlockSuccessRoom = async ({
  cookies,
  roomSlug,
  request,
  pathname
}: {
  cookies: Cookies;
  roomSlug: string;
  request: Request;
  pathname: string;
}) => {
  const formData = await request.formData();
  const password = formData.get('password');

  if (typeof password !== 'string' || password.trim() === '') {
    return fail(400, {
      message: 'Enter the password for this room.'
    });
  }

  const accessToken = await verifySuccessRoomPassword(roomSlug, password);

  if (!accessToken) {
    return fail(401, {
      message: "That password doesn't match."
    });
  }

  setSuccessRoomAccessToken(cookies, roomSlug, accessToken);
  redirect(303, pathname);
};
