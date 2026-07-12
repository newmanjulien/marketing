import { error, redirect } from '@sveltejs/kit';
import {
  getLockedSuccessRoomPayload,
  getUnlockedSuccessRoomResourcePage,
  resolveUnlockedSuccessRoomAsset,
  unlockSuccessRoom
} from '$lib/success-room/server/pageServer.server';
import {
  isSuccessRoomAssetResourceSlug,
  isSuccessRoomRoutedResourceSlug
} from '$lib/success-room/domain/config';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params, setHeaders }) => {
  if (isSuccessRoomAssetResourceSlug(params.resourceSlug)) {
    const resolution = await resolveUnlockedSuccessRoomAsset(
      cookies,
      params.roomSlug,
      params.resourceSlug
    );

    if (!resolution) {
      return getLockedSuccessRoomPayload(params.roomSlug);
    }

    if (resolution.status === 'missing') {
      error(404, 'Success room resource not found');
    }

    setHeaders({ 'cache-control': 'private, no-store' });
    redirect(302, resolution.href);
  }

  if (!isSuccessRoomRoutedResourceSlug(params.resourceSlug)) {
    error(404, 'Success room resource not found');
  }

  return (
    (await getUnlockedSuccessRoomResourcePage(cookies, params.roomSlug, params.resourceSlug)) ??
    getLockedSuccessRoomPayload(params.roomSlug)
  );
};

export const actions = {
  unlock: async ({ cookies, params, request, url }) =>
    unlockSuccessRoom({ cookies, roomSlug: params.roomSlug, request, url })
} satisfies Actions;
