import { createSuccessRoomSaveQueue } from './saveQueue';
import {
  applySuccessRoomPlanAction,
  type SuccessRoomPlanAction,
  type SuccessRoomPlanState
} from '$shared/successRoomPlan';
import {
  applySuccessRoomKickoffScheduleAction,
  type SuccessRoomKickoffScheduleAction,
  type SuccessRoomKickoffScheduleState
} from '$shared/successRoomKickoffSchedule';
import { createSyncedSnapshot, scheduleJsonSave } from './autosave.svelte';
import {
  cloneKickoffScheduleState,
  cloneEditableTextState,
  clonePlan
} from '../domain/state';
import {
  deleteEditableTextAttachment,
  uploadEditableTextAttachment
} from '../editable-text/editableTextClient';
import type {
  SuccessRoomAttachmentOperation,
  SuccessRoomEditableTextResource,
  SuccessRoomEditableTextState,
  SuccessRoomKickoffScheduleResource,
  SuccessRoomLinkedFileMetadata,
  SuccessRoomMutualSuccessPlanResource,
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

// One key per cell is safe across action types only because place/clear (the
// schedule panel) and patch (the meeting page) never share a save queue.
const getKickoffScheduleActionSaveKey = (action: SuccessRoomKickoffScheduleAction) =>
  `kickoff-schedule:${action.rowKey}:${action.columnKey}`;

export const createSuccessRoomResourceDraft = (
  getRoom: () => SuccessRoomResourceRoom,
  getResource: () => SuccessRoomRoutedResource,
  getState: () => SuccessRoomResourceState,
) => {
  const saveQueue = createSuccessRoomSaveQueue();
  const draft = createSyncedSnapshot({
    getSnapshot: () => createResourceDraftSnapshot(getRoom(), getResource(), getState()),
    shouldReplace: (current, next) =>
      current.roomSlug !== next.roomSlug || current.resource.slug !== next.resource.slug
  });

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
      operation: 'plan',
      body: { action },
      errorMessage: 'Success room plan could not be saved.'
    });
  };

  const getEditableTextSnapshot = () => {
    const current = draft.current;

    if (current.kind !== 'editable-text') {
      throw new Error('Current success-room resource is not editable text.');
    }

    return current;
  };

  const setEditableTextState = (editableState: SuccessRoomEditableTextState) => {
    const current = getEditableTextSnapshot();
    const editableText = cloneEditableTextState(editableState);

    draft.replace({ ...current, editableText });
    scheduleJsonSave({
      saveQueue,
      key: `editable-text:${current.resource.slug}`,
      roomSlug: current.roomSlug,
      operation: 'editable-text',
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

  type AttachmentTarget = { roomSlug: string; resourceSlug: string };

  let attachmentUi = $state<{
    target: AttachmentTarget;
    operation: SuccessRoomAttachmentOperation | null;
    error: string;
  } | null>(null);

  const currentAttachmentUi = () => {
    const current = draft.current;

    return attachmentUi !== null &&
      attachmentUi.target.roomSlug === current.roomSlug &&
      attachmentUi.target.resourceSlug === current.resource.slug
      ? attachmentUi
      : null;
  };

  // The draft snapshot may have been replaced while the request was in
  // flight, so only apply the result if we are still on the same room and
  // resource.
  const applyPersistedAttachment = (
    target: AttachmentTarget,
    attachment: SuccessRoomLinkedFileMetadata | null
  ) => {
    const current = draft.current;

    if (
      current.kind !== 'editable-text' ||
      current.roomSlug !== target.roomSlug ||
      current.resource.slug !== target.resourceSlug
    ) {
      return;
    }

    draft.replace({
      ...current,
      editableText: { ...current.editableText, attachment }
    });
  };

  const runAttachmentOperation = async (
    operation: SuccessRoomAttachmentOperation,
    fallbackErrorMessage: string,
    perform: (target: AttachmentTarget) => Promise<void>
  ) => {
    // The lock is global — never two claim mutations in flight, whatever their
    // targets — while the getters scope what is displayed to the target.
    if (attachmentUi?.operation) {
      return;
    }

    const snapshot = getEditableTextSnapshot();
    const target = { roomSlug: snapshot.roomSlug, resourceSlug: snapshot.resource.slug };

    attachmentUi = { target, operation, error: '' };

    try {
      await perform(target);
      attachmentUi = null;
    } catch (error) {
      attachmentUi = {
        target,
        operation: null,
        error: error instanceof Error ? error.message : fallbackErrorMessage
      };
    }
  };

  const uploadAttachment = (file: File) =>
    runAttachmentOperation('uploading', 'Could not upload this attachment.', async (target) => {
      applyPersistedAttachment(
        target,
        await uploadEditableTextAttachment({ roomSlug: target.roomSlug, file })
      );
    });

  const removeAttachment = () =>
    runAttachmentOperation('removing', 'Could not remove this attachment.', async (target) => {
      await deleteEditableTextAttachment({ roomSlug: target.roomSlug });
      applyPersistedAttachment(target, null);
    });

  // Actions are surgical, so a draft that went stale behind a raced load can
  // only ever touch the cell or meeting the user actually edited. Meeting
  // patches ride typing, so they debounce; placing and clearing are discrete
  // clicks and save immediately — the returned promise reports whether the
  // action persisted, which lets creation navigate to the meeting page only
  // when its server load will find the meeting.
  const dispatchKickoffScheduleAction = async (
    action: SuccessRoomKickoffScheduleAction
  ): Promise<boolean> => {
    const current = draft.current;

    if (current.kind !== 'kickoff-schedule') {
      throw new Error('Current success-room resource is not a kickoff schedule.');
    }

    const isDiscrete = action.type !== 'patch-meeting';

    draft.replace({
      ...current,
      kickoffSchedule: applySuccessRoomKickoffScheduleAction(current.kickoffSchedule, action)
    });

    const saved = await scheduleJsonSave({
      saveQueue,
      key: getKickoffScheduleActionSaveKey(action),
      roomSlug: current.roomSlug,
      operation: 'kickoff-schedule',
      body: { action },
      errorMessage: 'Success room kickoff schedule could not be saved.',
      debounceMs: isDiscrete ? 0 : 500
    });

    // A discrete placement/clear the server rejected must not linger in the local
    // snapshot as a phantom cell, so restore the pre-action state on failure.
    if (!saved && isDiscrete) {
      draft.replace(current);
    }

    return saved;
  };

  return {
    get current() {
      return draft.current;
    },
    get attachmentOperation() {
      return currentAttachmentUi()?.operation ?? null;
    },
    get attachmentError() {
      return currentAttachmentUi()?.error ?? '';
    },
    dispatchPlanAction,
    dispatchKickoffScheduleAction,
    setEditableTextState,
    uploadAttachment,
    removeAttachment
  };
};
