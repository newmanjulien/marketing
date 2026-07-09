<script lang="ts">
  import PasswordGate from '$lib/success-room/pages/PasswordGate.svelte';
  import ResourcePage from '$lib/success-room/pages/ResourcePage.svelte';
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

{#if data.locked === true}
  <PasswordGate
    prospectName={data.room.prospectName}
    description={data.room.description}
    message={form?.message}
  />
{:else if data.state && data.resource}
  <ResourcePage room={data.room} state={data.state} resource={data.resource} />
{/if}
