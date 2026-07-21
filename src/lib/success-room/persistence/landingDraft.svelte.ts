import { createSuccessRoomSaveQueue } from './saveQueue';
import { createSyncedSnapshot, scheduleJsonSave } from './autosave.svelte';
import { createTeamMember, type TeamMemberInput } from '../team/teamClient';
import { cloneBenefits } from '../domain/state';
import type { SuccessRoomBenefitsState } from '$shared/successRoomBenefits';
import type {
  SuccessRoomBenefitsPatch,
  SuccessRoomLandingRoom,
  SuccessRoomLandingState,
  SuccessRoomTeamMember
} from '../domain/types';

type SuccessRoomBenefitsDraftSnapshot = {
  roomSlug: string;
  // The server benefits this draft is based on. Local patches carry it forward
  // unchanged, so shouldReplace fires only when the server state itself changes.
  serverBenefitsVersion: string;
  benefits: SuccessRoomBenefitsState;
  customBenefitInput: string;
};

const createBenefitsDraftSnapshot = (
  room: SuccessRoomLandingRoom,
  state: SuccessRoomLandingState,
): SuccessRoomBenefitsDraftSnapshot => ({
  roomSlug: room.slug,
  serverBenefitsVersion: JSON.stringify(state.benefits),
  benefits: cloneBenefits(state.benefits),
  customBenefitInput: state.benefits.selectedCustomBenefit ?? ''
});

export const createSuccessRoomLandingDraft = (
  getRoom: () => SuccessRoomLandingRoom,
  getState: () => SuccessRoomLandingState,
) => {
  const saveQueue = createSuccessRoomSaveQueue();
  const benefitsDraft = createSyncedSnapshot({
    getSnapshot: () => createBenefitsDraftSnapshot(getRoom(), getState()),
    shouldReplace: (current, next) =>
      current.roomSlug !== next.roomSlug ||
      current.serverBenefitsVersion !== next.serverBenefitsVersion
  });

  // Locally added members are scoped to the room they were created in, so a room
  // switch drops them without any state synchronization.
  let locallyAddedTeam = $state<{ roomSlug: string; members: SuccessRoomTeamMember[] }>({
    roomSlug: getRoom().slug,
    members: []
  });
  const locallyAddedTeamMembers = $derived(
    locallyAddedTeam.roomSlug === getRoom().slug ? locallyAddedTeam.members : []
  );
  const team = $derived.by(() => {
    const baseTeam = getRoom().team;
    const baseKeys = new Set(baseTeam.map((member) => member.key));
    return [...baseTeam, ...locallyAddedTeamMembers.filter((member) => !baseKeys.has(member.key))];
  });

  const saveBenefits = (key: string, benefits: SuccessRoomBenefitsPatch) => {
    scheduleJsonSave({
      saveQueue,
      key,
      roomSlug: getRoom().slug,
      operation: 'benefits',
      body: { benefits },
      errorMessage: 'Success room benefits could not be saved.',
      debounceMs: 500
    });
  };

  const patchBenefits = (saveKey: string, patch: SuccessRoomBenefitsPatch) => {
    benefitsDraft.replace({
      ...benefitsDraft.current,
      benefits: { ...benefitsDraft.current.benefits, ...patch }
    });
    saveBenefits(saveKey, patch);
  };

  const updateCustomBenefit = (customBenefitInput: string, selected: boolean) => {
    const wasSelected = benefitsDraft.current.benefits.selectedCustomBenefit !== null;
    // A blank input can never be the selected benefit.
    const isSelected = selected && customBenefitInput.trim().length > 0;
    // The input is trimmed once, at the moment it becomes the selected benefit;
    // afterwards it tracks the user's typing verbatim.
    const input = isSelected && !wasSelected ? customBenefitInput.trim() : customBenefitInput;
    const selectedCustomBenefit = isSelected ? input : null;

    benefitsDraft.replace({
      ...benefitsDraft.current,
      benefits: { ...benefitsDraft.current.benefits, selectedCustomBenefit },
      customBenefitInput: input
    });

    // While the benefit stays deselected only the local input text changed,
    // so there is nothing to persist.
    if (wasSelected || isSelected) {
      saveBenefits('customBenefit', { selectedCustomBenefit });
    }
  };

  const setBenefitPainPoint = (benefitKey: string, value: string) => {
    patchBenefits('painPoints', {
      painPointsByBenefitKey: {
        ...benefitsDraft.current.benefits.painPointsByBenefitKey,
        [benefitKey]: value
      }
    });
  };

  const setBenefitGoal = (benefitKey: string, value: string) => {
    patchBenefits('goals', {
      goalsByBenefitKey: {
        ...benefitsDraft.current.benefits.goalsByBenefitKey,
        [benefitKey]: value
      }
    });
  };

  return {
    get selectedBenefitKeys() {
      return benefitsDraft.current.benefits.selectedCardKeys;
    },
    set selectedBenefitKeys(nextSelectedBenefitKeys: string[]) {
      patchBenefits('selectedBenefits', { selectedCardKeys: [...nextSelectedBenefitKeys] });
    },
    get customBenefitInput() {
      return benefitsDraft.current.customBenefitInput;
    },
    set customBenefitInput(customBenefitInput: string) {
      updateCustomBenefit(
        customBenefitInput,
        benefitsDraft.current.benefits.selectedCustomBenefit !== null
      );
    },
    get customBenefitSelected() {
      return benefitsDraft.current.benefits.selectedCustomBenefit !== null;
    },
    set customBenefitSelected(selected: boolean) {
      updateCustomBenefit(benefitsDraft.current.customBenefitInput, selected);
    },
    get selectedBenefitCount() {
      return (
        benefitsDraft.current.benefits.selectedCardKeys.length +
        (benefitsDraft.current.benefits.selectedCustomBenefit !== null ? 1 : 0)
      );
    },
    get painPointsByBenefitKey() {
      return benefitsDraft.current.benefits.painPointsByBenefitKey;
    },
    setBenefitPainPoint,
    get goalsByBenefitKey() {
      return benefitsDraft.current.benefits.goalsByBenefitKey;
    },
    setBenefitGoal,
    get team() {
      return team;
    },
    async addTeamMember(member: TeamMemberInput) {
      const roomSlug = getRoom().slug;
      const createdMember = await createTeamMember({
        roomSlug,
        ...member
      });

      locallyAddedTeam = {
        roomSlug,
        members: [
          ...(locallyAddedTeam.roomSlug === roomSlug ? locallyAddedTeam.members : []),
          createdMember
        ]
      };
    }
  };
};
