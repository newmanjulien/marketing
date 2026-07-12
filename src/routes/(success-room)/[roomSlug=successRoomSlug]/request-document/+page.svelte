<script lang="ts">
  import DocumentRequestPage from '$lib/success-room/pages/DocumentRequestPage.svelte';
  import PasswordGate from '$lib/success-room/pages/PasswordGate.svelte';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
  const documentRequestForm = $derived(
    form && 'documentRequest' in form ? form.documentRequest : undefined
  );
</script>

{#if data.locked === true}
  <PasswordGate
    prospectName={data.room.prospectName}
    description={data.room.description}
    message={form?.message}
  />
{:else}
  <DocumentRequestPage
    room={data.room}
    form={documentRequestForm}
    submitted={data.documentRequestSubmitted && !documentRequestForm}
  />
{/if}
