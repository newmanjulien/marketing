<script lang="ts">
  import type { SuccessRoomEditableTextState } from '../domain/types';

  let {
    editableState,
    onStateChange
  }: {
    editableState: SuccessRoomEditableTextState;
    onStateChange: (state: SuccessRoomEditableTextState) => void;
  } = $props();

  const editableTextDataSourceFields = [
    'Add the first data source for this format',
    'Add a second data source, if needed',
    'Add a third data source, if needed',
    'Add a fourth data source, if needed',
    'Add a fifth data source, if needed'
  ] as const;

  const dataSourceInputClasses =
    'h-[42px] w-full rounded-[8px] border border-stone-200/70 bg-white px-[14px] font-body text-[14px] font-book tracking-normal text-stone-700 outline-none shadow-[0_1px_0_rgba(48,47,45,0.03)] placeholder:text-stone-400 focus:border-stone-300 focus:text-stone-900';

  const setDataSource = (index: number, value: string) => {
    const dataSources = [...editableState.dataSources];

    dataSources[index] = value;
    onStateChange({
      ...editableState,
      dataSources
    });
  };
</script>

<div class="grid gap-[12px]">
  {#each editableTextDataSourceFields as placeholder, index}
    <input
      class={dataSourceInputClasses}
      type="text"
      aria-label={placeholder}
      {placeholder}
      value={editableState.dataSources[index] ?? ''}
      oninput={(event) => setDataSource(index, event.currentTarget.value)}
    />
  {/each}
</div>
