<script lang="ts">
  import { ArrowLeftIcon, ArrowRightIcon } from 'phosphor-svelte';

  let {
    currentIndex,
    itemCount,
    onprevious,
    onnext,
  }: {
    currentIndex: number;
    itemCount: number;
    onprevious: () => void;
    onnext: () => void;
  } = $props();

  const isFirst = $derived(currentIndex === 0);
  const isLast = $derived(currentIndex >= itemCount - 1);
</script>

<div class="mt-[14px] flex items-center justify-between">
  <button
    type="button"
    class="group inline-flex min-h-[38px] items-center gap-[9px] rounded-[8px] pr-[8px] text-[13px] font-book leading-none text-stone-700 transition-colors hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 disabled:cursor-not-allowed disabled:text-stone-300"
    disabled={isFirst}
    onclick={onprevious}
    aria-label="Show previous"
  >
    <span
      class="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors group-hover:bg-stone-200 group-hover:text-stone-900 group-disabled:bg-stone-50 group-disabled:text-stone-300"
      aria-hidden="true"
    >
      <ArrowLeftIcon size={15} weight="regular" />
    </span>
    <span>Previous</span>
  </button>

  <button
    type="button"
    class="group inline-flex min-h-[38px] items-center gap-[9px] rounded-[8px] pl-[8px] text-[13px] font-book leading-none text-stone-700 transition-colors hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 disabled:cursor-not-allowed disabled:text-stone-300"
    disabled={isLast}
    onclick={onnext}
    aria-label="Show next"
  >
    <span>Next</span>
    <span
      class="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors group-hover:bg-stone-200 group-hover:text-stone-900 group-disabled:bg-stone-50 group-disabled:text-stone-300"
      aria-hidden="true"
    >
      <ArrowRightIcon size={15} weight="regular" />
    </span>
  </button>
</div>
