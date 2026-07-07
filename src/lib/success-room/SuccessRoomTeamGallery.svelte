<script lang="ts">
  import type { SuccessRoomTeamMember } from './successRoomTypes';

  let { team }: { team: SuccessRoomTeamMember[] } = $props();
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
</ul>
