<script lang="ts">
  type Segment = {
    name: string;
    rule: string;
    progress: number;
  };

  const segments: Segment[] = [
    {
      name: 'Kensington, Blake & Thorne',
      rule: 'all data sources',
      progress: 1
    },
    {
      name: 'Caldwell, Cross & Keating',
      rule: '5 data sources',
      progress: 0.69
    },
    {
      name: 'Brightfield Partners',
      rule: '2 data sources',
      progress: 0.14
    }
  ];
</script>

<div class="rounded-[8px] border border-stone-200/70 bg-white px-[18px] py-[22px] shadow-[0_1px_0_rgba(48,47,45,0.03)] md:px-[21px] md:py-[24px]">
  <div class="flex items-center justify-between gap-4">
    <h3 class="text-[14px] font-normal leading-none tracking-normal text-stone-700 md:text-[15px]">
      Control what data you share
    </h3>

    <span class="rounded-[8px] bg-stone-50 px-[8px] py-[5px] text-[12px] leading-none text-stone-400 md:text-[13px]">
      3 partners
    </span>
  </div>

  <div class="mt-[20px] overflow-hidden rounded-[6px] border border-stone-200/70 bg-white">
    {#each segments as segment, index}
      <article class:border-b={index < segments.length - 1} class="border-stone-200/70 px-[12px] py-[18px] md:px-[12px] md:py-[19px]">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <h4 class="truncate text-[14px] font-normal leading-[1.2] tracking-normal text-stone-700 md:text-[15px]">
              {segment.name}
            </h4>

            <div class="mt-[14px] flex min-w-0 items-center gap-[6px]">
              <span class="truncate text-[12px] leading-none tracking-normal text-stone-300 md:text-[13px]">
                {segment.rule}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-[14px] h-[10px] overflow-hidden rounded-full border border-stone-200/70 bg-stone-50">
          <div
            class="h-full rounded-full bg-stone-200"
            style={`width: ${segment.progress * 100}%`}
            aria-hidden="true"
          ></div>
        </div>
      </article>
    {/each}
  </div>
</div>
