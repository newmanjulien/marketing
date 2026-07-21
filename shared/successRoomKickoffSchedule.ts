import { v, type Infer } from 'convex/values';
import { kickoffScheduleRowKeys } from './successRoomResources';

export const successRoomKickoffScheduleStateValidator = v.object({
  rows: v.array(
    v.object({
      key: v.string(),
      cells: v.record(v.string(), v.string()),
    }),
  ),
});

export type SuccessRoomKickoffScheduleState = Infer<
  typeof successRoomKickoffScheduleStateValidator
>;

export const createDefaultKickoffScheduleState = (): SuccessRoomKickoffScheduleState => ({
  rows: kickoffScheduleRowKeys.map((key) => ({
    key,
    cells: {},
  })),
});
