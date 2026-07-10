import {
  attachSuccessRoomSaveQueueLifecycle,
  createSuccessRoomSaveQueue
} from './saveQueue';
import { createSyncedSnapshot, scheduleJsonSave } from './autosave.svelte';
import { createTeamMember, type TeamMemberInput } from '../team/teamClient';
import type {
  SuccessRoomBenefitsPatch,
  SuccessRoomBenefitsState,
  SuccessRoomLandingRoom,
  SuccessRoomLandingState,
  SuccessRoomTeamMember
} from '../domain/types';

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
  selectedCardKeys: [...benefits.selectedCardKeys],
  selectedCustomBenefit: benefits.selectedCustomBenefit,
  painPoints: normalizePainPointsForEditor(benefits.painPoints)
});

const getBenefitsVersion = (benefits: SuccessRoomBenefitsState) => JSON.stringify(benefits);

const getTeamVersion = (team: SuccessRoomTeamMember[]) =>
  JSON.stringify(
    team.map((member) => ({
      key: member.key,
      name: member.name,
      role: member.role,
      imageHref: member.imageHref,
      photoId: member.photo?.photoId
    }))
  );

const appendMissingTeamMembers = (
  baseTeam: SuccessRoomTeamMember[],
  additionalTeam: SuccessRoomTeamMember[],
) => {
  const mergedTeamMembers = new Map<string, SuccessRoomTeamMember>();

  for (const member of [...baseTeam, ...additionalTeam]) {
    if (!mergedTeamMembers.has(member.key)) {
      mergedTeamMembers.set(member.key, member);
    }
  }

  return [...mergedTeamMembers.values()];
};

type SuccessRoomBenefitsDraftSnapshot = {
  roomSlug: string;
  benefitsVersion: string;
  benefits: SuccessRoomBenefitsState;
  customBenefitInput: string;
};

type SuccessRoomTeamDraftSnapshot = {
  roomSlug: string;
  serverTeamVersion: string;
  serverTeam: SuccessRoomTeamMember[];
};

const createBenefitsDraftSnapshot = (
  room: SuccessRoomLandingRoom,
  state: SuccessRoomLandingState,
  benefitsVersion = getBenefitsVersion(state.benefits),
): SuccessRoomBenefitsDraftSnapshot => ({
  roomSlug: room.slug,
  benefitsVersion,
  benefits: normalizeBenefitsForEditor(state.benefits),
  customBenefitInput: state.benefits.selectedCustomBenefit ?? ''
});

const createTeamDraftSnapshot = (room: SuccessRoomLandingRoom): SuccessRoomTeamDraftSnapshot => ({
  roomSlug: room.slug,
  serverTeamVersion: getTeamVersion(room.team),
  serverTeam: [...room.team]
});

export const createSuccessRoomLandingDraft = (
  getRoom: () => SuccessRoomLandingRoom,
  getState: () => SuccessRoomLandingState,
) => {
  const saveQueue = createSuccessRoomSaveQueue();
  const initialRoom = getRoom();
  const initialBenefitsSnapshot = createBenefitsDraftSnapshot(initialRoom, getState());
  const initialTeamSnapshot = createTeamDraftSnapshot(initialRoom);
  const benefitsDraft = createSyncedSnapshot({
    initial: initialBenefitsSnapshot,
    getSnapshot: () => {
      const state = getState();
      return createBenefitsDraftSnapshot(
        getRoom(),
        state,
        getBenefitsVersion(state.benefits)
      );
    },
    shouldReplace: (current, next) =>
      current.roomSlug !== next.roomSlug || current.benefitsVersion !== next.benefitsVersion
  });

  let teamRoomSlug = $state(initialTeamSnapshot.roomSlug);
  let serverTeamVersion = $state(initialTeamSnapshot.serverTeamVersion);
  let serverTeam = $state<SuccessRoomTeamMember[]>(initialTeamSnapshot.serverTeam);
  let locallyAddedTeamMembers = $state<SuccessRoomTeamMember[]>([]);
  const team = $derived(appendMissingTeamMembers(serverTeam, locallyAddedTeamMembers));

  attachSuccessRoomSaveQueueLifecycle(saveQueue);

  const saveBenefits = (
    key: string,
    benefits: SuccessRoomBenefitsPatch
  ) => {
    scheduleJsonSave({
      saveQueue,
      key,
      roomSlug: getRoom().slug,
      endpoint: 'benefits',
      body: { benefits },
      errorMessage: 'Success room benefits could not be saved.',
      debounceMs: 500
    });
  };

  $effect(() => {
    const room = getRoom();
    const currentServerTeamVersion = getTeamVersion(room.team);

    if (teamRoomSlug !== room.slug) {
      const nextSnapshot = createTeamDraftSnapshot(room);

      teamRoomSlug = nextSnapshot.roomSlug;
      serverTeamVersion = nextSnapshot.serverTeamVersion;
      serverTeam = nextSnapshot.serverTeam;
      locallyAddedTeamMembers = [];
      return;
    }

    if (serverTeamVersion !== currentServerTeamVersion) {
      const nextServerTeam = [...room.team];
      const nextServerTeamMemberKeys = new Set(nextServerTeam.map((member) => member.key));

      serverTeamVersion = currentServerTeamVersion;
      serverTeam = nextServerTeam;
      locallyAddedTeamMembers = locallyAddedTeamMembers.filter(
        (member) => !nextServerTeamMemberKeys.has(member.key)
      );
    }
  });

  const setSelectedBenefitKeys = (nextSelectedBenefitKeys: string[]) => {
    const benefits = {
      ...benefitsDraft.current.benefits,
      selectedCardKeys: [...nextSelectedBenefitKeys]
    };
    benefitsDraft.replace({
      ...benefitsDraft.current,
      benefits
    });
    saveBenefits('selectedBenefits', {
      selectedCardKeys: benefits.selectedCardKeys
    });
  };

  const updateCustomBenefit = (customBenefitInput: string, selected: boolean) => {
    const currentBenefits = benefitsDraft.current.benefits;
    const wasSelected = currentBenefits.selectedCustomBenefit !== null;
    const normalizedInput = customBenefitInput.trim();
    const isSelected = selected && normalizedInput.length > 0;
    const nextCustomBenefitInput =
      isSelected && !wasSelected ? normalizedInput : customBenefitInput;
    const selectedCustomBenefit = isSelected ? nextCustomBenefitInput : null;
    const benefits = {
      ...currentBenefits,
      selectedCustomBenefit
    };

    benefitsDraft.replace({
      ...benefitsDraft.current,
      benefits,
      customBenefitInput: nextCustomBenefitInput
    });

    if (wasSelected || isSelected) {
      saveBenefits('customBenefit', {
        selectedCustomBenefit
      });
    }
  };

  const setPainPoints = (nextPainPoints: string[]) => {
    const benefits = {
      ...benefitsDraft.current.benefits,
      painPoints: normalizePainPointsForEditor(nextPainPoints)
    };
    benefitsDraft.replace({
      ...benefitsDraft.current,
      benefits
    });
    saveBenefits('painPoints', {
      painPoints: benefits.painPoints
    });
  };

  return {
    get selectedBenefitKeys() {
      return benefitsDraft.current.benefits.selectedCardKeys;
    },
    set selectedBenefitKeys(nextSelectedBenefitKeys: string[]) {
      setSelectedBenefitKeys(nextSelectedBenefitKeys);
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
    get painPoints() {
      return benefitsDraft.current.benefits.painPoints;
    },
    set painPoints(nextPainPoints: string[]) {
      setPainPoints(nextPainPoints);
    },
    get team() {
      return team;
    },
    async addTeamMember(member: TeamMemberInput) {
      const createdMember = await createTeamMember({
        roomSlug: getRoom().slug,
        ...member
      });

      locallyAddedTeamMembers = appendMissingTeamMembers(locallyAddedTeamMembers, [
        createdMember
      ]);
    }
  };
};
