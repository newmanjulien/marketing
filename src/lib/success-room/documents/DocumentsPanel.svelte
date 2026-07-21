<script lang="ts">
  import type { SuccessRoomLandingRoom } from '../domain/types';
  import { isSuccessRoomAssetResourceSlug } from '$shared/successRoomResources';
  import { getSuccessRoomDocumentRequestPath, getSuccessRoomResourcePath } from '../domain/urls';
  import DocumentLinkCard from './DocumentLinkCard.svelte';

  let {
    room
  }: {
    room: Pick<SuccessRoomLandingRoom, 'slug' | 'prospectName' | 'resources'>;
  } = $props();
</script>

<div class="grid gap-[18px]">
  <p class="text-[14px] font-book leading-[1.45] tracking-normal text-stone-700 sm:text-[15px]">
    Explore the documents and resources we co-created during this evaluation process
  </p>

  <nav
    class="grid grid-cols-1 gap-[14px] sm:grid-cols-2 sm:gap-[18px]"
    aria-label={`${room.prospectName} success room resources`}
  >
    {#each room.resources as resource (resource.slug)}
      {@const isAsset = isSuccessRoomAssetResourceSlug(resource.slug)}
      <DocumentLinkCard
        href={getSuccessRoomResourcePath(room.slug, resource.slug)}
        target={isAsset ? '_blank' : undefined}
        rel={isAsset ? 'noopener noreferrer' : undefined}
        label={resource.actionLabel}
      />
    {/each}

    <DocumentLinkCard
      href={getSuccessRoomDocumentRequestPath(room.slug)}
      label="Do you need something else?"
      variant="request"
    />
  </nav>
</div>
