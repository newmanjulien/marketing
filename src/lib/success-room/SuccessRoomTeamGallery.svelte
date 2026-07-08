<script lang="ts">
  import { PlusIcon } from 'phosphor-svelte';
  import type { SuccessRoomTeamMember } from './successRoomTypes';

  let {
    team,
    onAddTeamMember
  }: {
    team: SuccessRoomTeamMember[];
    onAddTeamMember: () => void;
  } = $props();
</script>

<ul class="grid grid-cols-2 gap-x-[24px] gap-y-[34px] sm:grid-cols-4" aria-label="Team">
  {#each team as member (member.id)}
    <li class="group min-w-0">
      <img
        src={member.imageHref}
        alt=""
        class="aspect-square w-full rounded-[8px] object-cover grayscale transition duration-200 group-hover:grayscale-0"
        loading="lazy"
        decoding="async"
      />

      <div class="mt-[13px] min-w-0">
        <h2
          class="m-0 break-words text-[15px] font-normal leading-[1.12] tracking-normal text-stone-750"
        >
          {member.name}
        </h2>
        <p class="mt-[7px] break-words text-[14px] font-book leading-[1.2] tracking-normal text-stone-500">
          {member.role}
        </p>
      </div>
    </li>
  {/each}

  <li class="min-w-0">
    <button
      type="button"
      aria-label="Add team member"
      class="group grid w-full min-w-0 cursor-pointer border-0 bg-transparent p-0 text-left text-inherit focus-visible:rounded-[8px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-stone-900/20"
      onclick={onAddTeamMember}
    >
      <span
        class="flex aspect-square w-full items-center justify-center rounded-[8px] bg-stone-200/70 text-stone-700 transition-[background-color,color] duration-200 group-hover:bg-stone-300/70 group-hover:text-stone-900"
        aria-hidden="true"
      >
        <PlusIcon size={26} weight="regular" />
      </span>

      <span class="mt-[13px] block min-w-0">
        <span
          class="m-0 block break-words text-[15px] font-normal leading-[1.12] tracking-normal text-stone-750"
        >
          Add team member
        </span>
        <span
          class="mt-[7px] block break-words text-[14px] font-book leading-[1.2] tracking-normal text-stone-500"
        >
          Invite someone
        </span>
      </span>
    </button>
  </li>
</ul>
