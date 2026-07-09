import type { SuccessRoomResource } from "./types";
export { kickoffScheduleColumns } from "../../../../shared/successRoomResources";

export const successRoomDescription =
  "A shared space for everything we create while preparing for a proof of concept and deciding whether to collaborate.";

type SuccessRoomResourceDefinitionBase<
  Kind extends SuccessRoomResource["kind"],
> = {
  kind: Kind;
  slug: string;
  title: string;
  actionLabel: string;
  description?: string;
};

export type SuccessRoomAssetResourceDefinition =
  SuccessRoomResourceDefinitionBase<"pdf" | "audio" | "downloadable-file">;

export type SuccessRoomMutualSuccessPlanResourceDefinition =
  SuccessRoomResourceDefinitionBase<"mutual-success-plan"> & {
    description: string;
  };

export type SuccessRoomEditableTextResourceDefinition =
  SuccessRoomResourceDefinitionBase<"editable-text"> & {
    description: string;
    editorRows?: number;
  };

export type SuccessRoomKickoffScheduleResourceDefinition =
  SuccessRoomResourceDefinitionBase<"kickoff-schedule"> & {
    description: string;
  };

export type SuccessRoomResourceDefinition =
  | SuccessRoomAssetResourceDefinition
  | SuccessRoomMutualSuccessPlanResourceDefinition
  | SuccessRoomEditableTextResourceDefinition
  | SuccessRoomKickoffScheduleResourceDefinition;

export const successRoomResourceDefinitions = [
  {
    kind: "pdf",
    slug: "deck",
    title: "Sales deck",
    actionLabel: "Download your custom deck",
  },
  {
    kind: "audio",
    slug: "audio",
    title: "Audio summary",
    actionLabel: "Download your audio summary",
  },
  {
    kind: "mutual-success-plan",
    slug: "mutual-success-plan",
    title: "Mutual success plan",
    actionLabel: "View and edit your mutual success plan",
    description:
      "Review how we will work together to start generating revenue for your business quickly and smoothly.",
  },
  {
    kind: "editable-text",
    slug: "initial-format",
    title: "Initial email format",
    actionLabel: "View and edit your initial email format",
    description:
      "Review and edit the initial email format we will send to your team during the proof of concept.",
    editorRows: 14,
  },
  {
    kind: "kickoff-schedule",
    slug: "kickoff-schedule",
    title: "Kickoff schedule",
    actionLabel: "View and edit your kickoff schedule",
    description:
      "Review and edit the schedule for Overbase's engineer to come to your office and kick off our collaboration in person.",
  },
] as const satisfies readonly SuccessRoomResourceDefinition[];

export type SuccessRoomAssetResourceSlug = Extract<
  (typeof successRoomResourceDefinitions)[number],
  { kind: "pdf" | "audio" | "downloadable-file" }
>["slug"];

export type SuccessRoomEditableTextResourceSlug = Extract<
  (typeof successRoomResourceDefinitions)[number],
  { kind: "editable-text" }
>["slug"];

export type SuccessRoomKickoffScheduleResourceSlug = Extract<
  (typeof successRoomResourceDefinitions)[number],
  { kind: "kickoff-schedule" }
>["slug"];

export const getSuccessRoomResourceDefinition = (resourceSlug: string) =>
  successRoomResourceDefinitions.find(
    (resource) => resource.slug === resourceSlug,
  );

export const isSuccessRoomAssetResourceDefinition = (
  resource: SuccessRoomResourceDefinition,
): resource is SuccessRoomAssetResourceDefinition =>
  resource.kind === "pdf" ||
  resource.kind === "audio" ||
  resource.kind === "downloadable-file";

export const isSuccessRoomAssetResourceSlug = (
  resourceSlug: string,
): resourceSlug is SuccessRoomAssetResourceSlug =>
  successRoomResourceDefinitions.some(
    (resource) =>
      resource.slug === resourceSlug &&
      isSuccessRoomAssetResourceDefinition(resource),
  );

export const isSuccessRoomEditableTextResourceSlug = (
  resourceSlug: string,
): resourceSlug is SuccessRoomEditableTextResourceSlug =>
  successRoomResourceDefinitions.some(
    (resource) =>
      resource.slug === resourceSlug && resource.kind === "editable-text",
  );

export const isSuccessRoomKickoffScheduleResourceSlug = (
  resourceSlug: string,
): resourceSlug is SuccessRoomKickoffScheduleResourceSlug =>
  successRoomResourceDefinitions.some(
    (resource) =>
      resource.slug === resourceSlug && resource.kind === "kickoff-schedule",
  );
