<script lang="ts">
  import { MicrosoftOutlookLogoIcon } from 'phosphor-svelte';

  type ConnectionSetting = {
    label: string;
    value: string;
  };

  const connectionSettings = [
    { label: 'provider', value: 'Outlook' },
    { label: 'access', value: 'Read only' },
    { label: 'retention', value: 'Zero' },
    { label: 'shared', value: 'Never' },
    { label: 'encryption', value: 'End-to-end' },
    { label: 'revoke', value: 'Anytime' }
  ] as const satisfies readonly ConnectionSetting[];
</script>

<div class="overflow-hidden rounded-[16px] border border-stone-200/70 bg-white shadow-[0_1px_0_rgba(48,47,45,0.03)]">
  <div class="grid grid-cols-1 sm:grid-cols-[1fr_minmax(0,0.9fr)]">
    <div class="flex flex-col gap-[16px] px-[14px] py-[14px] sm:px-[16px] sm:py-[16px]">
      {#each connectionSettings as setting (setting.label)}
        <div class="flex items-center justify-between gap-4">
          <span class="text-[15px] font-book leading-none tracking-normal text-stone-500 sm:text-[16px]">
            {setting.label}
          </span>

          <span
            class="min-w-[112px] rounded-[6px] border border-stone-200/70 bg-stone-50 px-[14px] py-[9px] text-center font-mono text-[14px] leading-none tracking-normal text-stone-600"
          >
            {setting.value}
          </span>
        </div>
      {/each}
    </div>

    <div class="flex items-center justify-center border-t border-stone-200/70 bg-stone-50/60 px-[18px] py-[18px] sm:border-l sm:border-t-0 sm:px-[22px] sm:py-[22px]">
      <div class="w-full max-w-[360px] rounded-[10px] border border-stone-200/70 bg-white p-[18px] shadow-[0_1px_2px_rgba(48,47,45,0.04)]">
        <div class="flex items-center gap-[10px]">
          <span class="flex h-[22px] w-[22px] shrink-0 items-center justify-center text-stone-400">
            <MicrosoftOutlookLogoIcon size={22} weight="regular" />
          </span>
          <span class="text-[17px] font-book leading-none tracking-normal text-stone-600">
            Outlook
          </span>
        </div>

        <div class="my-[16px] h-px w-full bg-stone-200/70"></div>

        <div class="flex flex-col items-center gap-[10px]">
          <div class="h-[12px] w-[85%] rounded-full bg-stone-100" aria-hidden="true"></div>
          <div class="h-[12px] w-[60%] rounded-full bg-stone-100" aria-hidden="true"></div>
        </div>

        <div
          class="mt-[18px] flex h-[52px] w-full items-center justify-center rounded-[6px] bg-stone-800 text-[17px] font-book leading-none tracking-normal text-white"
          aria-hidden="true"
        >
          Connect calendar
        </div>
      </div>
    </div>
  </div>
</div>
