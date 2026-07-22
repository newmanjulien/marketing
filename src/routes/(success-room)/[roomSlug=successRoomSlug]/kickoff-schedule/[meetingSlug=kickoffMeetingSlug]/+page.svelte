<script lang="ts">
  import PasswordGate from '$lib/success-room/pages/PasswordGate.svelte';
  import KickoffMeetingPage from '$lib/success-room/pages/KickoffMeetingPage.svelte';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
</script>

{#if data.locked}
  <PasswordGate room={data.room} message={form?.message} />
{:else}
  <KickoffMeetingPage
    room={data.room}
    resource={data.resource}
    state={data.state}
    meetingCell={data.meetingCell}
  />
{/if}
