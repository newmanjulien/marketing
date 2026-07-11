<script lang="ts">
  import LandingPage from '$lib/success-room/pages/LandingPage.svelte';
  import PasswordGate from '$lib/success-room/pages/PasswordGate.svelte';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
</script>

{#if data.locked === true}
  <PasswordGate
    prospectName={data.room.prospectName}
    description={data.room.description}
    message={form?.message}
  />
{:else}
  <LandingPage room={data.room} state={data.state} />
{/if}
