<script lang="ts">
  import { ArrowLeftIcon, ArrowRightIcon } from 'phosphor-svelte';

  let {
    currentIndex = $bindable(),
    itemCount
  }: {
    currentIndex: number;
    itemCount: number;
  } = $props();

  const buttonClasses =
    'group inline-flex min-h-[38px] items-center gap-[9px] rounded-[8px] text-[13px] font-book leading-none text-stone-700 transition-colors hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 disabled:cursor-not-allowed disabled:text-stone-300';
  const arrowCircleClasses =
    'flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors group-hover:bg-stone-200 group-hover:text-stone-900 group-disabled:bg-stone-50 group-disabled:text-stone-300';
</script>

<div class="mt-[14px] flex items-center justify-between">
  <button
    type="button"
    class={[buttonClasses, 'pr-[8px]']}
    disabled={currentIndex === 0}
    onclick={() => (currentIndex -= 1)}
  >
    <span
      class={arrowCircleClasses}
      aria-hidden="true"
    >
      <ArrowLeftIcon size={15} weight="regular" />
    </span>
    <span>Previous</span>
  </button>

  <button
    type="button"
    class={[buttonClasses, 'pl-[8px]']}
    disabled={currentIndex >= itemCount - 1}
    onclick={() => (currentIndex += 1)}
  >
    <span>Next</span>
    <span
      class={arrowCircleClasses}
      aria-hidden="true"
    >
      <ArrowRightIcon size={15} weight="regular" />
    </span>
  </button>
</div>
