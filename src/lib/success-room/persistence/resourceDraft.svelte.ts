import {
  attachSuccessRoomSaveQueueLifecycle,
  createSuccessRoomSaveQueue
} from './saveQueue';
import { applySuccessRoomPlanAction } from '../../../../shared/successRoomPlan';
import { createSyncedSnapshot, scheduleJsonSave } from './autosave.svelte';
import {
  cloneKickoffScheduleState,
  cloneEditableTextState,
  clonePlan,
  getDefaultKickoffScheduleState,
  getDefaultEditableTextState,
  getDefaultPlanState
} from '../domain/state';
import type {
  SuccessRoomEditableTextResourceSlug,
  SuccessRoomKickoffScheduleResourceSlug
} from '../domain/config';
import type {
  SuccessRoomEditableTextState,
  SuccessRoomKickoffScheduleState,
  SuccessRoomPlanAction,
  SuccessRoomPlanState,
  SuccessRoomResourceRoom,
  SuccessRoomRoutedResource,
  SuccessRoomResourceState
} from '../domain/types';

type SuccessRoomResourceDraftSnapshot = {
  roomResourceIdentity: string;
  plan: SuccessRoomPlanState;
  editableText: SuccessRoomEditableTextState;
  kickoffSchedule: SuccessRoomKickoffScheduleState;
};

const createResourceDraftSnapshot = (
  room: SuccessRoomResourceRoom,
  resource: SuccessRoomRoutedResource,
  state: SuccessRoomResourceState,
): SuccessRoomResourceDraftSnapshot => {
  return {
    roomResourceIdentity: `${room.slug}:${resource.slug}`,
    plan:
      state.kind === 'mutual-success-plan'
        ? clonePlan(state.plan)
        : getDefaultPlanState(),
    editableText:
      state.kind === 'editable-text'
        ? cloneEditableTextState(state.editableText)
        : getDefaultEditableTextState(),
    kickoffSchedule:
      state.kind === 'kickoff-schedule'
        ? cloneKickoffScheduleState(state.kickoffSchedule)
        : getDefaultKickoffScheduleState()
  };
};

export const createSuccessRoomResourceDraft = (
  getRoom: () => SuccessRoomResourceRoom,
  getResource: () => SuccessRoomRoutedResource,
  getState: () => SuccessRoomResourceState,
) => {
  const saveQueue = createSuccessRoomSaveQueue();
  const initialSnapshot = createResourceDraftSnapshot(
    getRoom(),
    getResource(),
    getState()
  );
  const draft = createSyncedSnapshot({
    initial: initialSnapshot,
    getSnapshot: () => createResourceDraftSnapshot(getRoom(), getResource(), getState()),
    shouldReplace: (current, next) =>
      current.roomResourceIdentity !== next.roomResourceIdentity
  });

  attachSuccessRoomSaveQueueLifecycle(saveQueue);

  const requireEditableTextResourceSlug = (): SuccessRoomEditableTextResourceSlug => {
    const resource = getResource();

    if (resource.kind !== 'editable-text') {
      throw new Error('Current success-room resource is not editable text.');
    }

    return resource.slug;
  };

  const requireKickoffScheduleResourceSlug = (): SuccessRoomKickoffScheduleResourceSlug => {
    const resource = getResource();

    if (resource.kind !== 'kickoff-schedule') {
      throw new Error('Current success-room resource is not a kickoff schedule.');
    }

    return resource.slug;
  };

  const getPlanActionSaveKey = (action: SuccessRoomPlanAction) =>
    action.type === 'open-accordion'
      ? 'plan:open-accordion'
      : `plan:${action.taskKey}:${action.type}`;

  const savePlanAction = (action: SuccessRoomPlanAction) => {
    scheduleJsonSave({
      saveQueue,
      key: getPlanActionSaveKey(action),
      roomSlug: getRoom().slug,
      endpoint: 'plan',
      body: { action },
      errorMessage: 'Success room plan could not be saved.'
    });
  };

  const saveEditableTextState = (
    resourceSlug: SuccessRoomEditableTextResourceSlug,
    editableState: SuccessRoomEditableTextState,
  ) => {
    const stateToSave = cloneEditableTextState(editableState);

    scheduleJsonSave({
      saveQueue,
      key: `editable-text:${resourceSlug}`,
      roomSlug: getRoom().slug,
      endpoint: 'editable-text',
      body: {
        resourceSlug,
        editableText: {
          content: stateToSave.content,
          dataSources: stateToSave.dataSources
        }
      },
      errorMessage: 'Success room editable text could not be saved.',
      debounceMs: 500
    });
  };

  const saveKickoffScheduleState = (
    resourceSlug: SuccessRoomKickoffScheduleResourceSlug,
    schedule: SuccessRoomKickoffScheduleState,
  ) => {
    const scheduleToSave = cloneKickoffScheduleState(schedule);

    scheduleJsonSave({
      saveQueue,
      key: `kickoff-schedule:${resourceSlug}`,
      roomSlug: getRoom().slug,
      endpoint: 'kickoff-schedule',
      body: {
        resourceSlug,
        kickoffSchedule: scheduleToSave
      },
      errorMessage: 'Success room kickoff schedule could not be saved.',
      debounceMs: 500
    });
  };

  const setEditableTextState = (
    resourceSlug: SuccessRoomEditableTextResourceSlug,
    editableState: SuccessRoomEditableTextState,
  ) => {
    const nextState = cloneEditableTextState(editableState);

    draft.replace({
      ...draft.current,
      editableText: nextState
    });
    saveEditableTextState(resourceSlug, nextState);
  };

  const setKickoffScheduleState = (
    resourceSlug: SuccessRoomKickoffScheduleResourceSlug,
    schedule: SuccessRoomKickoffScheduleState,
  ) => {
    const nextState = cloneKickoffScheduleState(schedule);

    draft.replace({
      ...draft.current,
      kickoffSchedule: nextState
    });
    saveKickoffScheduleState(resourceSlug, nextState);
  };

  return {
    get plan() {
      return draft.current.plan;
    },
    dispatchPlanAction(action: SuccessRoomPlanAction) {
      const nextPlan = applySuccessRoomPlanAction(draft.current.plan, action);

      draft.replace({
        ...draft.current,
        plan: nextPlan
      });
      savePlanAction(action);
    },
    get editableTextState() {
      return draft.current.editableText;
    },
    set editableTextState(editableState: SuccessRoomEditableTextState) {
      setEditableTextState(requireEditableTextResourceSlug(), editableState);
    },
    get kickoffScheduleState() {
      return draft.current.kickoffSchedule;
    },
    set kickoffScheduleState(schedule: SuccessRoomKickoffScheduleState) {
      setKickoffScheduleState(requireKickoffScheduleResourceSlug(), schedule);
    }
  };
};
