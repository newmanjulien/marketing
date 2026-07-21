<script lang="ts">
  type ConversionRow = {
    label: string;
    count: string;
    rate: string;
    curve: string; // decorative sparkline path, drawn in the 300×70 viewBox below
  };

  const conversions: readonly ConversionRow[] = [
    {
      label: 'Invite → Accepted',
      count: '37',
      rate: '74%',
      curve: 'M0 64 C 55 60, 95 30, 150 22 C 205 14, 250 8, 300 3'
    },
    {
      label: 'Data connected',
      count: '31',
      rate: '62%',
      curve: 'M0 58 C 60 56, 100 48, 150 38 C 205 27, 255 20, 300 12'
    },
    {
      label: 'New clients referred',
      count: '28',
      rate: '41%',
      curve: 'M0 60 C 60 58, 90 44, 140 40 C 175 37, 190 46, 210 42 C 245 35, 270 12, 300 4'
    }
  ];

  // The row shown when nothing is hovered: the last row, the funnel's end result.
  const defaultConversion = conversions[conversions.length - 1];

  // $state.raw so `active === row` reference comparison works against the array items.
  let active = $state.raw<ConversionRow>(defaultConversion);
</script>

<div class="rounded-[16px] border border-stone-200 bg-white px-[18px] py-[18px] shadow-[0_1px_0_rgba(48,47,45,0.03)] sm:px-[22px] sm:py-[22px]">
  <div class="relative">
    <p class="text-[16px] font-book leading-none tracking-normal text-stone-500">
      Your network
    </p>

    <p class="mt-[16px] font-heading text-[56px] font-book leading-none tracking-tight tabular-nums text-stone-750">
      {active.count}
    </p>

    <svg
      class="pointer-events-none absolute right-0 top-[6px] h-[70px] w-[62%] text-stone-200"
      viewBox="0 0 300 70"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="network-results-line-fade" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="currentColor" stop-opacity="0" />
          <stop offset="0.4" stop-color="currentColor" stop-opacity="1" />
        </linearGradient>
      </defs>
      <path
        d={active.curve}
        stroke="url(#network-results-line-fade)"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  </div>

  <div class="my-[22px] -mx-[18px] h-px bg-stone-200/70 sm:-mx-[22px]"></div>

  <div
    class="-mx-[8px] flex flex-col gap-[4px] sm:-mx-[10px]"
    role="presentation"
    onmouseleave={() => (active = defaultConversion)}
  >
    {#each conversions as row (row.label)}
      {@const isActive = active === row}
      <div
        class={[
          'flex cursor-default items-center gap-[12px] rounded-[10px] border px-[14px] py-[9px] transition-colors',
          isActive ? 'border-stone-200' : 'border-transparent'
        ]}
        role="presentation"
        onmouseenter={() => (active = row)}
      >
        <span
          class={['h-[7px] w-[7px] shrink-0 rounded-full transition-colors', isActive ? 'bg-stone-700' : 'bg-stone-300']}
          aria-hidden="true"
        ></span>

        <span
          class={[
            'flex-1 truncate text-[16px] font-book leading-none tracking-normal transition-colors',
            isActive ? 'text-stone-700' : 'text-stone-400'
          ]}
        >
          {row.label}
        </span>

        <span class="shrink-0 font-mono text-[15px] leading-none tracking-normal text-stone-400">
          {row.count}
        </span>

        <span
          class={[
            'shrink-0 rounded-[6px] py-[6px] font-mono text-[14px] leading-none tracking-normal transition-colors',
            isActive ? 'bg-stone-100 px-[9px] text-stone-600' : 'text-stone-400'
          ]}
        >
          {row.rate}
        </span>
      </div>
    {/each}
  </div>
</div>
