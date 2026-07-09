<script lang="ts">
  import SuccessRoomLandingPage from '$lib/success-room/SuccessRoomLandingPage.svelte';
  import SuccessRoomPasswordGate from '$lib/success-room/SuccessRoomPasswordGate.svelte';
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

{#if data.locked === true}
  <SuccessRoomPasswordGate
    prospectName={data.room.prospectName}
    description={data.room.description}
    message={form?.message}
  />
{:else if data.state}
  <SuccessRoomLandingPage room={data.room} state={data.state} />
{/if}
