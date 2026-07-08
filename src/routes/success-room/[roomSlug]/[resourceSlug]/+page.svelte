<script lang="ts">
  import SuccessRoomPasswordGate from '$lib/success-room/SuccessRoomPasswordGate.svelte';
  import SuccessRoomResourcePage from '$lib/success-room/SuccessRoomResourcePage.svelte';
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

{#if data.locked === true}
  <SuccessRoomPasswordGate
    prospectName={data.room.prospectName}
    description={data.room.description}
    message={form?.message}
  />
{:else if data.state && data.resource}
  <SuccessRoomResourcePage room={data.room} state={data.state} resource={data.resource} />
{/if}
