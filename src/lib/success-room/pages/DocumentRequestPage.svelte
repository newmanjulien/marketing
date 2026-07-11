<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import {
    successRoomDocumentRequestDescription,
    successRoomDocumentRequestTitle,
    type DocumentRequestFormResult
  } from '../domain/documentRequests';
  import { getSuccessRoomHref } from '../domain/resources';
  import type { SuccessRoomBaseRoom } from '../domain/types';
  import DocumentRequestConfirmation from '../documents/DocumentRequestConfirmation.svelte';
  import DocumentRequestForm from '../documents/DocumentRequestForm.svelte';
  import Header from '../shell/Header.svelte';

  let {
    room,
    form
  }: {
    room: SuccessRoomBaseRoom;
    form?: DocumentRequestFormResult;
  } = $props();

  const submitted = $derived(form?.status === 'success');
  const formFailure = $derived(form?.status === 'success' ? undefined : form);
</script>

<PageFrame>
  <ContentMeasure as="article" width="narrow">
    <Header
      backHref={getSuccessRoomHref(room, 'documents')}
      backLabel="Success room"
      title={successRoomDocumentRequestTitle}
      description={submitted ? undefined : successRoomDocumentRequestDescription}
    />

    {#if submitted}
      <DocumentRequestConfirmation />
    {:else}
      <DocumentRequestForm form={formFailure} />
    {/if}
  </ContentMeasure>
</PageFrame>
