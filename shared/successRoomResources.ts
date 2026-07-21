import { v, type Infer } from 'convex/values';

export const successRoomDescription =
  "A shared space for everything we create while preparing for a proof of concept and deciding whether to collaborate";

export const deckResourceSlug = "deck";
export const audioResourceSlug = "audio";
export const mutualSuccessPlanResourceSlug = "mutual-success-plan";
export const initialFormatResourceSlug = "initial-format";
export const kickoffScheduleResourceSlug = "kickoff-schedule";

export const deckResourceDefinition = {
  kind: "pdf",
  slug: deckResourceSlug,
  title: "Sales deck",
  actionLabel: "Download your custom deck",
} as const;

export const audioResourceDefinition = {
  kind: "audio",
  slug: audioResourceSlug,
  title: "Audio summary",
  actionLabel: "Download your audio summary",
} as const;

export const mutualSuccessPlanResourceDefinition = {
  kind: "mutual-success-plan",
  slug: mutualSuccessPlanResourceSlug,
  title: "Mutual success plan",
  actionLabel: "View and edit your mutual success plan",
  description:
    "Review how we will work together to start generating revenue for your business quickly and smoothly",
} as const;

export const initialFormatResourceDefinition = {
  kind: "editable-text",
  slug: initialFormatResourceSlug,
  title: "Initial email format",
  actionLabel: "View and edit your initial email format",
  description:
    "Review and edit the initial email format we will send to your team during the proof of concept",
  editorRows: 14,
  editorPlaceholder: "Write the initial email format",
} as const;

export const kickoffScheduleResourceDefinition = {
  kind: "kickoff-schedule",
  slug: kickoffScheduleResourceSlug,
  title: "Kickoff schedule",
  actionLabel: "View and edit your kickoff schedule",
  description:
    "Review and edit the schedule for Overbase's engineer to come to your office and kick off our collaboration in person",
} as const;

export const successRoomResourceSlugValidator = v.union(
  v.literal(deckResourceSlug),
  v.literal(audioResourceSlug),
  v.literal(mutualSuccessPlanResourceSlug),
  v.literal(initialFormatResourceSlug),
  v.literal(kickoffScheduleResourceSlug),
);

// Deck and audio are uploaded assets; the rest render as routed pages.
export const successRoomAssetResourceSlugValidator = v.union(
  v.literal(deckResourceSlug),
  v.literal(audioResourceSlug),
);

export const successRoomRoutedResourceSlugValidator = v.union(
  v.literal(mutualSuccessPlanResourceSlug),
  v.literal(initialFormatResourceSlug),
  v.literal(kickoffScheduleResourceSlug),
);

export type SuccessRoomResourceSlug = Infer<typeof successRoomResourceSlugValidator>;
export type SuccessRoomAssetResourceSlug = Infer<typeof successRoomAssetResourceSlugValidator>;
export type SuccessRoomRoutedResourceSlug = Infer<typeof successRoomRoutedResourceSlugValidator>;

export const successRoomResourceDefinitions = [
  deckResourceDefinition,
  audioResourceDefinition,
  mutualSuccessPlanResourceDefinition,
  initialFormatResourceDefinition,
  kickoffScheduleResourceDefinition,
] as const;

export const kickoffScheduleColumns = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
] as const;

export const kickoffScheduleRowKeys = [
  "row-1",
  "row-2",
  "row-3",
  "row-4",
  "row-5",
] as const;
