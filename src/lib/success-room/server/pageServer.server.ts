import { error, fail, redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import {
  clearSuccessRoomAccessToken,
  getSuccessRoomAccessToken,
  isSuccessRoomAccessError,
  setSuccessRoomAccessToken
} from './access.server';
import {
  getProtectedSuccessRoomBundle,
  getPublicSuccessRoom,
  verifySuccessRoomPassword
} from './convexQueries.server';

export const getUnlockedSuccessRoomBundle = async (cookies: Cookies, roomSlug: string) => {
  const accessToken = getSuccessRoomAccessToken(cookies, roomSlug);

  if (!accessToken) {
    return null;
  }

  try {
    return await getProtectedSuccessRoomBundle(roomSlug, accessToken);
  } catch (loadError) {
    if (!isSuccessRoomAccessError(loadError)) {
      throw loadError;
    }

    clearSuccessRoomAccessToken(cookies, roomSlug);
    return null;
  }
};

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
