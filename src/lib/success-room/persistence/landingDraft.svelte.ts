import {
  attachSuccessRoomSaveQueueLifecycle,
  createSuccessRoomSaveQueue
} from './saveQueue';
import { getSuccessRoomApiPath } from '../domain/urls';
import type { SuccessRoom, SuccessRoomBenefitsState, SuccessRoomState } from '../domain/types';

const minimumPainPointCount = 3;

const normalizePainPointsForEditor = (painPoints: string[]) => {
  const normalizedPainPoints = [...painPoints];

  while (normalizedPainPoints.length < minimumPainPointCount) {
    normalizedPainPoints.push('');
  }

  return normalizedPainPoints;
};

const normalizeBenefitsForEditor = (
  benefits: SuccessRoomBenefitsState
): SuccessRoomBenefitsState => ({
  selectedCardIds: [...benefits.selectedCardIds],
  painPoints: normalizePainPointsForEditor(benefits.painPoints)
});

const getBenefitsVersion = (benefits: SuccessRoomBenefitsState) => JSON.stringify(benefits);

export const createSuccessRoomLandingDraft = (
  getRoom: () => SuccessRoom,
  getState: () => SuccessRoomState,
) => {
  const saveQueue = createSuccessRoomSaveQueue();

  let benefitRoomSlug = $state('');
  let benefitsVersion = $state('');
  let benefits = $state<SuccessRoomBenefitsState>(
    normalizeBenefitsForEditor({
      selectedCardIds: [],
      painPoints: []
    })
  );

  attachSuccessRoomSaveQueueLifecycle(saveQueue);

  const saveBenefits = (
    key: string,
    benefits: Partial<SuccessRoomState['benefits']>
  ) => {
    saveQueue.schedule(
      key,
      async () => {
        const response = await fetch(getSuccessRoomApiPath(getRoom().slug, 'benefits'), {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            benefits
          })
        });

        if (!response.ok) {
          throw new Error('Success room benefits could not be saved.');
        }
      },
      500
    );
  };

  $effect(() => {
    const room = getRoom();
    const state = getState();
    const currentRoomSlug = room.slug;
    const currentBenefitsVersion = getBenefitsVersion(state.benefits);

    if (benefitRoomSlug !== currentRoomSlug || benefitsVersion !== currentBenefitsVersion) {
      benefitRoomSlug = currentRoomSlug;
      benefitsVersion = currentBenefitsVersion;
      benefits = normalizeBenefitsForEditor(state.benefits);
    }
  });

  return {
    get selectedBenefitIds() {
      return benefits.selectedCardIds;
    },
    get painPoints() {
      return benefits.painPoints;
    },
    setSelectedBenefitIds(nextSelectedBenefitIds: string[]) {
      benefits = {
        ...benefits,
        selectedCardIds: [...nextSelectedBenefitIds]
      };
      saveBenefits('selectedBenefits', {
        selectedCardIds: benefits.selectedCardIds
      });
    },
    setPainPoints(nextPainPoints: string[]) {
      benefits = {
        ...benefits,
        painPoints: normalizePainPointsForEditor(nextPainPoints)
      };
      saveBenefits('painPoints', {
        painPoints: benefits.painPoints
      });
    }
  };
};
