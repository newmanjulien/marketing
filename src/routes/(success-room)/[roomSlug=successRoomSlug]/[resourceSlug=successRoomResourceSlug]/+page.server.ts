import { error, redirect } from '@sveltejs/kit';
import {
  getLockedSuccessRoomPayload,
  getUnlockedSuccessRoomResourcePage,
  resolveUnlockedSuccessRoomAsset,
  unlockSuccessRoom
} from '$lib/success-room/server/pageServer.server';
import { isSuccessRoomResourceNotEnabledError } from '$lib/success-room/server/access.server';
import { isSuccessRoomAssetResourceSlug } from '$lib/success-room/domain/resourceSlugs';
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

  try {
    return (
      (await getUnlockedSuccessRoomResourcePage(cookies, params.roomSlug, params.resourceSlug)) ??
      getLockedSuccessRoomPayload(params.roomSlug)
    );
  } catch (loadError) {
    if (isSuccessRoomResourceNotEnabledError(loadError)) {
      error(404, 'Success room resource not found');
    }

    throw loadError;
  }
};

export const actions = {
  unlock: unlockSuccessRoom
} satisfies Actions;
