import {
  getLockedSuccessRoomPayload,
  getUnlockedSuccessRoomBundle,
  unlockSuccessRoom
} from '$lib/server/successRoomPageServer';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
  const bundle = await getUnlockedSuccessRoomBundle(cookies, params.roomSlug);

  if (bundle) {
    return {
      locked: false as const,
      ...bundle
    };
  }

  return await getLockedSuccessRoomPayload(params.roomSlug);
};

export const actions = {
  unlock: async ({ cookies, params, request, url }) =>
    unlockSuccessRoom({ cookies, roomSlug: params.roomSlug, request, pathname: url.pathname })
} satisfies Actions;
