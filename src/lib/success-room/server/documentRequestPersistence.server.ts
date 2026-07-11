import type { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';
import { convex } from './convexClient.server';

export const createSuccessRoomDocumentRequest = async ({
  roomSlug,
  accessToken,
  description
}: {
  roomSlug: string;
  accessToken: string;
  description: string;
}) =>
  await convex.mutation(api.successRooms.createDocumentRequest, {
    slug: roomSlug,
    accessToken,
    description
  });

export const markSuccessRoomDocumentRequestNotification = async ({
  roomSlug,
  accessToken,
  requestId,
  notificationStatus
}: {
  roomSlug: string;
  accessToken: string;
  requestId: Id<'successRoomDocumentRequests'>;
  notificationStatus: 'sent' | 'failed';
}) =>
  await convex.mutation(api.successRooms.markDocumentRequestNotification, {
    slug: roomSlug,
    accessToken,
    requestId,
    notificationStatus
  });
