<script lang="ts">
  import { PlusIcon, XIcon } from 'phosphor-svelte';
  import type { SuccessRoomKickoffMeeting } from '$shared/successRoomKickoffSchedule';
  import PillTabs from '$lib/ui/PillTabs.svelte';
  import MeetingAttendeesModal from './MeetingAttendeesModal.svelte';
  import type { SuccessRoomTeamMember } from '../domain/types';
  import { kickoffMeetingSlotMinutes, getMeetingAttendees } from './meetings';

  let {
    meeting = $bindable(),
    team,
    backHref
  }: {
    meeting: SuccessRoomKickoffMeeting;
    team: SuccessRoomTeamMember[];
    backHref: string;
  } = $props();

  let attendeesOpen = $state(false);

  const backLinkClasses =
    'm-0 block text-[14px] font-medium leading-none text-stone-500 transition-colors duration-200 hover:text-stone-900';

  const sections = [
    { key: 'agenda', label: 'Agenda' },
    { key: 'attendees', label: 'Attendees' }
  ] as const;

  const formatOffset = (minutes: number) =>
    `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;

  const attendees = $derived(getMeetingAttendees(team, meeting));

  const updateAgendaSlot = (index: number, text: string) => {
    meeting = { ...meeting, agenda: meeting.agenda.with(index, text) };
  };

  const toggleAttendee = (memberKey: string) => {
    meeting = {
      ...meeting,
      attendeeKeys: meeting.attendeeKeys.includes(memberKey)
        ? meeting.attendeeKeys.filter((key) => key !== memberKey)
        : [...meeting.attendeeKeys, memberKey]
    };
  };
</script>

<article>
  <header>
    <a href={backHref} class={backLinkClasses}>Kickoff schedule</a>

    <input
      class="mt-[28px] block w-full border-0 bg-transparent p-0 font-heading text-[32px] font-normal leading-[1.05] text-stone-750 outline-none placeholder:text-stone-300"
      aria-label="Meeting title"
      placeholder="Untitled meeting"
      spellcheck="true"
      bind:value={() => meeting.title, (title) => (meeting = { ...meeting, title })}
    />
  </header>

  <PillTabs
    tabs={sections}
    ariaLabel="Meeting sections"
    listClass="mt-[34px]"
    panelClass="mt-[28px]"
  >
    {#snippet children(section)}
      {#if section.key === 'agenda'}
        <p class="m-0 text-[14px] font-book leading-[1.45] text-stone-700 sm:text-[15px]">
          Fill out the schedule below to plan how this meeting's hour will be spent.
        </p>

        <ul class="mt-[24px] grid gap-[8px]" aria-label="Agenda">
          {#each meeting.agenda as text, index}
            {@const start = formatOffset(index * kickoffMeetingSlotMinutes)}
            {@const end = formatOffset((index + 1) * kickoffMeetingSlotMinutes)}
            <li
              class="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-[10px] rounded-[8px] border border-stone-200 bg-white px-[12px] py-[9px]"
            >
              <span class="text-[13px] font-book leading-none text-stone-400 tabular-nums">
                {start} – {end}
              </span>

              <input
                class="block w-full border-0 bg-transparent p-0 font-body text-[14px] font-book leading-[1.45] text-stone-650 outline-none placeholder:text-stone-300 focus:text-stone-900"
                aria-label={`Agenda from ${start}`}
                placeholder="What happens in this part?"
                spellcheck="true"
                bind:value={() => text, (value) => updateAgendaSlot(index, value)}
              />
            </li>
          {/each}
        </ul>
      {:else}
        <ul class="grid grid-cols-2 gap-x-[24px] gap-y-[34px] sm:grid-cols-4" aria-label="Attendees">
          {#each attendees as member (member.key)}
            <li class="group relative min-w-0">
              {#if member.imageHref}
                <img
                  src={member.imageHref}
                  alt=""
                  class="aspect-square w-full rounded-[16px] object-cover grayscale transition duration-200 group-hover:grayscale-0"
                  loading="lazy"
                  decoding="async"
                />
              {:else}
                <span
                  class="flex aspect-square w-full items-center justify-center rounded-[16px] bg-stone-200/70 text-[24px] font-normal text-stone-600"
                  aria-hidden="true"
                >
                  {member.name.slice(0, 1)}
                </span>
              {/if}

              <button
                type="button"
                aria-label={`Remove ${member.name}`}
                class="absolute right-[10px] top-[10px] flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full border-0 bg-white/90 p-0 text-stone-500 opacity-0 shadow-[0_1px_4px_rgba(28,25,23,0.06)] transition duration-150 hover:text-stone-900 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20"
                onclick={() => toggleAttendee(member.key)}
              >
                <XIcon size={13} weight="regular" aria-hidden="true" />
              </button>

              <div class="mt-[13px] min-w-0">
                <h2 class="m-0 break-words text-[15px] font-normal leading-[1.12] text-stone-750">
                  {member.name}
                </h2>
                <p class="mt-[7px] break-words text-[14px] font-book leading-[1.2] text-stone-500">
                  {member.role}
                </p>
              </div>
            </li>
          {/each}

          <li class="min-w-0">
            <button
              type="button"
              aria-label="Add attendees"
              class="group grid w-full min-w-0 cursor-pointer border-0 bg-transparent p-0 text-left text-inherit focus-visible:rounded-[16px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-stone-900/20"
              onclick={() => (attendeesOpen = true)}
            >
              <span
                class="flex aspect-square w-full items-center justify-center rounded-[16px] bg-stone-200/70 text-stone-700 transition-[background-color,color] duration-200 group-hover:bg-stone-300/70 group-hover:text-stone-900"
                aria-hidden="true"
              >
                <PlusIcon size={26} weight="regular" />
              </span>

              <span class="mt-[13px] block min-w-0">
                <span class="m-0 block break-words text-[15px] font-normal leading-[1.12] text-stone-750">
                  Add attendees
                </span>
                <span class="mt-[7px] block break-words text-[14px] font-book leading-[1.2] text-stone-500">
                  Pick from the team
                </span>
              </span>
            </button>
          </li>
        </ul>
      {/if}
    {/snippet}
  </PillTabs>
</article>

<MeetingAttendeesModal
  open={attendeesOpen}
  {team}
  attendeeKeys={meeting.attendeeKeys}
  onToggleMember={toggleAttendee}
  onClose={() => (attendeesOpen = false)}
/>
