<script lang="ts">
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import PageFrame from '$lib/ui/PageFrame.svelte';
  import type { DocumentRequestFormFailure, SuccessRoomBaseRoom } from '../domain/types';
  import { getSuccessRoomPath } from '../domain/urls';
  import DocumentRequestConfirmation from '../documents/DocumentRequestConfirmation.svelte';
  import DocumentRequestForm from '../documents/DocumentRequestForm.svelte';
  import Header from '../shell/Header.svelte';

  let {
    room,
    form,
    submitted
  }: {
    room: SuccessRoomBaseRoom;
    form?: DocumentRequestFormFailure;
    submitted: boolean;
  } = $props();
</script>

<PageFrame>
  <ContentMeasure as="article" width="narrow">
    <Header
      backHref={getSuccessRoomPath(room.slug, 'documents')}
      backLabel="Success room"
      title="Do you need something else?"
      description={submitted
        ? undefined
        : 'Describe any additional document that would help you socialize this opportunity within your firm'}
    />

    {#if submitted}
      <DocumentRequestConfirmation />
    {:else}
      <DocumentRequestForm {form} />
    {/if}
  </ContentMeasure>
</PageFrame>
