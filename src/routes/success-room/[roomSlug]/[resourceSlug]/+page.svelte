<script lang="ts">
  import SuccessRoomResourcePage from '$lib/success-room/SuccessRoomResourcePage.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<SuccessRoomResourcePage room={data.room} resource={data.resource} />
