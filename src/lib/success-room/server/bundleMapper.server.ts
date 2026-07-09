import { api } from '../../../../convex/_generated/api';
import type { FunctionReturnType } from 'convex/server';
import {
  successRoomDescription,
  successRoomResourceDefinitions
} from '$lib/success-room/domain/config';
import {
  getSuccessRoomEditableAttachmentPath,
  getSuccessRoomResourceFilePath,
  getSuccessRoomTeamMemberPhotoPath
} from '$lib/success-room/domain/urls';
import type {
  SuccessRoomAssetResourceDefinition,
  SuccessRoomEditableTextResourceDefinition,
  SuccessRoomKickoffScheduleResourceDefinition,
  SuccessRoomMutualSuccessPlanResourceDefinition,
  SuccessRoomResourceDefinition
} from '$lib/success-room/domain/config';
import type {
  SuccessRoom,
  SuccessRoomAssetDelivery,
  SuccessRoomAudioResource,
  SuccessRoomDownloadableFileResource,
  SuccessRoomEditableTextResource,
  SuccessRoomKickoffScheduleResource,
  SuccessRoomLinkedFileMetadata,
  SuccessRoomLinkedTeamMemberPhotoMetadata,
  SuccessRoomMutualSuccessPlanCatalog,
  SuccessRoomMutualSuccessPlanResource,
  SuccessRoomPdfResource,
  SuccessRoomResource,
  SuccessRoomRouteDelivery,
  SuccessRoomState,
  SuccessRoomTeamMember
} from '$lib/success-room/domain/types';

type RoomBundle = FunctionReturnType<typeof api.successRooms.getRoomBundle>;

const routeDelivery = { type: 'route' } satisfies SuccessRoomRouteDelivery;

const assetDelivery = (roomSlug: string, resourceSlug: string): SuccessRoomAssetDelivery => ({
  type: 'asset',
  href: getSuccessRoomResourceFilePath(roomSlug, resourceSlug),
});

const editableAttachmentHref = (roomSlug: string, resourceSlug: string) =>
  getSuccessRoomEditableAttachmentPath(roomSlug, resourceSlug);

const mapTeamMember = (
  roomSlug: string,
  member: RoomBundle['room']['team'][number],
): SuccessRoomTeamMember => {
  const photo = 'photo' in member ? member.photo : undefined;
  const teamMemberPhoto =
    photo
      ? ({
          ...photo,
          href: getSuccessRoomTeamMemberPhotoPath(roomSlug, member.id),
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

const mapKickoffScheduleResource = (
  resource: SuccessRoomKickoffScheduleResourceDefinition,
): SuccessRoomKickoffScheduleResource => ({
  kind: resource.kind,
  slug: resource.slug,
  title: resource.title,
  actionLabel: resource.actionLabel,
  description: resource.description,
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
    case 'kickoff-schedule':
      return mapKickoffScheduleResource(resource);
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
                href: editableAttachmentHref(roomSlug, resourceSlug),
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

export const mapSuccessRoomBundle = (
  bundle: RoomBundle,
): { room: SuccessRoom; state: SuccessRoomState } => {
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
      benefitCards: bundle.room.benefitCards,
      team: teamMembers,
      resources,
    },
    state: {
      benefits: {
        selectedCardIds: bundle.state.benefits.selectedCardIds,
        painPoints: bundle.state.benefits.painPoints,
      },
      ...(mutualSuccessPlan ? { mutualSuccessPlan } : {}),
      editableTexts: mapEditableTextStates(bundle.room.slug, bundle.state.editableTexts),
      kickoffSchedules: bundle.state.kickoffSchedules,
    },
  };
};
