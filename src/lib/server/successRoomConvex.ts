import { PUBLIC_CONVEX_URL } from '$env/static/public';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import type { FunctionReturnType } from 'convex/server';
import type { Cookies } from '@sveltejs/kit';
import type { Id } from '../../../convex/_generated/dataModel';
import {
  successRoomDescription,
  successRoomResourceDefinitions
} from '$lib/success-room/successRoomConfig';
import type {
  SuccessRoomAssetResourceDefinition,
  SuccessRoomAssetResourceSlug,
  SuccessRoomEditableTextResourceSlug,
  SuccessRoomEditableTextResourceDefinition,
  SuccessRoomMutualSuccessPlanResourceDefinition,
  SuccessRoomResourceDefinition
} from '$lib/success-room/successRoomConfig';
import type {
  SuccessRoom,
  SuccessRoomAssetDelivery,
  SuccessRoomDownloadableFileResource,
  SuccessRoomEditableTextResource,
  SuccessRoomLinkedFileMetadata,
  SuccessRoomLinkedTeamMemberPhotoMetadata,
  SuccessRoomAudioResource,
  SuccessRoomMutualSuccessPlanResource,
  SuccessRoomMutualSuccessPlanCatalog,
  SuccessRoomPdfResource,
  SuccessRoomResource,
  SuccessRoomRouteDelivery,
  SuccessRoomState,
  SuccessRoomTeamMember,
} from '$lib/success-room/successRoomTypes';

type RoomBundle = FunctionReturnType<typeof api.successRooms.getRoomBundle>;

export const convex = new ConvexHttpClient(PUBLIC_CONVEX_URL);

export const successRoomAccessCookieName = (roomSlug: string) =>
  `success-room-${roomSlug}-access`;

export const getSuccessRoomAccessToken = (cookies: Cookies, roomSlug: string) =>
  cookies.get(successRoomAccessCookieName(roomSlug)) ?? null;

export const setSuccessRoomAccessToken = (
  cookies: Cookies,
  roomSlug: string,
  accessToken: string,
) => {
  cookies.set(successRoomAccessCookieName(roomSlug), accessToken, {
    path: `/success-room/${roomSlug}`,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  });
};

export const clearSuccessRoomAccessToken = (cookies: Cookies, roomSlug: string) => {
  cookies.delete(successRoomAccessCookieName(roomSlug), {
    path: `/success-room/${roomSlug}`,
  });
};

export const isSuccessRoomAccessError = (error: unknown) =>
  error instanceof Error && error.message.includes('Success room access denied');

export const getPublicSuccessRoom = async (roomSlug: string) => {
  const room = await convex.query(api.successRooms.getPublicRoom, { slug: roomSlug });

  return room ? { ...room, description: successRoomDescription } : null;
};

export const verifySuccessRoomPassword = async (roomSlug: string, password: string) =>
  await convex.mutation(api.successRooms.verifyPassword, {
    slug: roomSlug,
    password,
  });

const resourceFileHref = (roomSlug: string, resourceSlug: string) =>
  `/success-room/${roomSlug}/resource-file/${resourceSlug}`;

export const getSuccessRoomEditableAttachmentHref = (roomSlug: string, resourceSlug: string) =>
  `/success-room/${roomSlug}/editable-attachment/${resourceSlug}`;

const teamMemberPhotoHref = (roomSlug: string, memberId: string) =>
  `/success-room/${roomSlug}/team-member-photo/${memberId}`;

const routeDelivery = { type: 'route' } satisfies SuccessRoomRouteDelivery;

const assetDelivery = (roomSlug: string, resourceSlug: string): SuccessRoomAssetDelivery => ({
  type: 'asset',
  href: resourceFileHref(roomSlug, resourceSlug),
});

const mapTeamMember = (
  roomSlug: string,
  member: RoomBundle['room']['team'][number],
): SuccessRoomTeamMember => {
  const photo = 'photo' in member ? member.photo : undefined;
  const teamMemberPhoto =
    photo
      ? ({
          ...photo,
          href: teamMemberPhotoHref(roomSlug, member.id),
        } satisfies SuccessRoomLinkedTeamMemberPhotoMetadata)
      : undefined;

  return {
    id: member.id,
    name: member.name,
    role: member.role,
    ...(teamMemberPhoto ? { photo: teamMemberPhoto } : {}),
    imageHref: teamMemberPhoto?.href ?? '',
  };
};

const mapAssetResource = (
  roomSlug: string,
  resource: SuccessRoomAssetResourceDefinition,
): SuccessRoomPdfResource | SuccessRoomAudioResource | SuccessRoomDownloadableFileResource => ({
  kind: resource.kind,
  slug: resource.slug,
  title: resource.title,
  actionLabel: resource.actionLabel,
  description: resource.description,
  delivery: assetDelivery(roomSlug, resource.slug),
});

const mapMutualSuccessPlanResource = (
  resource: SuccessRoomMutualSuccessPlanResourceDefinition,
  catalog: SuccessRoomMutualSuccessPlanCatalog,
): SuccessRoomMutualSuccessPlanResource => ({
  kind: resource.kind,
  slug: resource.slug,
  title: resource.title,
  actionLabel: resource.actionLabel,
  description: resource.description,
  catalog,
  delivery: routeDelivery,
});

const mapEditableTextResource = (
  resource: SuccessRoomEditableTextResourceDefinition,
): SuccessRoomEditableTextResource => ({
  kind: resource.kind,
  slug: resource.slug,
  title: resource.title,
  actionLabel: resource.actionLabel,
  description: resource.description,
  editorRows: resource.editorRows,
  delivery: routeDelivery,
});

const mapRoomResource = (
  roomSlug: string,
  resource: SuccessRoomResourceDefinition,
  mutualSuccessPlanCatalog: SuccessRoomMutualSuccessPlanCatalog,
): SuccessRoomResource => {
  switch (resource.kind) {
    case 'pdf':
    case 'audio':
    case 'downloadable-file':
      return mapAssetResource(roomSlug, resource);
    case 'mutual-success-plan':
      return mapMutualSuccessPlanResource(resource, mutualSuccessPlanCatalog);
    case 'editable-text':
      return mapEditableTextResource(resource);
  }
};

const mapEditableTextStates = (
  roomSlug: string,
  editableTexts: RoomBundle['state']['editableTexts'],
): SuccessRoomState['editableTexts'] =>
  Object.fromEntries(
    Object.entries(editableTexts).map(([resourceSlug, editableState]) => [
      resourceSlug,
      {
        content: editableState.content,
        dataSources: editableState.dataSources,
        ...(editableState.attachment
          ? {
              attachment: {
                ...editableState.attachment,
                href: getSuccessRoomEditableAttachmentHref(roomSlug, resourceSlug),
              } satisfies SuccessRoomLinkedFileMetadata,
            }
          : {}),
      },
    ]),
  );

const mapMutualSuccessPlanState = (
  mutualSuccessPlan: RoomBundle['state']['mutualSuccessPlan'],
): SuccessRoomState['mutualSuccessPlan'] =>
  mutualSuccessPlan
    ? {
        plan: mutualSuccessPlan.plan,
      }
    : undefined;

export const mapSuccessRoomBundle = (bundle: RoomBundle): { room: SuccessRoom; state: SuccessRoomState } => {
  const enabledResourceKeys = new Set(bundle.room.enabledResourceKeys);
  const resources = successRoomResourceDefinitions
    .filter((resource) => enabledResourceKeys.has(resource.slug))
    .map((resource) =>
      mapRoomResource(bundle.room.slug, resource, bundle.room.mutualSuccessPlanCatalog)
    );
  const teamMembers = bundle.room.team.map((member) =>
    mapTeamMember(bundle.room.slug, member),
  );
  const mutualSuccessPlan = mapMutualSuccessPlanState(bundle.state.mutualSuccessPlan);

  return {
    room: {
      slug: bundle.room.slug,
      prospectName: bundle.room.prospectName,
      description: successRoomDescription,
      team: teamMembers,
      resources,
    },
    state: {
      questions: bundle.state.questions,
      ...(mutualSuccessPlan ? { mutualSuccessPlan } : {}),
      editableTexts: mapEditableTextStates(bundle.room.slug, bundle.state.editableTexts),
    },
  };
};

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
