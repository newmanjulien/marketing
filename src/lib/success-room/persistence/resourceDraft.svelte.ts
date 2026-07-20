import {
  attachSuccessRoomSaveQueueLifecycle,
  createSuccessRoomSaveQueue
} from './saveQueue';
import { applySuccessRoomPlanAction } from '../../../../shared/successRoomPlan';
import { createSyncedSnapshot, scheduleJsonSave } from './autosave.svelte';
import {
  cloneKickoffScheduleState,
  cloneEditableTextState,
  clonePlan
} from '../domain/state';
import type {
  SuccessRoomEditableTextAttachmentUpdate,
  SuccessRoomEditableTextResource,
  SuccessRoomEditableTextState,
  SuccessRoomKickoffScheduleResource,
  SuccessRoomKickoffScheduleState,
  SuccessRoomMutualSuccessPlanResource,
  SuccessRoomPlanAction,
  SuccessRoomPlanState,
  SuccessRoomResourceRoom,
  SuccessRoomResourceState,
  SuccessRoomRoutedResource
} from '../domain/types';

export type SuccessRoomResourceDraftSnapshot =
  | {
      kind: 'mutual-success-plan';
      roomSlug: string;
      resource: SuccessRoomMutualSuccessPlanResource;
      plan: SuccessRoomPlanState;
    }
  | {
      kind: 'editable-text';
      roomSlug: string;
      resource: SuccessRoomEditableTextResource;
      editableText: SuccessRoomEditableTextState;
    }
  | {
      kind: 'kickoff-schedule';
      roomSlug: string;
      resource: SuccessRoomKickoffScheduleResource;
      kickoffSchedule: SuccessRoomKickoffScheduleState;
    };

// The server pairs every routed resource with state of the same kind, but the
// two arrive as separate unions the compiler cannot co-narrow. This is the one
// place that contract is checked; everything downstream works with the
// combined discriminated union.
const createResourceDraftSnapshot = (
  room: SuccessRoomResourceRoom,
  resource: SuccessRoomRoutedResource,
  state: SuccessRoomResourceState,
): SuccessRoomResourceDraftSnapshot => {
  const roomSlug = room.slug;

  if (resource.kind === 'mutual-success-plan' && state.kind === 'mutual-success-plan') {
    return { kind: resource.kind, roomSlug, resource, plan: clonePlan(state.plan) };
  }

  if (resource.kind === 'editable-text' && state.kind === 'editable-text') {
    return {
      kind: resource.kind,
      roomSlug,
      resource,
      editableText: cloneEditableTextState(state.editableText)
    };
  }

  if (resource.kind === 'kickoff-schedule' && state.kind === 'kickoff-schedule') {
    return {
      kind: resource.kind,
      roomSlug,
      resource,
      kickoffSchedule: cloneKickoffScheduleState(state.kickoffSchedule)
    };
  }

  throw new Error(
    `Success room resource "${resource.slug}" (${resource.kind}) received "${state.kind}" state.`
  );
};

const getPlanActionSaveKey = (action: SuccessRoomPlanAction) =>
  action.type === 'set-open-accordion'
    ? 'plan:open-accordion'
    : `plan:${action.taskKey}:${action.type}`;

export const createSuccessRoomResourceDraft = (
  getRoom: () => SuccessRoomResourceRoom,
  getResource: () => SuccessRoomRoutedResource,
  getState: () => SuccessRoomResourceState,
) => {
  const saveQueue = createSuccessRoomSaveQueue();
  const draft = createSyncedSnapshot({
    initial: createResourceDraftSnapshot(getRoom(), getResource(), getState()),
    getSnapshot: () => createResourceDraftSnapshot(getRoom(), getResource(), getState()),
    shouldReplace: (current, next) =>
      current.roomSlug !== next.roomSlug || current.resource.slug !== next.resource.slug
  });

  attachSuccessRoomSaveQueueLifecycle(saveQueue);

  const dispatchPlanAction = (action: SuccessRoomPlanAction) => {
    const current = draft.current;

    if (current.kind !== 'mutual-success-plan') {
      throw new Error('Current success-room resource is not a mutual success plan.');
    }

    draft.replace({ ...current, plan: applySuccessRoomPlanAction(current.plan, action) });
    scheduleJsonSave({
      saveQueue,
      key: getPlanActionSaveKey(action),
      roomSlug: current.roomSlug,
      endpoint: 'plan',
      body: { action },
      errorMessage: 'Success room plan could not be saved.'
    });
  };

  const setEditableTextState = (editableState: SuccessRoomEditableTextState) => {
    const current = draft.current;

    if (current.kind !== 'editable-text') {
      throw new Error('Current success-room resource is not editable text.');
    }

    const editableText = cloneEditableTextState(editableState);

    draft.replace({ ...current, editableText });
    scheduleJsonSave({
      saveQueue,
      key: `editable-text:${current.resource.slug}`,
      roomSlug: current.roomSlug,
      endpoint: 'editable-text',
      body: {
        editableText: {
          content: editableText.content,
          dataSources: editableText.dataSources,
          success: editableText.success
        }
      },
      errorMessage: 'Success room editable text could not be saved.',
      debounceMs: 500
    });
  };

  const applyPersistedEditableTextAttachment = ({
    roomSlug,
    resourceSlug,
    attachment
  }: SuccessRoomEditableTextAttachmentUpdate) => {
    const current = draft.current;

    if (
      current.kind !== 'editable-text' ||
      current.roomSlug !== roomSlug ||
      current.resource.slug !== resourceSlug
    ) {
      return;
    }

    const { attachment: _currentAttachment, ...editableText } = current.editableText;

    draft.replace({
      ...current,
      editableText: { ...editableText, ...(attachment ? { attachment } : {}) }
    });
  };

  const setKickoffScheduleState = (schedule: SuccessRoomKickoffScheduleState) => {
    const current = draft.current;

    if (current.kind !== 'kickoff-schedule') {
      throw new Error('Current success-room resource is not a kickoff schedule.');
    }

    const kickoffSchedule = cloneKickoffScheduleState(schedule);

    draft.replace({ ...current, kickoffSchedule });
    scheduleJsonSave({
      saveQueue,
      key: `kickoff-schedule:${current.resource.slug}`,
      roomSlug: current.roomSlug,
      endpoint: 'kickoff-schedule',
      body: { kickoffSchedule },
      errorMessage: 'Success room kickoff schedule could not be saved.',
      debounceMs: 500
    });
  };

  return {
    get current() {
      return draft.current;
    },
    dispatchPlanAction,
    setEditableTextState,
    applyPersistedEditableTextAttachment,
    setKickoffScheduleState
  };
};
