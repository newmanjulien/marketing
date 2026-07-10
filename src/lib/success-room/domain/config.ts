export {
  kickoffScheduleColumns,
  successRoomDescription,
  successRoomResourceDefinitions
} from '../../../../shared/successRoomResources';
import { successRoomResourceDefinitions } from '../../../../shared/successRoomResources';

type SuccessRoomResourceDefinition = (typeof successRoomResourceDefinitions)[number];
const assetResourceKinds = new Set(['pdf', 'audio']);

type SuccessRoomAssetResourceSlug = Extract<
  SuccessRoomResourceDefinition,
  { kind: 'pdf' | 'audio' }
>['slug'];

export type SuccessRoomEditableTextResourceSlug = Extract<
  SuccessRoomResourceDefinition,
  { kind: 'editable-text' }
>['slug'];

export type SuccessRoomKickoffScheduleResourceSlug = Extract<
  SuccessRoomResourceDefinition,
  { kind: 'kickoff-schedule' }
>['slug'];

export type SuccessRoomRoutedResourceSlug = Exclude<
  SuccessRoomResourceDefinition['slug'],
  SuccessRoomAssetResourceSlug
>;

const getSuccessRoomResourceDefinition = (resourceSlug: string) =>
  successRoomResourceDefinitions.find((resource) => resource.slug === resourceSlug);

export const isSuccessRoomRoutedResourceSlug = (
  resourceSlug: string,
): resourceSlug is SuccessRoomRoutedResourceSlug => {
  const resource = getSuccessRoomResourceDefinition(resourceSlug);

  return Boolean(resource && !assetResourceKinds.has(resource.kind));
};
