import { v, type Infer } from 'convex/values';

// A meeting is one hour split into four fixed 15-minute agenda slots.
export const kickoffMeetingAgendaSlotCount = 4;

// The kickoff schedule is a fixed grid: a meeting sits at one (column, row) cell.
export const kickoffScheduleColumns = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
] as const;

export const kickoffScheduleRowKeys = ['1', '2', '3', '4', '5'] as const;

export const successRoomKickoffMeetingValidator = v.object({
  title: v.string(),
  attendeeKeys: v.array(v.string()),
  agenda: v.array(v.string()),
});

// Record keys must be v.string() — Convex rejects literal-union record keys —
// so the sanitizer whitelists column keys against kickoffScheduleColumns.
export const successRoomKickoffScheduleStateValidator = v.object({
  rows: v.array(
    v.object({
      key: v.string(),
      cells: v.record(v.string(), successRoomKickoffMeetingValidator),
    }),
  ),
});

export const successRoomKickoffScheduleActionValidator = v.union(
  v.object({
    type: v.literal('place-meeting'),
    rowKey: v.string(),
    columnKey: v.string(),
    meeting: successRoomKickoffMeetingValidator,
  }),
  v.object({
    type: v.literal('clear-cell'),
    rowKey: v.string(),
    columnKey: v.string(),
  }),
  v.object({
    type: v.literal('patch-meeting'),
    rowKey: v.string(),
    columnKey: v.string(),
    meeting: successRoomKickoffMeetingValidator,
  }),
);

export type SuccessRoomKickoffMeeting = Infer<typeof successRoomKickoffMeetingValidator>;
export type SuccessRoomKickoffScheduleState = Infer<
  typeof successRoomKickoffScheduleStateValidator
>;
export type SuccessRoomKickoffScheduleAction = Infer<
  typeof successRoomKickoffScheduleActionValidator
>;

export const createDefaultKickoffScheduleState = (): SuccessRoomKickoffScheduleState => ({
  rows: kickoffScheduleRowKeys.map((key) => ({ key, cells: {} })),
});

// Every action targets exactly one cell.
const applyToCells = (
  cells: Record<string, SuccessRoomKickoffMeeting>,
  action: SuccessRoomKickoffScheduleAction,
) => {
  switch (action.type) {
    case 'place-meeting':
      return { ...cells, [action.columnKey]: action.meeting };
    case 'clear-cell': {
      const next = { ...cells };

      delete next[action.columnKey];

      return next;
    }
    case 'patch-meeting':
      // Patching an empty cell is a no-op: a stale client must not be able to
      // resurrect a deleted meeting.
      return cells[action.columnKey] ? { ...cells, [action.columnKey]: action.meeting } : cells;
  }
};

export const applySuccessRoomKickoffScheduleAction = (
  schedule: SuccessRoomKickoffScheduleState,
  action: SuccessRoomKickoffScheduleAction,
): SuccessRoomKickoffScheduleState => ({
  rows: schedule.rows.map((row) =>
    row.key === action.rowKey ? { key: row.key, cells: applyToCells(row.cells, action) } : row,
  ),
});

// The slug 'monday-2' names the cell at column 'monday', row '2'.
export type KickoffCell = { rowKey: string; columnKey: string };

export const getKickoffMeetingSlug = ({ rowKey, columnKey }: KickoffCell) =>
  `${columnKey}-${rowKey}`;

export const parseKickoffMeetingSlug = (slug: string): KickoffCell | null => {
  const parts = slug.split('-');
  if (parts.length !== 2) return null;

  const [columnKey, rowKey] = parts;
  const isKnownColumn = kickoffScheduleColumns.some((column) => column.key === columnKey);
  const isKnownRow = (kickoffScheduleRowKeys as readonly string[]).includes(rowKey);

  return isKnownColumn && isKnownRow ? { rowKey, columnKey } : null;
};

export const isKickoffMeetingSlug = (slug: string) => parseKickoffMeetingSlug(slug) !== null;

export const getKickoffMeeting = (
  schedule: SuccessRoomKickoffScheduleState,
  cell: KickoffCell,
): SuccessRoomKickoffMeeting | null =>
  schedule.rows.find((row) => row.key === cell.rowKey)?.cells[cell.columnKey] ?? null;
