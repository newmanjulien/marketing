<script lang="ts">
  import { successRoomDocumentRequestTitle } from '../domain/documentRequests';
  import { getSuccessRoomDocumentRequestPath } from '../domain/urls';
  import type { SuccessRoomBaseRoom } from '../domain/types';
  import DocumentLinkCard from './DocumentLinkCard.svelte';

  let { room }: { room: Pick<SuccessRoomBaseRoom, 'slug'> } = $props();
</script>

<DocumentLinkCard
  href={getSuccessRoomDocumentRequestPath(room.slug)}
  label={successRoomDocumentRequestTitle}
  variant="request"
/>
