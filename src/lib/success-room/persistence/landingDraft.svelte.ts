import {
  attachSuccessRoomSaveQueueLifecycle,
  createSuccessRoomSaveQueue
} from './saveQueue';
import { getSuccessRoomApiPath } from '../domain/urls';
import { createTeamMember, type TeamMemberInput } from '../team/teamClient';
import type {
  SuccessRoom,
  SuccessRoomBenefitsState,
  SuccessRoomState,
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
  selectedCardIds: [...benefits.selectedCardIds],
  painPoints: normalizePainPointsForEditor(benefits.painPoints)
});

const getBenefitsVersion = (benefits: SuccessRoomBenefitsState) => JSON.stringify(benefits);

const getTeamVersion = (team: SuccessRoomTeamMember[]) =>
  JSON.stringify(
    team.map((member) => ({
      id: member.id,
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
    if (!mergedTeamMembers.has(member.id)) {
      mergedTeamMembers.set(member.id, member);
    }
  }

  return [...mergedTeamMembers.values()];
};

type SuccessRoomBenefitsDraftSnapshot = {
  roomSlug: string;
  benefitsVersion: string;
  benefits: SuccessRoomBenefitsState;
};

type SuccessRoomTeamDraftSnapshot = {
  roomSlug: string;
  serverTeamVersion: string;
  serverTeam: SuccessRoomTeamMember[];
};

const createBenefitsDraftSnapshot = (
  room: SuccessRoom,
  state: SuccessRoomState,
  benefitsVersion = getBenefitsVersion(state.benefits),
): SuccessRoomBenefitsDraftSnapshot => ({
  roomSlug: room.slug,
  benefitsVersion,
  benefits: normalizeBenefitsForEditor(state.benefits)
});

const createTeamDraftSnapshot = (room: SuccessRoom): SuccessRoomTeamDraftSnapshot => ({
  roomSlug: room.slug,
  serverTeamVersion: getTeamVersion(room.team),
  serverTeam: [...room.team]
});

export const createSuccessRoomLandingDraft = (
  getRoom: () => SuccessRoom,
  getState: () => SuccessRoomState,
) => {
  const saveQueue = createSuccessRoomSaveQueue();
  const initialRoom = getRoom();
  const initialBenefitsSnapshot = createBenefitsDraftSnapshot(initialRoom, getState());
  const initialTeamSnapshot = createTeamDraftSnapshot(initialRoom);

  let benefitsRoomSlug = $state(initialBenefitsSnapshot.roomSlug);
  let benefitsVersion = $state(initialBenefitsSnapshot.benefitsVersion);
  let benefits = $state<SuccessRoomBenefitsState>(initialBenefitsSnapshot.benefits);
  let teamRoomSlug = $state(initialTeamSnapshot.roomSlug);
  let serverTeamVersion = $state(initialTeamSnapshot.serverTeamVersion);
  let serverTeam = $state<SuccessRoomTeamMember[]>(initialTeamSnapshot.serverTeam);
  let locallyAddedTeamMembers = $state<SuccessRoomTeamMember[]>([]);
  const team = $derived(appendMissingTeamMembers(serverTeam, locallyAddedTeamMembers));

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
    const nextBenefitsVersion = getBenefitsVersion(state.benefits);

    if (benefitsRoomSlug !== room.slug || benefitsVersion !== nextBenefitsVersion) {
      const nextSnapshot = createBenefitsDraftSnapshot(room, state, nextBenefitsVersion);

      benefitsRoomSlug = nextSnapshot.roomSlug;
      benefitsVersion = nextSnapshot.benefitsVersion;
      benefits = nextSnapshot.benefits;
    }
  });

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
      const nextServerTeamMemberIds = new Set(nextServerTeam.map((member) => member.id));

      serverTeamVersion = currentServerTeamVersion;
      serverTeam = nextServerTeam;
      locallyAddedTeamMembers = locallyAddedTeamMembers.filter(
        (member) => !nextServerTeamMemberIds.has(member.id)
      );
    }
  });

  return {
    get selectedBenefitIds() {
      return benefits.selectedCardIds;
    },
    get painPoints() {
      return benefits.painPoints;
    },
    get team() {
      return team;
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
