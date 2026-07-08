<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';

  let {
    prospectName,
    description,
    message
  }: {
    prospectName: string;
    description: string;
    message?: string;
  } = $props();
</script>

<PageFrame>
  <ContentMeasure as="section" width="narrow">
    <div class="max-w-[440px]">
      <p class="m-0 text-[14px] font-medium leading-none tracking-normal text-stone-500">
        Success room
      </p>
      <h1 class="mt-[28px] font-heading text-[32px] font-normal leading-[1.05] tracking-normal text-stone-750">
        {prospectName}
      </h1>
      <p class="mt-[20px] text-[15px] font-book leading-[1.55] tracking-normal text-stone-700 sm:text-[16px]">
        {description}
      </p>

      <form method="POST" action="?/unlock" class="mt-[34px] grid gap-[12px]">
        <label class="grid gap-[8px] text-[13px] font-book leading-none tracking-normal text-stone-700">
          Password
          <input
            class="h-[42px] w-full rounded-[8px] border border-stone-200/70 bg-white px-[14px] font-body text-[14px] font-book tracking-normal text-stone-700 outline-none shadow-[0_1px_0_rgba(48,47,45,0.03)] placeholder:text-stone-400 focus:border-stone-300 focus:text-stone-900"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </label>

        {#if message}
          <p class="m-0 text-[13px] font-book leading-[1.35] tracking-normal text-red-700">
            {message}
          </p>
        {/if}

        <button
          type="submit"
          class="inline-flex h-[38px] w-fit items-center justify-center rounded-[7px] border-0 bg-stone-750 px-[15px] font-body text-[13px] font-book leading-none tracking-normal text-white transition-colors duration-200 hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
        >
          Enter room
        </button>
      </form>
    </div>
  </ContentMeasure>
</PageFrame>
