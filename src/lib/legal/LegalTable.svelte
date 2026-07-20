<script lang="ts">
  import type { LegalTableColumn, LegalTableRow } from './legalTypes';

  let {
    columns,
    rows
  }: {
    columns: readonly LegalTableColumn[];
    rows: readonly LegalTableRow[];
  } = $props();
</script>

<div class="mt-[20px] overflow-x-auto">
  <table class="w-full min-w-[620px] border-collapse border border-stone-200 text-[15px] leading-[1.5]">
    <thead>
      <tr>
        {#each columns as column (column.key)}
          <th class="border border-stone-200 bg-stone-50 px-[16px] py-[14px] text-left align-top font-medium text-stone-800" scope="col">{column.label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          {#each columns as column, index (column.key)}
            {@const cell = row[column.key] ?? ''}
            {#if index === 0}
              <th class="w-[34%] border border-stone-200 px-[16px] py-[14px] text-left align-top font-medium text-stone-700" scope="row">{cell}</th>
            {:else}
              <td class="border border-stone-200 px-[16px] py-[14px] text-left align-top">
                {#if Array.isArray(cell)}
                  <ul class="mt-0 list-disc pl-[18px] [&_li]:mt-[8px] [&_li]:pl-[4px] [&_li:first-child]:mt-0">
                    {#each cell as item}
                      <li>{item}</li>
                    {/each}
                  </ul>
                {:else}
                  {cell}
                {/if}
              </td>
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
