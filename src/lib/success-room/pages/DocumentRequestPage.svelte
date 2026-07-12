<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import {
    successRoomDocumentRequestDescription,
    successRoomDocumentRequestTitle,
    type DocumentRequestFormFailure
  } from '../domain/documentRequests';
  import { getSuccessRoomPath } from '../domain/urls';
  import type { SuccessRoomBaseRoom } from '../domain/types';
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
      title={successRoomDocumentRequestTitle}
      description={submitted ? undefined : successRoomDocumentRequestDescription}
    />

    {#if submitted}
      <DocumentRequestConfirmation />
    {:else}
      <DocumentRequestForm {form} />
    {/if}
  </ContentMeasure>
</PageFrame>
