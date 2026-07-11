import {
  getLockedSuccessRoomPayload,
  getUnlockedSuccessRoomBasePage,
  unlockSuccessRoom
} from '$lib/success-room/server/pageServer.server';
import { submitSuccessRoomDocumentRequest } from '$lib/success-room/server/documentRequests.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) =>
  (await getUnlockedSuccessRoomBasePage(cookies, params.roomSlug)) ??
  getLockedSuccessRoomPayload(params.roomSlug);

export const actions = {
  unlock: async ({ cookies, params, request, url }) =>
    unlockSuccessRoom({ cookies, roomSlug: params.roomSlug, request, pathname: url.pathname }),
  requestDocument: async ({ cookies, params, request }) =>
    submitSuccessRoomDocumentRequest({
      cookies,
      roomSlug: params.roomSlug,
      formData: await request.formData()
    })
} satisfies Actions;
