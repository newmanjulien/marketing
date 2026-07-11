<script lang="ts">
  import { getSuccessRoomResourceLink } from '../domain/resources';
  import type { SuccessRoomBaseRoom, SuccessRoomResourceSummary } from '../domain/types';
  import DocumentLinkCard from './DocumentLinkCard.svelte';

  let {
    room,
    resource
  }: {
    room: SuccessRoomBaseRoom;
    resource: SuccessRoomResourceSummary;
  } = $props();

  const link = $derived(getSuccessRoomResourceLink(room, resource));
</script>

<DocumentLinkCard
  href={link.href}
  target={link.target}
  rel={link.rel}
  label={resource.actionLabel}
/>
