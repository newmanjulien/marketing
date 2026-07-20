import {
  getLockedSuccessRoomPayload,
  getUnlockedSuccessRoomBasePage,
  unlockSuccessRoom
} from '$lib/success-room/server/pageServer.server';
import { submitSuccessRoomDocumentRequest } from '$lib/success-room/server/documentRequests.server';
import { getFormActionRedirectPath } from '$lib/forms/formActionUrls';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params, url }) => ({
  ...((await getUnlockedSuccessRoomBasePage(cookies, params.roomSlug)) ??
    (await getLockedSuccessRoomPayload(params.roomSlug))),
  documentRequestSubmitted: url.searchParams.get('document-request') === 'submitted'
});

export const actions = {
  unlock: unlockSuccessRoom,
  requestDocument: async ({ cookies, params, request, url }) => {
    const result = await submitSuccessRoomDocumentRequest({
      cookies,
      roomSlug: params.roomSlug,
      formData: await request.formData()
    });

    if (result) {
      return result;
    }

    redirect(
      303,
      getFormActionRedirectPath(url, { 'document-request': 'submitted' })
    );
  }
} satisfies Actions;
