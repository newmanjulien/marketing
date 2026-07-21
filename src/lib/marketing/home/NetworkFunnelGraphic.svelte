<script lang="ts">
  const invited = 50;

  const stages = [
    { label: 'Invites accepted', detail: 'joined your network', count: 37 },
    { label: 'Data connected', detail: 'sharing their data', count: 31 },
    { label: 'New clients referred', detail: 'growing your practice', count: 8 }
  ];

  // The section is about the network connecting their data, so that stage
  // carries the highlight when nothing is hovered.
  const defaultIndex = 1;

  let activeIndex = $state(defaultIndex);
</script>

<div class="rounded-[16px] border border-stone-200 bg-white p-[18px] shadow-[0_1px_0_rgba(48,47,45,0.03)] sm:p-[22px]">
  <div class="flex items-center justify-between gap-4">
    <p class="text-[17px] font-book leading-none text-stone-700">Your network</p>

    <span
      class="shrink-0 rounded-[6px] bg-stone-100 px-[9px] py-[6px] text-[14px] leading-none text-stone-600"
    >
      {invited} invited
    </span>
  </div>

  <div
    class="mt-[14px] -mx-[8px] flex flex-col gap-[6px] sm:-mx-[10px]"
    role="presentation"
    onmouseleave={() => (activeIndex = defaultIndex)}
  >
    {#each stages as stage, index (stage.label)}
      {@const isActive = activeIndex === index}
      <div
        class={[
          'cursor-default rounded-[10px] border px-[14px] py-[13px] transition-colors',
          isActive ? 'border-stone-200' : 'border-transparent'
        ]}
        role="presentation"
        onmouseenter={() => (activeIndex = index)}
      >
        <div class="flex items-center justify-between gap-[12px]">
          <span
            class={[
              'truncate text-[16px] font-book leading-none transition-colors',
              isActive ? 'text-stone-700' : 'text-stone-500'
            ]}
          >
            {stage.label}
          </span>

          <span
            class="shrink-0 rounded-[6px] bg-stone-100 px-[9px] py-[6px] text-[14px] leading-none text-stone-600"
          >
            {stage.count}
          </span>
        </div>

        <p class="mt-[10px] text-[14px] leading-none text-stone-400">
          {stage.detail}
        </p>

        <div class="mt-[13px] h-[7px] overflow-hidden rounded-full bg-stone-100" aria-hidden="true">
          <div
            class={['h-full rounded-full transition-colors', isActive ? 'bg-stone-300' : 'bg-stone-200']}
            style:width="{(stage.count / invited) * 100}%"
          ></div>
        </div>
      </div>
    {/each}
  </div>
</div>
