<script lang="ts">
  import PlanPanel from './PlanPanel.svelte';
  import type {
    SuccessRoom,
    SuccessRoomMutualSuccessPlanResource,
    SuccessRoomPlanState,
    SuccessRoomPlanUpdate
  } from '../domain/types';

  const panelContentClasses = 'grid gap-[22px]';
  const panelDescriptionClasses =
    'max-w-[42rem] text-[14px] font-book leading-[1.45] tracking-normal text-stone-500 sm:text-[15px]';

  let {
    room,
    resource,
    plan,
    onPlanChange
  }: {
    room: SuccessRoom;
    resource: SuccessRoomMutualSuccessPlanResource;
    plan: SuccessRoomPlanState;
    onPlanChange: (update: SuccessRoomPlanUpdate) => void;
  } = $props();
</script>

<div class={[panelContentClasses, 'mt-[34px]']}>
  <p class={panelDescriptionClasses}>
    Customize the step-by-step plan for starting to generate revenue together.
  </p>

  <PlanPanel
    {resource}
    team={room.team}
    planAccordions={resource.catalog.planAccordions}
    {plan}
    {onPlanChange}
  />
</div>
