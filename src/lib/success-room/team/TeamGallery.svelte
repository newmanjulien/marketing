<script lang="ts">
  import { PlusIcon } from 'phosphor-svelte';
  import { flip } from 'svelte/animate';
  import { cubicOut } from 'svelte/easing';
  import type { SuccessRoomTeamMember } from '../domain/types';

  type TeamGalleryItem =
    | {
        key: string;
        type: 'member';
        member: SuccessRoomTeamMember;
      }
    | {
        key: 'add-team-member';
        type: 'add';
      };

  let {
    team,
    onAddTeamMember
  }: {
    team: SuccessRoomTeamMember[];
    onAddTeamMember: () => void;
  } = $props();

  const prefersReducedMotion = (node: Element) =>
    node.ownerDocument.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ??
    false;
  const prefersReducedMotionGlobally = () =>
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const getGalleryReflowDuration = () => (prefersReducedMotionGlobally() ? 0 : 180);
  const teamMemberEntry = (node: Element) => {
    if (prefersReducedMotion(node)) {
      return { duration: 0 };
    }

    return {
      duration: 220,
      easing: cubicOut,
      css: (t: number) => `
        opacity: ${t};
        transform: translateY(${(1 - t) * 6}px) scale(${0.985 + t * 0.015});
        transform-origin: center top;
      `
    };
  };

  const galleryItems = $derived<TeamGalleryItem[]>([
    ...team.map((member) => ({
      key: member.key,
      type: 'member' as const,
      member
    })),
    {
      key: 'add-team-member',
      type: 'add' as const
    }
  ]);
</script>

<ul class="grid grid-cols-2 gap-x-[24px] gap-y-[34px] sm:grid-cols-4" aria-label="Team">
  {#each galleryItems as item (item.key)}
    <li
      class="min-w-0"
      class:group={item.type === 'member'}
      animate:flip={{ duration: getGalleryReflowDuration, easing: cubicOut }}
    >
      {#if item.type === 'member'}
        <div in:teamMemberEntry>
          {#if item.member.imageHref}
            <img
              src={item.member.imageHref}
              alt=""
              class="aspect-square w-full rounded-[8px] object-cover grayscale transition duration-200 group-hover:grayscale-0"
              loading="lazy"
              decoding="async"
            />
          {:else}
            <span
              class="flex aspect-square w-full items-center justify-center rounded-[8px] bg-stone-200/70 text-[24px] font-normal text-stone-600"
              aria-hidden="true"
            >
              {item.member.name.slice(0, 1)}
            </span>
          {/if}

          <div class="mt-[13px] min-w-0">
            <h2
              class="m-0 break-words text-[15px] font-normal leading-[1.12] tracking-normal text-stone-750"
            >
              {item.member.name}
            </h2>
            <p
              class="mt-[7px] break-words text-[14px] font-book leading-[1.2] tracking-normal text-stone-500"
            >
              {item.member.role}
            </p>
          </div>
        </div>
      {:else}
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
              Add someone
            </span>
          </span>
        </button>
      {/if}
    </li>
  {/each}
</ul>
