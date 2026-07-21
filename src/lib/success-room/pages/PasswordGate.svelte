<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { getNamedFormAction } from '$lib/success-room/domain/urls';
  import ContentMeasure from '$lib/ui/ContentMeasure.svelte';
  import PageFrame from '$lib/ui/PageFrame.svelte';
  import Header from '../shell/Header.svelte';
  import type { SuccessRoomBaseRoom } from '../domain/types';

  let { room, message }: { room: SuccessRoomBaseRoom; message?: string } = $props();
</script>

<PageFrame>
  <ContentMeasure as="section" width="narrow">
    <div class="max-w-[440px]">
      <Header eyebrow="Success room" title={room.prospectName} description={room.description} />

      <form method="POST" action={getNamedFormAction(page.url, 'unlock')} use:enhance class="mt-[34px] grid gap-[12px]">
        <input
          class="h-[42px] w-full rounded-[8px] border border-stone-200 bg-white px-[14px] font-body text-[14px] font-book text-stone-700 outline-none shadow-[0_1px_0_rgba(48,47,45,0.03)] placeholder:text-stone-400 focus:border-stone-300 focus:text-stone-900"
          type="password"
          name="password"
          autocomplete="current-password"
          placeholder="Enter your password"
          aria-label="Password"
        />

        {#if message}
          <p class="m-0 text-[13px] font-book leading-[1.35] text-red-700">
            {message}
          </p>
        {/if}

        <button
          type="submit"
          class="inline-flex h-[38px] w-fit items-center justify-center rounded-[7px] border-0 bg-stone-750 px-[15px] font-body text-[13px] font-book leading-none text-white transition-colors duration-200 hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
        >
          Enter room
        </button>
      </form>
    </div>
  </ContentMeasure>
</PageFrame>
