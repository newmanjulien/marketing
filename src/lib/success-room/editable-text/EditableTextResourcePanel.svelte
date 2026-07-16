<script lang="ts">
  import PillTabs from '$lib/ui/PillTabs.svelte';
  import type { PillTab } from '$lib/ui/PillTabs.svelte';
  import DataSourcesPanel from './DataSourcesPanel.svelte';
  import EditableTextPanel from './EditableTextPanel.svelte';
  import type {
    SuccessRoomEditableTextAttachmentUpdate,
    SuccessRoomEditableTextResource,
    SuccessRoomEditableTextState,
    SuccessRoomResourceRoom
  } from '../domain/types';

  type EditableTextSection = PillTab & {
    description: string;
  };

  const editableTextSections = [
    {
      key: 'format',
      label: 'Format',
      description:
        'Review the sample email your team will receive, with an optional attachment'
    },
    {
      key: 'data-sources',
      label: 'Data sources',
      description:
        'List the data sources we will need to connect for this initial email format'
    }
  ] as const satisfies readonly EditableTextSection[];

  const panelContentClasses = 'grid gap-[22px]';
  const panelDescriptionClasses =
    'text-[14px] font-book leading-[1.45] tracking-normal text-stone-700 sm:text-[15px]';

  let {
    room,
    resource,
    editableState = $bindable<SuccessRoomEditableTextState>(),
    onAttachmentPersisted
  }: {
    room: SuccessRoomResourceRoom;
    resource: SuccessRoomEditableTextResource;
    editableState: SuccessRoomEditableTextState;
    onAttachmentPersisted: (update: SuccessRoomEditableTextAttachmentUpdate) => void;
  } = $props();
</script>

<PillTabs
  idBase={`success-room-${room.slug}-${resource.slug}`}
  tabs={editableTextSections}
  ariaLabel={`${resource.title} sections`}
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
          bind:editableState
          {onAttachmentPersisted}
        />
      {:else if section.key === 'data-sources'}
        <DataSourcesPanel
          bind:editableState
        />
      {/if}
    </div>
  {/snippet}
</PillTabs>
