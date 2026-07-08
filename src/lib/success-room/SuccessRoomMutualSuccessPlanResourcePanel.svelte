<script lang="ts">
  import PillTabs from '$lib/ui/PillTabs.svelte';
  import type { PillTab } from '$lib/ui/PillTabs.svelte';
  import SuccessRoomBenefitsPanel from './SuccessRoomBenefitsPanel.svelte';
  import SuccessRoomPlanPanel from './SuccessRoomPlanPanel.svelte';
  import type { SuccessRoom, SuccessRoomMutualSuccessPlanResource } from './successRoomTypes';

  type MutualSuccessPlanSection = PillTab & {
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

  const panelContentClasses = 'grid gap-[22px]';
  const panelDescriptionClasses =
    'max-w-[42rem] text-[14px] font-book leading-[1.45] tracking-normal text-stone-500 sm:text-[15px]';

  let {
    room,
    resource
  }: {
    room: SuccessRoom;
    resource: SuccessRoomMutualSuccessPlanResource;
  } = $props();
</script>

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
      <p class={panelDescriptionClasses}>{section.description}</p>

      {#if section.key === 'benefits'}
        <SuccessRoomBenefitsPanel />
      {:else if section.key === 'plan'}
        <SuccessRoomPlanPanel {resource} team={room.team} />
      {/if}
    </div>
  {/snippet}
</PillTabs>
