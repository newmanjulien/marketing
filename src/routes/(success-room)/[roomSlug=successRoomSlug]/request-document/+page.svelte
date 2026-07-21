<script lang="ts">
  import DocumentRequestPage from '$lib/success-room/pages/DocumentRequestPage.svelte';
  import PasswordGate from '$lib/success-room/pages/PasswordGate.svelte';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
</script>

{#if data.locked}
  <PasswordGate room={data.room} message={form?.message} />
{:else}
  <DocumentRequestPage
    room={data.room}
    form={form?.documentRequest}
    submitted={data.documentRequestSubmitted && !form?.documentRequest}
  />
{/if}
