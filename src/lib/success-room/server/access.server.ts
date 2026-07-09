import { error } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { getSuccessRoomPath } from '$lib/success-room/domain/urls';

export const successRoomAccessCookieName = (roomSlug: string) =>
  `success-room-${roomSlug}-access`;

export const getSuccessRoomAccessToken = (cookies: Cookies, roomSlug: string) =>
  cookies.get(successRoomAccessCookieName(roomSlug)) ?? null;

export const setSuccessRoomAccessToken = (
  cookies: Cookies,
  roomSlug: string,
  accessToken: string,
) => {
  cookies.set(successRoomAccessCookieName(roomSlug), accessToken, {
    path: getSuccessRoomPath(roomSlug),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  });
};

export const clearSuccessRoomAccessToken = (cookies: Cookies, roomSlug: string) => {
  cookies.delete(successRoomAccessCookieName(roomSlug), {
    path: getSuccessRoomPath(roomSlug),
  });
};

export const isSuccessRoomAccessError = (loadError: unknown) =>
  loadError instanceof Error && loadError.message.includes('Success room access denied');

export const requireSuccessRoomAccessToken = (cookies: Cookies, roomSlug: string) => {
  const accessToken = getSuccessRoomAccessToken(cookies, roomSlug);

  if (!accessToken) {
    error(401, 'Success room access required');
  }

  return accessToken;
};
