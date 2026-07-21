<script lang="ts">
  import PillTabs from '$lib/ui/PillTabs.svelte';
  import type { PillTab } from '$lib/ui/PillTabs.svelte';
  import DataSourcesPanel from './DataSourcesPanel.svelte';
  import EditableTextPanel from './EditableTextPanel.svelte';
  import SuccessPanel from './SuccessPanel.svelte';
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
      key: 'success',
      label: 'Success',
      description:
        'What does success look like for this email format?'
    },
    {
      key: 'format',
      label: 'Format',
      description:
        'Review the sample email your team will receive'
    },
    {
      key: 'data-sources',
      label: 'Data sources',
      description:
        'What data do we need to test this format?'
    }
  ] as const satisfies readonly EditableTextSection[];

  const panelContentClasses = 'grid gap-[22px]';
  const panelDescriptionClasses =
    'text-[14px] font-book leading-[1.45] tracking-normal text-stone-700 sm:text-[15px]';

  let {
    room,
    resource,
    editableState = $bindable(),
    onAttachmentPersisted
  }: {
    room: SuccessRoomResourceRoom;
    resource: SuccessRoomEditableTextResource;
    editableState: SuccessRoomEditableTextState;
    onAttachmentPersisted: (update: SuccessRoomEditableTextAttachmentUpdate) => void;
  } = $props();
</script>

<PillTabs
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
      {:else if section.key === 'success'}
        <SuccessPanel
          bind:editableState
        />
      {/if}
    </div>
  {/snippet}
</PillTabs>
