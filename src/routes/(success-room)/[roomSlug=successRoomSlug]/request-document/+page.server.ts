import {
  getLockedSuccessRoomPayload,
  getUnlockedSuccessRoomBasePage,
  unlockSuccessRoom
} from '$lib/success-room/server/pageServer.server';
import { submitSuccessRoomDocumentRequest } from '$lib/success-room/server/documentRequests.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params, url }) => ({
  ...((await getUnlockedSuccessRoomBasePage(cookies, params.roomSlug)) ??
    (await getLockedSuccessRoomPayload(params.roomSlug))),
  documentRequestSubmitted: url.searchParams.get('document-request') === 'submitted'
});

export const actions = {
  unlock: unlockSuccessRoom,
  requestDocument: submitSuccessRoomDocumentRequest
} satisfies Actions;
