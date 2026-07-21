import { fail } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { convex } from '$lib/success-room/server/convexClient.server';
import { maxSuccessRoomDocumentRequestDescriptionLength } from '$shared/successRoomDocumentRequests';
import type { DocumentRequestFormFailure } from '$lib/success-room/domain/types';
import {
  clearSuccessRoomSessionToken,
  isSuccessRoomAccessError,
  requireSuccessRoomSessionToken
} from './access.server';
import { api } from '$convex/_generated/api';

const failDocumentRequest = (statusCode: number, failure: DocumentRequestFormFailure) =>
  fail(statusCode, { documentRequest: failure });

export const submitSuccessRoomDocumentRequest = async ({
  cookies,
  roomSlug,
  formData
}: {
  cookies: Cookies;
  roomSlug: string;
  formData: FormData;
}) => {
  const sessionToken = requireSuccessRoomSessionToken(cookies, roomSlug);
  const rawDescription = formData.get('description');
  const description = typeof rawDescription === 'string' ? rawDescription.trim() : '';

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

      return failDocumentRequest(401, {
        description,
        status: 'submission-error',
        message: 'Your Success Room access expired. Refresh the page and enter the password again.'
      });
    }

    console.error('Unable to save Success Room document request', requestError);

    return failDocumentRequest(500, {
      description,
      status: 'submission-error',
      message: 'Your request could not be saved. Please try again.'
    });
  }
};
