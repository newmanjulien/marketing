<script lang="ts">
  import { successRoomDocumentRequestTitle } from '../domain/documentRequests';
  import { getSuccessRoomDocumentRequestPath } from '../domain/urls';
  import type { SuccessRoomLandingRoom } from '../domain/types';
  import DocumentLinkCard from './DocumentLinkCard.svelte';
  import ResourceCard from './ResourceCard.svelte';

  let {
    room
  }: {
    room: Pick<SuccessRoomLandingRoom, 'slug' | 'prospectName' | 'resources'>;
  } = $props();

  const descriptionClasses =
    'max-w-[42rem] text-[14px] font-book leading-[1.45] tracking-normal text-stone-700 sm:text-[15px]';
</script>

<div class="grid gap-[18px]">
  <p class={descriptionClasses}>
    Explore the documents and resources we co-created during this evaluation process
  </p>

  <nav
    class="grid grid-cols-1 gap-[14px] sm:grid-cols-2 sm:gap-[18px]"
    aria-label={`${room.prospectName} success room resources`}
  >
    {#each room.resources as resource (resource.slug)}
      <ResourceCard {room} {resource} />
    {/each}

    <DocumentLinkCard
      href={getSuccessRoomDocumentRequestPath(room.slug)}
      label={successRoomDocumentRequestTitle}
      variant="request"
    />
  </nav>
</div>
