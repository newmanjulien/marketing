<script lang="ts">
  import { getSuccessRoomResourcePath } from '../domain/urls';
  import type { SuccessRoomBaseRoom, SuccessRoomResourceSummary } from '../domain/types';
  import DocumentLinkCard from './DocumentLinkCard.svelte';

  let {
    room,
    resource
  }: {
    room: Pick<SuccessRoomBaseRoom, 'slug'>;
    resource: SuccessRoomResourceSummary;
  } = $props();
</script>

<DocumentLinkCard
  href={getSuccessRoomResourcePath(room.slug, resource.slug)}
  target={resource.delivery.type === 'asset' ? '_blank' : undefined}
  rel={resource.delivery.type === 'asset' ? 'noopener noreferrer' : undefined}
  label={resource.actionLabel}
/>
