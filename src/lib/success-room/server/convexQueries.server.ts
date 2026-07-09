import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { successRoomDescription } from '$lib/success-room/domain/config';
import type {
  SuccessRoomAssetResourceSlug,
  SuccessRoomEditableTextResourceSlug
} from '$lib/success-room/domain/config';
import { getSuccessRoomEditableAttachmentPath } from '$lib/success-room/domain/urls';
import { convex } from './convexClient.server';
import { mapSuccessRoomBundle } from './bundleMapper.server';

export const getPublicSuccessRoom = async (roomSlug: string) => {
  const room = await convex.query(api.successRooms.getPublicRoom, { slug: roomSlug });

  return room ? { ...room, description: successRoomDescription } : null;
};

export const verifySuccessRoomPassword = async (roomSlug: string, password: string) =>
  await convex.mutation(api.successRooms.verifyPassword, {
    slug: roomSlug,
    password,
  });

export const getSuccessRoomEditableAttachmentHref = (roomSlug: string, resourceSlug: string) =>
  getSuccessRoomEditableAttachmentPath(roomSlug, resourceSlug);

export const getProtectedSuccessRoomBundle = async (roomSlug: string, accessToken: string) =>
  mapSuccessRoomBundle(
    await convex.query(api.successRooms.getRoomBundle, {
      slug: roomSlug,
      accessToken,
    }),
  );

export const getProtectedSuccessRoomResourceFile = async (
  roomSlug: string,
  accessToken: string,
  args: {
    resourceSlug: SuccessRoomAssetResourceSlug;
  },
) =>
  await convex.query(api.successRooms.getResourceFileForDownload, {
    slug: roomSlug,
    accessToken,
    resourceSlug: args.resourceSlug,
  });

export const getProtectedSuccessRoomEditableAttachmentFile = async (
  roomSlug: string,
  accessToken: string,
  args: {
    resourceSlug: SuccessRoomEditableTextResourceSlug;
  },
) =>
  await convex.query(api.successRooms.getEditableAttachmentForDownload, {
    slug: roomSlug,
    accessToken,
    resourceSlug: args.resourceSlug,
  });

export const getProtectedSuccessRoomTeamMemberPhoto = async (
  roomSlug: string,
  accessToken: string,
  teamMemberId: string,
) =>
  await convex.query(api.successRooms.getTeamMemberPhotoForDownload, {
    slug: roomSlug,
    accessToken,
    teamMemberId: teamMemberId as Id<'successRoomTeamMembers'>,
  });
