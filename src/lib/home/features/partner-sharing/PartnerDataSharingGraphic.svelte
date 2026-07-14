<script lang="ts">
  type PartnerDataShare = {
    partnerName: string;
    dataSourceSummary: string;
    dataSourceCoverage: number;
  };

  const partnerDataShares = [
    {
      partnerName: 'Kensington, Blake & Thorne',
      dataSourceSummary: 'all data sources',
      dataSourceCoverage: 1
    },
    {
      partnerName: 'Caldwell, Cross & Keating',
      dataSourceSummary: '5 data sources',
      dataSourceCoverage: 0.69
    },
    {
      partnerName: 'Brightfield Partners',
      dataSourceSummary: '2 data sources',
      dataSourceCoverage: 0.14
    }
  ] as const satisfies readonly PartnerDataShare[];
</script>

<div class="rounded-[16px] border border-stone-200/70 bg-white px-[18px] py-[22px] shadow-[0_1px_0_rgba(48,47,45,0.03)] sm:px-[21px] sm:py-[24px]">
  <div class="flex items-center justify-between gap-4">
    <h3 class="text-[14px] font-book leading-none tracking-normal text-stone-700 sm:text-[15px]">
      Control what data you share
    </h3>

    <span class="rounded-[10px] bg-stone-50 px-[8px] py-[5px] text-[12px] leading-none text-stone-400 sm:text-[13px]">
      {partnerDataShares.length} partners
    </span>
  </div>

  <div class="mt-[20px] overflow-hidden rounded-[12px] border border-stone-200/70 bg-white">
    {#each partnerDataShares as partnerDataShare (partnerDataShare.partnerName)}
      <article class="border-b border-stone-200/70 px-[12px] py-[18px] last:border-b-0 sm:py-[19px]">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <h4 class="truncate text-[14px] font-book leading-[1.2] tracking-normal text-stone-700 sm:text-[15px]">
              {partnerDataShare.partnerName}
            </h4>

            <span class="mt-[14px] block truncate text-[12px] leading-none tracking-normal text-stone-300 sm:text-[13px]">
              {partnerDataShare.dataSourceSummary}
            </span>
          </div>
        </div>

        <div class="mt-[14px] h-[10px] overflow-hidden rounded-full border border-stone-200/70 bg-stone-50">
          <div
            class="h-full rounded-full bg-stone-200"
            style:width={`${partnerDataShare.dataSourceCoverage * 100}%`}
            aria-hidden="true"
          ></div>
        </div>
      </article>
    {/each}
  </div>
</div>
