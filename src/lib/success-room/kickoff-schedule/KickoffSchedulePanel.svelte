<script lang="ts">
  import { kickoffScheduleColumns as columns } from '../../../../shared/successRoomResources';
  import type { SuccessRoomKickoffScheduleState } from '../domain/types';

  let {
    schedule = $bindable()
  }: {
    schedule: SuccessRoomKickoffScheduleState;
  } = $props();

  const updateCell = (rowKey: string, columnKey: string, value: string) => {
    schedule = {
      rows: schedule.rows.map((row) =>
        row.key === rowKey
          ? {
              ...row,
              cells: {
                ...row.cells,
                [columnKey]: value
              }
            }
          : row
      )
    };
  };
</script>

<section aria-label="Kickoff schedule" class="mt-[34px]">
  <div class="overflow-hidden rounded-[8px] border border-stone-200 bg-white">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[560px] border-collapse">
        <thead>
          <tr>
            {#each columns as column}
              <th
                class="border-b border-stone-200/80 bg-stone-50 px-[14px] py-[13px] text-left text-[13px] font-medium leading-none tracking-normal text-stone-600"
                scope="col"
              >
                {column.label}
              </th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each schedule.rows as row, rowIndex}
            <tr>
              {#each columns as column}
                <td
                  class={[
                    'min-w-[144px] border-b border-r border-stone-100 align-top last:border-r-0',
                    rowIndex === schedule.rows.length - 1 && 'border-b-0'
                  ]}
                >
                  <textarea
                    class="block min-h-[72px] w-full resize-none border-0 bg-transparent px-[14px] py-[12px] font-body text-[14px] font-book leading-[1.45] tracking-normal text-stone-650 outline-none placeholder:text-stone-300 focus:bg-stone-50/70 focus:text-stone-900"
                    aria-label={`${column.label} row ${rowIndex + 1}`}
                    rows="3"
                    bind:value={
                      () => row.cells[column.key] ?? '',
                      (value) => updateCell(row.key, column.key, value)
                    }
                    spellcheck="true"
                  ></textarea>
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</section>
