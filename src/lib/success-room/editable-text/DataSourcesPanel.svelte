<script lang="ts">
  import type { SuccessRoomEditableTextState } from '../domain/types';

  let {
    editableState = $bindable()
  }: {
    editableState: SuccessRoomEditableTextState;
  } = $props();

  const editableTextDataSourceFields = [
    'Add the first data source for this format',
    'Add a second data source, if needed',
    'Add a third data source, if needed',
    'Add a fourth data source, if needed',
    'Add a fifth data source, if needed'
  ] as const;

  const dataSourceInputClasses =
    'h-[42px] w-full rounded-[8px] border border-stone-200 bg-white px-[14px] font-body text-[14px] font-book tracking-normal text-stone-700 outline-none shadow-[0_1px_0_rgba(48,47,45,0.03)] placeholder:text-stone-400 focus:border-stone-300 focus:text-stone-900';

  const setDataSource = (index: number, value: string) => {
    const dataSourceCount = Math.max(
      editableState.dataSources.length,
      editableTextDataSourceFields.length
    );
    const dataSources = Array.from(
      { length: dataSourceCount },
      (_, dataSourceIndex) => editableState.dataSources[dataSourceIndex] ?? ''
    );
    dataSources[index] = value;

    editableState = {
      ...editableState,
      dataSources
    };
  };
</script>

<div class="grid gap-[12px]">
  {#each editableTextDataSourceFields as placeholder, index}
    <input
      class={dataSourceInputClasses}
      type="text"
      aria-label={placeholder}
      {placeholder}
      bind:value={
        () => editableState.dataSources[index] ?? '',
        (value) => setDataSource(index, value)
      }
    />
  {/each}
</div>
