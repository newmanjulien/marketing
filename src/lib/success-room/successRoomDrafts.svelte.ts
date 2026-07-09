import {
  attachSuccessRoomSaveQueueLifecycle,
  createSuccessRoomSaveQueue
} from './successRoomSaveQueue';
import type {
  SuccessRoom,
  SuccessRoomEditableTextResource,
  SuccessRoomEditableTextState,
  SuccessRoomPlanState,
  SuccessRoomPlanUpdate,
  SuccessRoomRoutedResource,
  SuccessRoomState
} from './successRoomTypes';

const cloneQuestions = (questions: Record<string, string>) => ({ ...questions });

const getDefaultPlanState = (): SuccessRoomPlanState => ({
  selectedBenefitIds: [],
  checkedTaskIds: [],
  dateOverrides: {},
  taskAssigneeMemberIds: {}
});

const clonePlan = (plan: SuccessRoomPlanState): SuccessRoomPlanState => ({
  selectedBenefitIds: [...plan.selectedBenefitIds],
  checkedTaskIds: [...plan.checkedTaskIds],
  dateOverrides: {
    ...plan.dateOverrides
  },
  taskAssigneeMemberIds: {
    ...plan.taskAssigneeMemberIds
  }
});

const cloneEditableTextState = (
  editableState: SuccessRoomEditableTextState,
): SuccessRoomEditableTextState => ({
  content: editableState.content,
  dataSources: [...editableState.dataSources],
  ...(editableState.attachment ? { attachment: editableState.attachment } : {})
});

const cloneEditableTexts = (editableTexts: Record<string, SuccessRoomEditableTextState>) =>
  Object.fromEntries(
    Object.entries(editableTexts).map(([resourceSlug, editableState]) => [
      resourceSlug,
      cloneEditableTextState(editableState)
    ])
  );

const getDefaultEditableTextState = (): SuccessRoomEditableTextState => ({
  content: '',
  dataSources: []
});

export const createSuccessRoomLandingDraft = (
  getRoom: () => SuccessRoom,
  getState: () => SuccessRoomState,
) => {
  const saveQueue = createSuccessRoomSaveQueue();

  let roomSlug = $state('');
  let questions = $state<Record<string, string>>({});

  attachSuccessRoomSaveQueueLifecycle(saveQueue);

  const saveQuestions = (nextQuestions: Record<string, string>) => {
    saveQueue.schedule(
      'questions',
      async () => {
        const response = await fetch(`/success-room/${getRoom().slug}/api/questions`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            questions: nextQuestions
          })
        });

        if (!response.ok) {
          throw new Error('Success room questions could not be saved.');
        }
      },
      500
    );
  };

  $effect(() => {
    const currentRoomSlug = getRoom().slug;

    if (roomSlug !== currentRoomSlug) {
      roomSlug = currentRoomSlug;
      questions = cloneQuestions(getState().questions);
    }
  });

  return {
    get questions() {
      return questions;
    },
    setQuestions(nextQuestions: Record<string, string>) {
      questions = cloneQuestions(nextQuestions);
      saveQuestions(questions);
    }
  };
};

export const createSuccessRoomResourceDraft = (
  getRoom: () => SuccessRoom,
  getResource: () => SuccessRoomRoutedResource,
  getState: () => SuccessRoomState,
) => {
  const saveQueue = createSuccessRoomSaveQueue();

  let roomResourceIdentity = $state('');
  let plan = $state<SuccessRoomPlanState>(getDefaultPlanState());
  let editableTexts = $state<Record<string, SuccessRoomEditableTextState>>({});

  attachSuccessRoomSaveQueueLifecycle(saveQueue);

  const savePlanSnapshot = (planSnapshot: SuccessRoomPlanState) => {
    const planToSave = clonePlan(planSnapshot);

    saveQueue.schedule('plan', async () => {
      const response = await fetch(`/success-room/${getRoom().slug}/api/plan`, {
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
        const response = await fetch(`/success-room/${getRoom().slug}/api/editable-text`, {
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

  $effect(() => {
    const room = getRoom();
    const resource = getResource();
    const currentRoomResourceIdentity = `${room.slug}:${resource.slug}`;

    if (roomResourceIdentity !== currentRoomResourceIdentity) {
      roomResourceIdentity = currentRoomResourceIdentity;
      plan = clonePlan(getState().mutualSuccessPlan?.plan ?? getDefaultPlanState());
      editableTexts = cloneEditableTexts(getState().editableTexts);

      if (resource.kind === 'editable-text' && !editableTexts[resource.slug]) {
        editableTexts = {
          ...editableTexts,
          [resource.slug]: getDefaultEditableTextState()
        };
      }
    }
  });

  return {
    get plan() {
      return plan;
    },
    updatePlan(update: SuccessRoomPlanUpdate) {
      const nextPlan = {
        selectedBenefitIds:
          update.selectedBenefitIds !== undefined
            ? [...update.selectedBenefitIds]
            : plan.selectedBenefitIds,
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
    }
  };
};
