import {
  successRoomResourceDefinitions,
  type SuccessRoomAssetResourceSlug,
  type SuccessRoomResourceSlug
} from '../../../../shared/successRoomResources';

type SuccessRoomResourceDefinition = (typeof successRoomResourceDefinitions)[number];
const assetResourceKinds = new Set(['pdf', 'audio']);

export type SuccessRoomEditableTextResourceSlug = Extract<
  SuccessRoomResourceDefinition,
  { kind: 'editable-text' }
>['slug'];

export type SuccessRoomKickoffScheduleResourceSlug = Extract<
  SuccessRoomResourceDefinition,
  { kind: 'kickoff-schedule' }
>['slug'];

const getSuccessRoomResourceDefinition = (resourceSlug: string) =>
  successRoomResourceDefinitions.find((resource) => resource.slug === resourceSlug);

export const isSuccessRoomResourceSlug = (
  resourceSlug: string,
): resourceSlug is SuccessRoomResourceSlug =>
  Boolean(getSuccessRoomResourceDefinition(resourceSlug));

export const isSuccessRoomAssetResourceSlug = (
  resourceSlug: string,
): resourceSlug is SuccessRoomAssetResourceSlug => {
  const resource = getSuccessRoomResourceDefinition(resourceSlug);

  return Boolean(resource && assetResourceKinds.has(resource.kind));
};
