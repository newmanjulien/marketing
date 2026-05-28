<script lang="ts">
  import { partnerDataShares } from './partnerSharingContent';
</script>

<div class="rounded-[8px] border border-stone-200/70 bg-white px-[18px] py-[22px] shadow-[0_1px_0_rgba(48,47,45,0.03)] md:px-[21px] md:py-[24px]">
  <div class="flex items-center justify-between gap-4">
    <h3 class="text-[14px] font-normal leading-none tracking-normal text-stone-700 md:text-[15px]">
      Control what data you share
    </h3>

    <span class="rounded-[8px] bg-stone-50 px-[8px] py-[5px] text-[12px] leading-none text-stone-400 md:text-[13px]">
      {partnerDataShares.length} partners
    </span>
  </div>

  <div class="mt-[20px] overflow-hidden rounded-[6px] border border-stone-200/70 bg-white">
    {#each partnerDataShares as partnerDataShare (partnerDataShare.partnerName)}
      <article class="border-b border-stone-200/70 px-[12px] py-[18px] last:border-b-0 md:py-[19px]">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <h4 class="truncate text-[14px] font-normal leading-[1.2] tracking-normal text-stone-700 md:text-[15px]">
              {partnerDataShare.partnerName}
            </h4>

            <span class="mt-[14px] block truncate text-[12px] leading-none tracking-normal text-stone-300 md:text-[13px]">
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
