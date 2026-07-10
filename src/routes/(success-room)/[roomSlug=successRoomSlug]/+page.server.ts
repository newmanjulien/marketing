import {
  getLockedSuccessRoomPayload,
  getUnlockedSuccessRoomLandingPage,
  unlockSuccessRoom
} from '$lib/success-room/server/pageServer.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
  const payload = await getUnlockedSuccessRoomLandingPage(cookies, params.roomSlug);

  if (payload) {
    return payload;
  }

  return getLockedSuccessRoomPayload(params.roomSlug);
};

export const actions = {
  unlock: async ({ cookies, params, request, url }) =>
    unlockSuccessRoom({ cookies, roomSlug: params.roomSlug, request, pathname: url.pathname })
} satisfies Actions;
