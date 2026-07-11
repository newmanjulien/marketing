import type { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';
import { createConvexClient } from '$lib/server/convexClient.server';

export const createSuccessRoomDocumentRequest = async ({
  roomSlug,
  accessToken,
  description
}: {
  roomSlug: string;
  accessToken: string;
  description: string;
}) =>
  await createConvexClient().mutation(api.successRooms.createDocumentRequest, {
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
  await createConvexClient().mutation(api.successRooms.markDocumentRequestNotification, {
    slug: roomSlug,
    accessToken,
    requestId,
    notificationStatus
  });
