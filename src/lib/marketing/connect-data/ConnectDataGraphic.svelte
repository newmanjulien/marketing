<script lang="ts">
  import { ArrowsClockwiseIcon } from 'phosphor-svelte';
  import type { DataSource } from './dataSources';

  let { source, onNext }: { source: DataSource; onNext?: () => void } = $props();

  const connectionSettings = $derived([
    { label: 'provider', value: source.provider },
    { label: 'access', value: 'Read only' },
    { label: 'retention', value: 'Zero' },
    { label: 'shared', value: 'Never' },
    { label: 'encryption', value: 'End-to-end' },
    { label: 'revoke', value: 'Anytime' }
  ]);
</script>

<div
  class="relative overflow-hidden rounded-[16px] border border-stone-200 bg-white shadow-[0_1px_0_rgba(48,47,45,0.03)]"
>
  {#if onNext}
    <button
      type="button"
      class="absolute right-[12px] top-[12px] z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400 shadow-[0_1px_2px_rgba(48,47,45,0.08)] transition-colors hover:bg-stone-50 hover:text-stone-600"
      aria-label="Show next data source"
      title="Show next data source"
      onclick={onNext}
    >
      <ArrowsClockwiseIcon size={15} weight="bold" />
    </button>
  {/if}

  <div class="grid sm:grid-cols-[1fr_minmax(0,0.9fr)]">
    <div class="hidden flex-col gap-[16px] p-[16px] sm:flex">
      {#each connectionSettings as setting (setting.label)}
        <div class="flex items-center justify-between gap-4">
          <span class="text-[16px] font-book leading-none text-stone-500">
            {setting.label}
          </span>

          <span
            class="min-w-[112px] rounded-[6px] border border-stone-200 bg-stone-50 px-[14px] py-[9px] text-center text-[14px] leading-none text-stone-600"
          >
            {setting.value}
          </span>
        </div>
      {/each}
    </div>

    <!-- Below sm: the settings column is hidden and this pane starts at the card
         top, so the cycle button (ending 42px down) would sit on the inner card —
         the extra top padding keeps them apart. -->
    <div
      class={[
        'flex items-center justify-center bg-stone-50/60 p-[18px] sm:border-l sm:border-stone-200 sm:p-[22px]',
        onNext && 'max-sm:pt-[54px]'
      ]}
    >
      <div class="w-full max-w-[360px] rounded-[10px] border-[1.5px] border-stone-500 bg-white p-[18px] shadow-[0_1px_2px_rgba(48,47,45,0.04)]">
        <div class="flex items-center gap-[10px]">
          <source.icon size={22} class="shrink-0 text-stone-400" />
          <span class="text-[17px] font-book leading-none text-stone-600">
            {source.title}
          </span>
        </div>

        <div class="my-[16px] h-px bg-stone-200/70"></div>

        <div class="flex flex-col items-center gap-[10px]">
          <div class="h-[12px] w-[85%] rounded-full bg-stone-100" aria-hidden="true"></div>
          <div class="h-[12px] w-[60%] rounded-full bg-stone-100" aria-hidden="true"></div>
        </div>

        <div
          class="mt-[18px] flex h-[44px] items-center justify-center rounded-[6px] bg-stone-800 text-[17px] font-book leading-none text-white"
          aria-hidden="true"
        >
          {source.buttonText}
        </div>
      </div>
    </div>
  </div>
</div>
