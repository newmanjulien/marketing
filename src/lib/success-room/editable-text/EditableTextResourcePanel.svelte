<script lang="ts">
  import PillTabs from '$lib/ui/PillTabs.svelte';
  import type { PillTab } from '$lib/ui/PillTabs.svelte';
  import DataSourcesPanel from './DataSourcesPanel.svelte';
  import EditableTextPanel from './EditableTextPanel.svelte';
  import type {
    SuccessRoom,
    SuccessRoomEditableTextResource,
    SuccessRoomEditableTextState
  } from '../domain/types';

  type EditableTextSection = PillTab & {
    description: string;
  };

  const editableTextSections = [
    {
      key: 'format',
      label: 'Format',
      description:
        'Dummy description text that explains how this format structures the first Overbase follow-up.'
    },
    {
      key: 'data-sources',
      label: 'Data sources',
      description:
        'Dummy description text that introduces the source fields this format can reference.'
    }
  ] as const satisfies readonly EditableTextSection[];

  const panelContentClasses = 'grid gap-[22px]';
  const panelDescriptionClasses =
    'max-w-[42rem] text-[14px] font-book leading-[1.45] tracking-normal text-stone-500 sm:text-[15px]';

  let {
    room,
    resource,
    state,
    onStateChange
  }: {
    room: SuccessRoom;
    resource: SuccessRoomEditableTextResource;
    state: SuccessRoomEditableTextState;
    onStateChange: (state: SuccessRoomEditableTextState) => void;
  } = $props();
</script>

<PillTabs
  idBase={`success-room-${room.slug}-${resource.slug}`}
  tabs={editableTextSections}
  ariaLabel={`${resource.title} sections`}
  defaultActiveTabKey="format"
  listClass="mt-[34px]"
  panelClass="mt-[28px]"
>
  {#snippet children(section)}
    <div class={panelContentClasses}>
      <p class={panelDescriptionClasses}>{section.description}</p>

      {#if section.key === 'format'}
        <EditableTextPanel
          roomSlug={room.slug}
          {resource}
          editableState={state}
          {onStateChange}
        />
      {:else if section.key === 'data-sources'}
        <DataSourcesPanel
          editableState={state}
          {onStateChange}
        />
      {/if}
    </div>
  {/snippet}
</PillTabs>
