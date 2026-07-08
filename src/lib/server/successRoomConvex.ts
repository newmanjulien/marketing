import { PUBLIC_CONVEX_URL } from '$env/static/public';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import type { FunctionReturnType } from 'convex/server';
import type { Cookies } from '@sveltejs/kit';
import type {
  SuccessRoom,
  SuccessRoomAudioResource,
  SuccessRoomDownloadableFileResource,
  SuccessRoomEditableTextResource,
  SuccessRoomGlobalFileMetadata,
  SuccessRoomMutualSuccessPlanResource,
  SuccessRoomPdfResource,
  SuccessRoomState,
  SuccessRoomTeamMember,
} from '$lib/success-room/successRoomTypes';

type RoomBundle = FunctionReturnType<typeof api.successRooms.getRoomBundle>;
type PublicResource = RoomBundle['room']['resources'][number];

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

export const getPublicSuccessRoom = async (roomSlug: string) =>
  await convex.query(api.successRooms.getPublicRoom, { slug: roomSlug });

export const verifySuccessRoomPassword = async (roomSlug: string, password: string) =>
  await convex.mutation(api.successRooms.verifyPassword, {
    slug: roomSlug,
    password,
  });

const resourceFileHref = (roomSlug: string, resourceSlug: string) =>
  `/success-room/${roomSlug}/resource-file/${resourceSlug}`;

const globalFileHref = (roomSlug: string, key: string) =>
  `/success-room/${roomSlug}/global-file/${key}`;

const globalMetadataWithHref = (
  roomSlug: string,
  metadata: SuccessRoomGlobalFileMetadata | undefined,
  key: string,
) =>
  metadata
    ? {
        ...metadata,
        href: globalFileHref(roomSlug, key),
      }
    : undefined;

const mapTeamMember = (
  roomSlug: string,
  member: RoomBundle['room']['team'][number],
): SuccessRoomTeamMember => {
  const photo = 'photo' in member ? member.photo : undefined;

  return {
    id: member.id,
    name: member.name,
    role: member.role,
    ...('email' in member && member.email ? { email: member.email } : {}),
    ...(photo ? { photo } : {}),
    imageHref: globalMetadataWithHref(roomSlug, photo, 'julien-newman-photo')?.href ?? '',
  };
};

const mapRoomResource = (
  roomSlug: string,
  resource: PublicResource,
):
  | SuccessRoomPdfResource
  | SuccessRoomAudioResource
  | SuccessRoomDownloadableFileResource
  | SuccessRoomMutualSuccessPlanResource
  | SuccessRoomEditableTextResource => {
  if (resource.kind === 'deck') {
    return {
      kind: 'pdf',
      slug: resource.slug,
      title: resource.title,
      actionLabel: resource.actionLabel,
      description: resource.description,
      delivery: {
        type: 'asset',
        href: resourceFileHref(roomSlug, resource.slug),
      },
    };
  }

  if (resource.kind === 'audio') {
    return {
      kind: 'audio',
      slug: resource.slug,
      title: resource.title,
      actionLabel: resource.actionLabel,
      description: resource.description,
      delivery: {
        type: 'asset',
        href: resourceFileHref(roomSlug, resource.slug),
      },
    };
  }

  if (resource.kind === 'downloadable-file') {
    return {
      kind: 'downloadable-file',
      slug: resource.slug,
      title: resource.title,
      actionLabel: resource.actionLabel,
      description: resource.description,
      delivery: {
        type: 'asset',
        href: resourceFileHref(roomSlug, resource.slug),
      },
    };
  }

  if (resource.kind === 'mutual-success-plan') {
    return {
      kind: 'mutual-success-plan',
      slug: resource.slug,
      title: resource.title,
      actionLabel: resource.actionLabel,
      description: resource.description ?? '',
      delivery: {
        type: 'route',
      },
    };
  }

  return {
    kind: 'editable-text',
    slug: resource.slug,
    title: resource.title,
    actionLabel: resource.actionLabel,
    description: resource.description ?? '',
    editorRows: resource.editorRows,
    initialText: resource.initialText ?? '',
    delivery: {
      type: 'route',
    },
  };
};

export const mapSuccessRoomBundle = (bundle: RoomBundle): { room: SuccessRoom; state: SuccessRoomState } => {
  const resources = bundle.room.resources.map((resource) =>
    mapRoomResource(bundle.room.slug, resource),
  );
  const teamMembers = bundle.room.team.map((member) =>
    mapTeamMember(bundle.room.slug, member),
  );

  return {
    room: {
      slug: bundle.room.slug,
      prospectName: bundle.room.prospectName,
      description: bundle.room.description,
      team: teamMembers,
      resources,
    },
    state: {
      questions: bundle.state.questions,
      plan: bundle.state.plan,
      editableTexts: bundle.state.editableTexts,
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
    resourceSlug: string;
  },
) =>
  await convex.query(api.successRooms.getResourceFileForDownload, {
    slug: roomSlug,
    accessToken,
    resourceSlug: args.resourceSlug,
  });

export const getProtectedSuccessRoomGlobalFile = async (
  roomSlug: string,
  accessToken: string,
  key: 'julien-newman-photo',
) =>
  await convex.query(api.successRooms.getGlobalFileForDownload, {
    slug: roomSlug,
    accessToken,
    key,
  });
