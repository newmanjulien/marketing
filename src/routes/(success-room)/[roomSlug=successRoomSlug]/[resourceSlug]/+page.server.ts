import { error } from '@sveltejs/kit';
import {
  getLockedSuccessRoomPayload,
  getUnlockedSuccessRoomBundle,
  unlockSuccessRoom
} from '$lib/success-room/server/pageServer.server';
import { getSuccessRoomResource, isSuccessRoomRoutedResource } from '$lib/success-room/domain/resources';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
  const bundle = await getUnlockedSuccessRoomBundle(cookies, params.roomSlug);

  if (bundle) {
    const resource = getSuccessRoomResource(bundle.room, params.resourceSlug);

    if (!resource || !isSuccessRoomRoutedResource(resource)) {
      error(404, 'Success room resource not found');
    }

    return {
      locked: false as const,
      room: bundle.room,
      state: bundle.state,
      resource
    };
  }

  return await getLockedSuccessRoomPayload(params.roomSlug);
};

export const actions = {
  unlock: async ({ cookies, params, request, url }) =>
    unlockSuccessRoom({ cookies, roomSlug: params.roomSlug, request, pathname: url.pathname })
} satisfies Actions;
