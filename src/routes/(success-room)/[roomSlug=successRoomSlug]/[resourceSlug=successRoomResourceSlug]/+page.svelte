<script lang="ts">
  import PasswordGate from '$lib/success-room/pages/PasswordGate.svelte';
  import ResourcePage from '$lib/success-room/pages/ResourcePage.svelte';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
</script>

{#if data.locked}
  <PasswordGate room={data.room} message={form?.message} />
{:else}
  <ResourcePage room={data.room} state={data.state} resource={data.resource} />
{/if}
