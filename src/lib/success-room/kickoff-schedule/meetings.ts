import {
  kickoffMeetingAgendaSlotCount,
  type SuccessRoomKickoffMeeting
} from '$shared/successRoomKickoffSchedule';
import type { SuccessRoomTeamMember } from '../domain/types';

export const kickoffMeetingSlotMinutes = 15;

export const getMeetingAttendees = (
  team: SuccessRoomTeamMember[],
  meeting: SuccessRoomKickoffMeeting
): SuccessRoomTeamMember[] => team.filter((member) => meeting.attendeeKeys.includes(member.key));

export const createKickoffMeeting = (title: string): SuccessRoomKickoffMeeting => ({
  title,
  attendeeKeys: [],
  agenda: Array.from({ length: kickoffMeetingAgendaSlotCount }, () => '')
});

type KickoffMeetingPreset = {
  key: string;
  title: string;
  agenda: string[];
};

export const kickoffMeetingPresets: KickoffMeetingPreset[] = [
  {
    key: 'team-kickoff',
    title: 'Team kickoff',
    agenda: [
      'Introductions',
      'Walkthrough of the proof of concept',
      'Your questions',
      'Inviting your network'
    ]
  },
  {
    key: 'technical-setup',
    title: 'Technical setup',
    agenda: [
      'Access and accounts',
      'Data sources walkthrough',
      'Integration checklist',
      'Next steps'
    ]
  },
  {
    key: 'success-review',
    title: 'Success review',
    agenda: ['Goals recap', 'Results so far', 'Blockers', 'Next steps']
  }
];

export const createKickoffMeetingFromPreset = (
  preset: KickoffMeetingPreset
): SuccessRoomKickoffMeeting => ({
  ...createKickoffMeeting(preset.title),
  agenda: Array.from(
    { length: kickoffMeetingAgendaSlotCount },
    (_, index) => preset.agenda[index] ?? ''
  )
});
