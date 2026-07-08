<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import PillTabs from '$lib/ui/PillTabs.svelte';
  import type { PillTab } from '$lib/ui/PillTabs.svelte';
  import SuccessRoomBenefitsPanel from './SuccessRoomBenefitsPanel.svelte';
  import SuccessRoomEditableTextPanel from './SuccessRoomEditableTextPanel.svelte';
  import SuccessRoomHeader from './SuccessRoomHeader.svelte';
  import SuccessRoomPlanPanel from './SuccessRoomPlanPanel.svelte';
  import { getSuccessRoomHref } from './successRooms';
  import type { SuccessRoom, SuccessRoomRoutedResource } from './successRoomTypes';

  type MutualSuccessPlanSection = PillTab & {
    description?: string;
  };

  type EditableTextSection = PillTab & {
    description: string;
  };

  const mutualSuccessPlanSections = [
    {
      key: 'benefits',
      label: 'Benefits',
      description:
        'Dummy description text that explains how these benefits connect to the shared proof of concept goals.'
    },
    {
      key: 'plan',
      label: 'Plan',
      description:
        'Dummy description text that introduces the timeline, responsibilities, and next steps for the mutual success plan.'
    }
  ] as const satisfies readonly MutualSuccessPlanSection[];

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

  const editableTextDataSourceFields = [
    'First data source for this format',
    'Second data source for this format (optional)',
    'Third data source for this format (optional)',
    'Fourth data source for this format (optional)',
    'Fifth data source for this format (optional)'
  ] as const;

  const panelContentClasses = 'grid gap-[22px]';
  const panelDescriptionClasses =
    'max-w-[42rem] text-[14px] font-book leading-[1.45] tracking-normal text-stone-500 sm:text-[15px]';
  const dataSourceInputClasses =
    'h-[42px] w-full rounded-[8px] border border-stone-200/70 bg-white px-[14px] font-body text-[14px] font-book tracking-normal text-stone-700 outline-none shadow-[0_1px_0_rgba(48,47,45,0.03)] placeholder:text-stone-400 focus:border-stone-300 focus:text-stone-900';

  let {
    room,
    resource
  }: {
    room: SuccessRoom;
    resource: SuccessRoomRoutedResource;
  } = $props();
</script>

<PageFrame>
  <ContentMeasure as="article" width="narrow">
    <SuccessRoomHeader
      backHref={getSuccessRoomHref(room)}
      backLabel="Success room"
      title={resource.title}
      description={resource.description}
    />

    {#if resource.kind === 'mutual-success-plan'}
      <PillTabs
        idBase={`success-room-${room.slug}-${resource.slug}`}
        tabs={mutualSuccessPlanSections}
        ariaLabel={`${resource.title} sections`}
        defaultActiveTabKey="benefits"
        listClass="mt-[34px]"
        panelClass="mt-[28px]"
      >
        {#snippet children(section)}
          <div class={panelContentClasses}>
            {#if section.description}
              <p class={panelDescriptionClasses}>{section.description}</p>
            {/if}

            {#if section.key === 'benefits'}
              <SuccessRoomBenefitsPanel />
            {:else if section.key === 'plan'}
              <SuccessRoomPlanPanel {resource} />
            {/if}
          </div>
        {/snippet}
      </PillTabs>
    {:else if resource.kind === 'editable-text'}
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
              <SuccessRoomEditableTextPanel {resource} />
            {:else if section.key === 'data-sources'}
              <div class="grid gap-[12px]">
                {#each editableTextDataSourceFields as placeholder}
                  <input
                    class={dataSourceInputClasses}
                    type="text"
                    aria-label={placeholder}
                    {placeholder}
                  />
                {/each}
              </div>
            {/if}
          </div>
        {/snippet}
      </PillTabs>
    {/if}
  </ContentMeasure>
</PageFrame>
