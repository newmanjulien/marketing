import type { SuccessRoomResource } from './successRoomTypes';

export const successRoomDescription =
  'Review the shared materials for evaluating Overbase and aligning on a practical proof of concept.';

type SuccessRoomResourceDefinitionBase<Kind extends SuccessRoomResource['kind']> = {
  kind: Kind;
  slug: string;
  title: string;
  actionLabel: string;
  description?: string;
};

export type SuccessRoomAssetResourceDefinition = SuccessRoomResourceDefinitionBase<
  'pdf' | 'audio' | 'downloadable-file'
>;

export type SuccessRoomMutualSuccessPlanResourceDefinition =
  SuccessRoomResourceDefinitionBase<'mutual-success-plan'> & {
    description: string;
  };

export type SuccessRoomEditableTextResourceDefinition =
  SuccessRoomResourceDefinitionBase<'editable-text'> & {
    description: string;
    editorRows?: number;
  };

export type SuccessRoomResourceDefinition =
  | SuccessRoomAssetResourceDefinition
  | SuccessRoomMutualSuccessPlanResourceDefinition
  | SuccessRoomEditableTextResourceDefinition;

export const successRoomResourceDefinitions = [
  {
    kind: 'pdf',
    slug: 'deck',
    title: 'Sales deck',
    actionLabel: 'Download the custom sales deck'
  },
  {
    kind: 'audio',
    slug: 'audio',
    title: 'Audio summary',
    actionLabel: 'Download the audio summary'
  },
  {
    kind: 'mutual-success-plan',
    slug: 'mutual-success-plan',
    title: 'Mutual success plan',
    actionLabel: 'Create the mutual success plan',
    description:
      'Align on success criteria, next steps, and owners for a practical proof of concept.'
  },
  {
    kind: 'editable-text',
    slug: 'initial-format',
    title: 'Initial email format',
    actionLabel: 'Create the initial email format',
    description: 'Edit a simple starting email format for the first Overbase follow-up.',
    editorRows: 14
  }
] as const satisfies readonly SuccessRoomResourceDefinition[];

export type SuccessRoomAssetResourceSlug = Extract<
  (typeof successRoomResourceDefinitions)[number],
  { kind: 'pdf' | 'audio' | 'downloadable-file' }
>['slug'];

export type SuccessRoomEditableTextResourceSlug = Extract<
  (typeof successRoomResourceDefinitions)[number],
  { kind: 'editable-text' }
>['slug'];

export const getSuccessRoomResourceDefinition = (resourceSlug: string) =>
  successRoomResourceDefinitions.find((resource) => resource.slug === resourceSlug);

export const isSuccessRoomAssetResourceDefinition = (
  resource: SuccessRoomResourceDefinition,
): resource is SuccessRoomAssetResourceDefinition =>
  resource.kind === 'pdf' || resource.kind === 'audio' || resource.kind === 'downloadable-file';

export const isSuccessRoomAssetResourceSlug = (
  resourceSlug: string,
): resourceSlug is SuccessRoomAssetResourceSlug =>
  successRoomResourceDefinitions.some(
    (resource) => resource.slug === resourceSlug && isSuccessRoomAssetResourceDefinition(resource)
  );

export const isSuccessRoomEditableTextResourceSlug = (
  resourceSlug: string,
): resourceSlug is SuccessRoomEditableTextResourceSlug =>
  successRoomResourceDefinitions.some(
    (resource) => resource.slug === resourceSlug && resource.kind === 'editable-text'
  );
