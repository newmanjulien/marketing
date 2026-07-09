export const kickoffScheduleResourceKey = "kickoff-schedule";

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

export type KickoffScheduleColumnKey = (typeof kickoffScheduleColumns)[number]["key"];
export type KickoffScheduleRowKey = (typeof kickoffScheduleRowKeys)[number];
