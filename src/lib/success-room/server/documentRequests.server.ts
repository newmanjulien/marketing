import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { createPrivateEmailSender } from '$lib/email/server/privateEmail.server';
import {
  maxSuccessRoomDocumentRequestDescriptionLength,
  type DocumentRequestFormFailure,
  type DocumentRequestFormResult
} from '$lib/success-room/domain/documentRequests';
import {
  clearSuccessRoomAccessToken,
  isSuccessRoomAccessError,
  requireSuccessRoomAccessToken
} from './access.server';
import {
  createSuccessRoomDocumentRequest,
  markSuccessRoomDocumentRequestNotification
} from './documentRequestPersistence.server';

type PersistedDocumentRequest = Awaited<ReturnType<typeof createSuccessRoomDocumentRequest>>;
type NotificationStatus = 'sent' | 'failed';

const failDocumentRequest = (
  statusCode: number,
  description: string,
  status: DocumentRequestFormFailure['status'],
  message: string
) =>
  fail(statusCode, {
    documentRequest: {
      description,
      message,
      status
    } satisfies DocumentRequestFormFailure
  });

const readDescription = (formData: FormData) => {
  const description = formData.get('description');

  return typeof description === 'string' ? description.trim() : '';
};

const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => htmlEntities[character]);

const createDocumentRequestEmail = (
  documentRequest: PersistedDocumentRequest,
  recipient: string
) => {
  const submittedAt = new Date(documentRequest.createdAt).toISOString();
  const prospectName = escapeHtml(documentRequest.room.prospectName);
  const roomSlug = escapeHtml(documentRequest.room.slug);
  const description = escapeHtml(documentRequest.description).replace(/\r\n|\r|\n/g, '<br>');
  const escapedSubmittedAt = escapeHtml(submittedAt);

  return {
    to: recipient,
    subject: 'New Success Room document request',
    text: [
      'A new document was requested in a Success Room.',
      '',
      `Prospect: ${documentRequest.room.prospectName}`,
      `Success Room slug: ${documentRequest.room.slug}`,
      `Submitted at: ${submittedAt}`,
      '',
      'Description:',
      documentRequest.description
    ].join('\n'),
    html: [
      '<p>A new document was requested in a Success Room.</p>',
      `<p><strong>Prospect:</strong> ${prospectName}<br>`,
      `<strong>Success Room slug:</strong> ${roomSlug}<br>`,
      `<strong>Submitted at:</strong> ${escapedSubmittedAt}</p>`,
      '<p><strong>Description:</strong></p>',
      `<p>${description}</p>`
    ].join('')
  };
};

const markNotification = async (
  documentRequest: PersistedDocumentRequest,
  accessToken: string,
  notificationStatus: NotificationStatus
) =>
  await markSuccessRoomDocumentRequestNotification({
    roomSlug: documentRequest.room.slug,
    accessToken,
    requestId: documentRequest.requestId,
    notificationStatus
  });

const sendDocumentRequestNotification = async (
  documentRequest: PersistedDocumentRequest,
  accessToken: string
) => {
  let notificationStatus: NotificationStatus = 'failed';

  try {
    const emailSender = createPrivateEmailSender();
    const recipient =
      env.SUCCESS_ROOM_DOCUMENT_REQUEST_RECIPIENT?.trim() || env.PRIVATE_EMAIL_USER?.trim();

    if (!emailSender || !recipient) {
      throw new Error('Document request email notification is not configured');
    }

    await emailSender.send(createDocumentRequestEmail(documentRequest, recipient));
    notificationStatus = 'sent';
  } catch (notificationError) {
    console.error('Unable to email Success Room document request', notificationError);
  }

  try {
    await markNotification(documentRequest, accessToken, notificationStatus);
  } catch (statusError) {
    console.error(
      `Unable to mark Success Room document request notification as ${notificationStatus}`,
      statusError
    );
  }
};

export const submitSuccessRoomDocumentRequest = async ({
  cookies,
  roomSlug,
  formData
}: {
  cookies: Cookies;
  roomSlug: string;
  formData: FormData;
}) => {
  const accessToken = requireSuccessRoomAccessToken(cookies, roomSlug);
  const description = readDescription(formData);

  if (!description) {
    return failDocumentRequest(
      400,
      description,
      'validation-error',
      'Describe the additional document you need.'
    );
  }

  if (description.length > maxSuccessRoomDocumentRequestDescriptionLength) {
    return failDocumentRequest(
      400,
      description,
      'validation-error',
      `Keep your description to ${maxSuccessRoomDocumentRequestDescriptionLength.toLocaleString()} characters or fewer.`
    );
  }

  let documentRequest: PersistedDocumentRequest;

  try {
    documentRequest = await createSuccessRoomDocumentRequest({
      roomSlug,
      accessToken,
      description
    });
  } catch (requestError) {
    if (isSuccessRoomAccessError(requestError)) {
      clearSuccessRoomAccessToken(cookies, roomSlug);

      return failDocumentRequest(
        401,
        description,
        'submission-error',
        'Your Success Room access expired. Refresh the page and enter the password again.'
      );
    }

    console.error('Unable to save Success Room document request', requestError);

    return failDocumentRequest(
      500,
      description,
      'submission-error',
      'Your request could not be saved. Please try again.'
    );
  }

  await sendDocumentRequestNotification(documentRequest, accessToken);

  return {
    documentRequest: {
      status: 'success'
    } satisfies DocumentRequestFormResult
  };
};
