import {
  attachSuccessRoomSaveQueueLifecycle,
  createSuccessRoomSaveQueue
} from './saveQueue';
import {
  cloneKickoffSchedules,
  cloneKickoffScheduleState,
  cloneEditableTexts,
  cloneEditableTextState,
  clonePlan,
  getDefaultKickoffScheduleState,
  getDefaultEditableTextState,
  getDefaultPlanState
} from '../domain/state';
import { getSuccessRoomApiPath } from '../domain/urls';
import type {
  SuccessRoom,
  SuccessRoomEditableTextResource,
  SuccessRoomEditableTextState,
  SuccessRoomKickoffScheduleResource,
  SuccessRoomKickoffScheduleState,
  SuccessRoomPlanState,
  SuccessRoomPlanUpdate,
  SuccessRoomRoutedResource,
  SuccessRoomState
} from '../domain/types';

type SuccessRoomResourceDraftSnapshot = {
  roomResourceIdentity: string;
  plan: SuccessRoomPlanState;
  editableTexts: Record<string, SuccessRoomEditableTextState>;
  kickoffSchedules: Record<string, SuccessRoomKickoffScheduleState>;
};

const createResourceDraftSnapshot = (
  room: SuccessRoom,
  resource: SuccessRoomRoutedResource,
  state: SuccessRoomState,
): SuccessRoomResourceDraftSnapshot => {
  let editableTexts = cloneEditableTexts(state.editableTexts);
  let kickoffSchedules = cloneKickoffSchedules(state.kickoffSchedules);

  if (resource.kind === 'editable-text' && !editableTexts[resource.slug]) {
    editableTexts = {
      ...editableTexts,
      [resource.slug]: getDefaultEditableTextState()
    };
  }

  if (resource.kind === 'kickoff-schedule' && !kickoffSchedules[resource.slug]) {
    kickoffSchedules = {
      ...kickoffSchedules,
      [resource.slug]: getDefaultKickoffScheduleState()
    };
  }

  return {
    roomResourceIdentity: `${room.slug}:${resource.slug}`,
    plan: clonePlan(state.mutualSuccessPlan?.plan ?? getDefaultPlanState()),
    editableTexts,
    kickoffSchedules
  };
};

export const createSuccessRoomResourceDraft = (
  getRoom: () => SuccessRoom,
  getResource: () => SuccessRoomRoutedResource,
  getState: () => SuccessRoomState,
) => {
  const saveQueue = createSuccessRoomSaveQueue();
  const initialSnapshot = createResourceDraftSnapshot(
    getRoom(),
    getResource(),
    getState()
  );

  let roomResourceIdentity = $state(initialSnapshot.roomResourceIdentity);
  let plan = $state<SuccessRoomPlanState>(initialSnapshot.plan);
  let editableTexts = $state<Record<string, SuccessRoomEditableTextState>>(
    initialSnapshot.editableTexts
  );
  let kickoffSchedules = $state<Record<string, SuccessRoomKickoffScheduleState>>(
    initialSnapshot.kickoffSchedules
  );

  attachSuccessRoomSaveQueueLifecycle(saveQueue);

  const savePlanSnapshot = (planSnapshot: SuccessRoomPlanState) => {
    const planToSave = clonePlan(planSnapshot);

    saveQueue.schedule('plan', async () => {
      const response = await fetch(getSuccessRoomApiPath(getRoom().slug, 'plan'), {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          plan: planToSave
        })
      });

      if (!response.ok) {
        throw new Error('Success room plan could not be saved.');
      }
    });
  };

  const saveEditableTextState = (
    resourceSlug: string,
    editableState: SuccessRoomEditableTextState,
  ) => {
    const stateToSave = cloneEditableTextState(editableState);

    saveQueue.schedule(
      `editable-text:${resourceSlug}`,
      async () => {
        const response = await fetch(getSuccessRoomApiPath(getRoom().slug, 'editable-text'), {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            resourceSlug,
            state: stateToSave
          })
        });

        if (!response.ok) {
          throw new Error('Success room editable text could not be saved.');
        }
      },
      500
    );
  };

  const saveKickoffScheduleState = (
    resourceSlug: string,
    schedule: SuccessRoomKickoffScheduleState,
  ) => {
    const scheduleToSave = cloneKickoffScheduleState(schedule);

    saveQueue.schedule(
      `kickoff-schedule:${resourceSlug}`,
      async () => {
        const response = await fetch(getSuccessRoomApiPath(getRoom().slug, 'kickoff-schedule'), {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            resourceSlug,
            schedule: scheduleToSave
          })
        });

        if (!response.ok) {
          throw new Error('Success room kickoff schedule could not be saved.');
        }
      },
      500
    );
  };

  $effect(() => {
    const room = getRoom();
    const resource = getResource();
    const nextRoomResourceIdentity = `${room.slug}:${resource.slug}`;

    if (roomResourceIdentity !== nextRoomResourceIdentity) {
      const nextSnapshot = createResourceDraftSnapshot(room, resource, getState());

      roomResourceIdentity = nextSnapshot.roomResourceIdentity;
      plan = nextSnapshot.plan;
      editableTexts = nextSnapshot.editableTexts;
      kickoffSchedules = nextSnapshot.kickoffSchedules;
    }
  });

  return {
    get plan() {
      return plan;
    },
    updatePlan(update: SuccessRoomPlanUpdate) {
      const nextPlan = {
        checkedTaskIds:
          update.checkedTaskIds !== undefined
            ? [...update.checkedTaskIds]
            : plan.checkedTaskIds,
        dateOverrides:
          update.dateOverrides !== undefined ? { ...update.dateOverrides } : plan.dateOverrides,
        taskAssigneeMemberIds:
          update.taskAssigneeMemberIds !== undefined
            ? { ...update.taskAssigneeMemberIds }
            : plan.taskAssigneeMemberIds
      };

      plan = nextPlan;
      savePlanSnapshot(nextPlan);
    },
    getEditableTextState(resource: SuccessRoomEditableTextResource) {
      return editableTexts[resource.slug] ?? getDefaultEditableTextState();
    },
    setEditableTextState(
      resourceSlug: string,
      editableState: SuccessRoomEditableTextState,
    ) {
      const nextState = cloneEditableTextState(editableState);

      editableTexts = {
        ...editableTexts,
        [resourceSlug]: nextState
      };
      saveEditableTextState(resourceSlug, nextState);
    },
    getKickoffScheduleState(resource: SuccessRoomKickoffScheduleResource) {
      return kickoffSchedules[resource.slug] ?? getDefaultKickoffScheduleState();
    },
    setKickoffScheduleState(
      resourceSlug: string,
      schedule: SuccessRoomKickoffScheduleState,
    ) {
      const nextState = cloneKickoffScheduleState(schedule);

      kickoffSchedules = {
        ...kickoffSchedules,
        [resourceSlug]: nextState
      };
      saveKickoffScheduleState(resourceSlug, nextState);
    }
  };
};
