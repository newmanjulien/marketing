<script lang="ts">
  import { PlusIcon, XIcon } from 'phosphor-svelte';
  import { goto } from '$app/navigation';
  import { kickoffScheduleColumns as columns } from '$shared/successRoomKickoffSchedule';
  import type {
    KickoffCell,
    SuccessRoomKickoffMeeting,
    SuccessRoomKickoffScheduleAction,
    SuccessRoomKickoffScheduleState
  } from '$shared/successRoomKickoffSchedule';
  import MeetingPresetModal from './MeetingPresetModal.svelte';
  import { getSuccessRoomKickoffMeetingPath } from '../domain/urls';
  import type { SuccessRoomTeamMember } from '../domain/types';
  import { getMeetingAttendees } from './meetings';

  let {
    schedule,
    team,
    roomSlug,
    onScheduleAction
  }: {
    schedule: SuccessRoomKickoffScheduleState;
    team: SuccessRoomTeamMember[];
    roomSlug: string;
    onScheduleAction: (action: SuccessRoomKickoffScheduleAction) => Promise<boolean>;
  } = $props();

  let pendingCell = $state<KickoffCell | null>(null);

  const attachMeeting = async (meeting: SuccessRoomKickoffMeeting) => {
    const pending = pendingCell;

    if (!pending) {
      return;
    }

    pendingCell = null;

    // An unpersisted meeting exists only in this page's draft, so the meeting
    // page's server load would 404 on it — stay on the schedule instead.
    if (await onScheduleAction({ type: 'place-meeting', ...pending, meeting })) {
      await goto(getSuccessRoomKickoffMeetingPath(roomSlug, pending));
    }
  };
</script>

<section aria-label="Kickoff schedule" class="mt-[34px]">
  <div class="overflow-hidden rounded-[8px] border border-stone-200 bg-white">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[560px] border-collapse">
        <thead>
          <tr>
            {#each columns as column}
              <th
                class="border-b border-stone-200/80 bg-stone-50 px-[14px] py-[13px] text-left text-[13px] font-medium leading-none text-stone-600"
                scope="col"
              >
                {column.label}
              </th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each schedule.rows as row, rowIndex}
            <tr>
              {#each columns as column}
                {@const meeting = row.cells[column.key]}
                <td
                  class={[
                    'relative h-[88px] min-w-[144px] border-b border-r border-stone-100 align-top last:border-r-0',
                    rowIndex === schedule.rows.length - 1 && 'border-b-0'
                  ]}
                >
                  {#if meeting}
                    {@const attendees = getMeetingAttendees(team, meeting)}
                    <div class="group absolute inset-0">
                      <a
                        href={getSuccessRoomKickoffMeetingPath(roomSlug, {
                          rowKey: row.key,
                          columnKey: column.key
                        })}
                        class="flex h-full w-full flex-col items-start overflow-hidden px-[14px] py-[12px] transition-colors duration-150 hover:bg-stone-50/70 focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-stone-900/20"
                      >
                        <span class="block pr-[18px] text-[14px] font-normal leading-[1.3] text-stone-900">
                          {meeting.title || 'Untitled meeting'}
                        </span>

                        {#if attendees.length > 0}
                          <span class="mt-auto flex -space-x-[6px] pt-[8px]">
                            {#each attendees as member (member.key)}
                              {#if member.imageHref}
                                <img
                                  src={member.imageHref}
                                  alt=""
                                  title={member.name}
                                  class="h-[20px] w-[20px] shrink-0 rounded-full border border-white object-cover"
                                  loading="lazy"
                                  decoding="async"
                                />
                              {:else}
                                <span
                                  class="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border border-white bg-stone-200/70 text-[11px] font-medium leading-none text-stone-600"
                                  title={member.name}
                                  aria-label={member.name}
                                >
                                  {member.name.slice(0, 1)}
                                </span>
                              {/if}
                            {/each}
                          </span>
                        {/if}
                      </a>

                      <button
                        type="button"
                        aria-label={`Remove meeting ${meeting.title || 'Untitled meeting'}`}
                        class="absolute right-[8px] top-[8px] flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-[6px] border-0 bg-transparent p-0 text-stone-400 opacity-0 transition duration-150 hover:bg-stone-100 hover:text-stone-700 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20"
                        onclick={() =>
                          onScheduleAction({
                            type: 'clear-cell',
                            rowKey: row.key,
                            columnKey: column.key
                          })}
                      >
                        <XIcon size={13} weight="regular" aria-hidden="true" />
                      </button>
                    </div>
                  {:else}
                    <button
                      type="button"
                      class="group absolute inset-0 flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 transition-colors duration-150 hover:bg-stone-50/70 focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-stone-900/20"
                      aria-label={`Add meeting to ${column.label} row ${rowIndex + 1}`}
                      onclick={() => (pendingCell = { rowKey: row.key, columnKey: column.key })}
                    >
                      <span
                        class="text-stone-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                      >
                        <PlusIcon size={18} weight="regular" aria-hidden="true" />
                      </span>
                    </button>
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</section>

<MeetingPresetModal
  open={pendingCell !== null}
  onCreate={attachMeeting}
  onClose={() => (pendingCell = null)}
/>
