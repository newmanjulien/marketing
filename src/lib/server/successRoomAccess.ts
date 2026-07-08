import { error } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { getSuccessRoomAccessToken } from './successRoomConvex';

export const requireSuccessRoomAccessToken = (cookies: Cookies, roomSlug: string) => {
  const accessToken = getSuccessRoomAccessToken(cookies, roomSlug);

  if (!accessToken) {
    error(401, 'Success room access required');
  }

  return accessToken;
};
