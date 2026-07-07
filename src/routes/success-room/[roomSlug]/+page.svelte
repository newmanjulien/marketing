<script lang="ts">
  import SuccessRoomLandingPage from '$lib/success-room/SuccessRoomLandingPage.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<SuccessRoomLandingPage room={data.room} />
