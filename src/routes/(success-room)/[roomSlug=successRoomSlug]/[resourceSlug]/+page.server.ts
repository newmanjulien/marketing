import { error } from '@sveltejs/kit';
import {
  getLockedSuccessRoomPayload,
  getUnlockedSuccessRoomResourcePage,
  unlockSuccessRoom
} from '$lib/success-room/server/pageServer.server';
import { isSuccessRoomRoutedResourceSlug } from '$lib/success-room/domain/config';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
  if (!isSuccessRoomRoutedResourceSlug(params.resourceSlug)) {
    error(404, 'Success room resource not found');
  }

  const payload = await getUnlockedSuccessRoomResourcePage(
    cookies,
    params.roomSlug,
    params.resourceSlug
  );

  if (payload) {
    return payload;
  }

  return getLockedSuccessRoomPayload(params.roomSlug);
};

export const actions = {
  unlock: async ({ cookies, params, request, url }) =>
    unlockSuccessRoom({ cookies, roomSlug: params.roomSlug, request, pathname: url.pathname })
} satisfies Actions;
