<script lang="ts">
  import LandingPage from '$lib/success-room/pages/LandingPage.svelte';
  import PasswordGate from '$lib/success-room/pages/PasswordGate.svelte';
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

{#if data.locked === true}
  <PasswordGate
    prospectName={data.room.prospectName}
    description={data.room.description}
    message={form?.message}
  />
{:else if data.state}
  <LandingPage room={data.room} />
{/if}
