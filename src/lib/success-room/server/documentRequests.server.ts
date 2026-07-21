import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { convex } from './convexClient.server';
import { maxSuccessRoomDocumentRequestDescriptionLength } from '$shared/successRoomDocumentRequests';
import type { DocumentRequestFormFailure } from '../domain/types';
import { getFormActionRedirectPath } from '../domain/urls';
import {
  clearSuccessRoomSessionToken,
  getSuccessRoomSessionToken,
  isSuccessRoomAccessError
} from './access.server';
import { api } from '$convex/_generated/api';

const failDocumentRequest = (statusCode: number, failure: DocumentRequestFormFailure) =>
  fail(statusCode, { documentRequest: failure });

const failExpiredSession = (description: string) =>
  failDocumentRequest(401, {
    description,
    status: 'submission-error',
    message: 'Your Success Room access expired. Refresh the page and enter the password again.'
  });

export const submitSuccessRoomDocumentRequest = async ({
  cookies,
  params: { roomSlug },
  request,
  url
}: RequestEvent<{ roomSlug: string }>) => {
  const formData = await request.formData();
  const rawDescription = formData.get('description');
  const description = typeof rawDescription === 'string' ? rawDescription.trim() : '';

  // The browser evicts the session cookie at expiry; fail the same way as a
  // server-side expiry so the typed description survives.
  const sessionToken = getSuccessRoomSessionToken(cookies, roomSlug);

  if (!sessionToken) {
    return failExpiredSession(description);
  }

  if (!description) {
    return failDocumentRequest(400, {
      description,
      status: 'validation-error',
      message: 'Describe the additional document you need.'
    });
  }

  if (description.length > maxSuccessRoomDocumentRequestDescriptionLength) {
    return failDocumentRequest(400, {
      description,
      status: 'validation-error',
      message: `Keep your description to ${maxSuccessRoomDocumentRequestDescriptionLength.toLocaleString()} characters or fewer.`
    });
  }

  try {
    // The notification email is scheduled inside Convex; nothing else to do here.
    await convex.mutation(api.rooms.createDocumentRequest, { sessionToken, description });
  } catch (requestError) {
    if (isSuccessRoomAccessError(requestError)) {
      clearSuccessRoomSessionToken(cookies, roomSlug);

      return failExpiredSession(description);
    }

    console.error('Unable to save Success Room document request', requestError);

    return failDocumentRequest(500, {
      description,
      status: 'submission-error',
      message: 'Your request could not be saved. Please try again.'
    });
  }

  // Outside the try: redirect() throws, and the catch would turn it into a 500.
  redirect(303, getFormActionRedirectPath(url, { 'document-request': 'submitted' }));
};
