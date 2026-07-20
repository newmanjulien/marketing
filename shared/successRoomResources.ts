import { v, type Infer } from 'convex/values';

export const successRoomDescription =
  "A shared space for everything we create while preparing for a proof of concept and deciding whether to collaborate";

export const deckResourceKey = "deck";
export const audioResourceKey = "audio";
export const mutualSuccessPlanResourceKey = "mutual-success-plan";
export const initialFormatResourceKey = "initial-format";
export const kickoffScheduleResourceKey = "kickoff-schedule";

export const deckResourceDefinition = {
  kind: "pdf",
  slug: deckResourceKey,
  title: "Sales deck",
  actionLabel: "Download your custom deck",
} as const;

export const audioResourceDefinition = {
  kind: "audio",
  slug: audioResourceKey,
  title: "Audio summary",
  actionLabel: "Download your audio summary",
} as const;

export const mutualSuccessPlanResourceDefinition = {
  kind: "mutual-success-plan",
  slug: mutualSuccessPlanResourceKey,
  title: "Mutual success plan",
  actionLabel: "View and edit your mutual success plan",
  description:
    "Review how we will work together to start generating revenue for your business quickly and smoothly",
} as const;

export const initialFormatResourceDefinition = {
  kind: "editable-text",
  slug: initialFormatResourceKey,
  title: "Initial email format",
  actionLabel: "View and edit your initial email format",
  description:
    "Review and edit the initial email format we will send to your team during the proof of concept",
  editorRows: 14,
} as const;

export const kickoffScheduleResourceDefinition = {
  kind: "kickoff-schedule",
  slug: kickoffScheduleResourceKey,
  title: "Kickoff schedule",
  actionLabel: "View and edit your kickoff schedule",
  description:
    "Review and edit the schedule for Overbase's engineer to come to your office and kick off our collaboration in person",
} as const;

export const successRoomResourceKeyValidator = v.union(
  v.literal(deckResourceKey),
  v.literal(audioResourceKey),
  v.literal(mutualSuccessPlanResourceKey),
  v.literal(initialFormatResourceKey),
  v.literal(kickoffScheduleResourceKey),
);

// Deck and audio are uploaded assets; the rest render as routed pages.
export const assetSuccessRoomResourceKeyValidator = v.union(
  v.literal(deckResourceKey),
  v.literal(audioResourceKey),
);

export const routedSuccessRoomResourceKeyValidator = v.union(
  v.literal(mutualSuccessPlanResourceKey),
  v.literal(initialFormatResourceKey),
  v.literal(kickoffScheduleResourceKey),
);

export type SuccessRoomResourceKey = Infer<typeof successRoomResourceKeyValidator>;
export type AssetSuccessRoomResourceKey = Infer<typeof assetSuccessRoomResourceKeyValidator>;
export type RoutedSuccessRoomResourceKey = Infer<typeof routedSuccessRoomResourceKeyValidator>;

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
