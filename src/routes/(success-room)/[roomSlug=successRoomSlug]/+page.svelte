<script lang="ts">
  import LandingPage from '$lib/success-room/pages/LandingPage.svelte';
  import PasswordGate from '$lib/success-room/pages/PasswordGate.svelte';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
</script>

{#if data.locked}
  <PasswordGate room={data.room} message={form?.message} />
{:else}
  <LandingPage room={data.room} state={data.state} />
{/if}
