<script lang="ts">
  import SuccessRoomCheckbox from './SuccessRoomCheckbox.svelte';
  import { mutualSuccessBenefitCards } from './successRoomMutualSuccessPlan';

  let checkedBenefitIds = $state(new Set<string>());
  let benefitPainPoints = $state<Record<string, string>>({});

  const cardClasses =
    'group flex h-[132px] cursor-pointer flex-col rounded-[10px] border border-stone-200/70 bg-white px-[18px] py-[14px] text-stone-900 shadow-[0_1px_4px_rgba(28,25,23,0.06)] transition-colors duration-200 hover:border-stone-300 focus-within:border-stone-300 focus-within:ring-2 focus-within:ring-stone-900/20 sm:px-[20px] sm:py-[16px]';
  const checkedCardClasses = 'border-stone-300 bg-stone-50/60';
  const titleClasses =
    'min-w-0 text-[15px] font-normal leading-[1.2] tracking-normal text-stone-750 transition-colors duration-200 group-hover:text-stone-900 sm:text-[16px]';
  const checkboxClasses =
    'mt-[1px] h-[13px] w-[13px] shrink-0 cursor-pointer';
  const descriptionClasses =
    'mt-[10px] block max-w-[26rem] text-[13px] font-book leading-[1.4] tracking-normal text-stone-500 sm:text-[14px]';
  const painPointInputClasses =
    'mt-[10px] block min-h-0 flex-1 resize-none rounded-[8px] border border-stone-200 bg-white px-[11px] py-[9px] text-[13px] font-book leading-[1.4] tracking-normal text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none sm:text-[14px]';
  const painPointPlaceholder =
    "What's the main pain point currently blocking this benefit?";

  const setBenefitChecked = (benefitId: string, checked: boolean) => {
    const nextCheckedBenefitIds = new Set(checkedBenefitIds);

    if (checked) {
      nextCheckedBenefitIds.add(benefitId);
    } else {
      nextCheckedBenefitIds.delete(benefitId);
    }

    checkedBenefitIds = nextCheckedBenefitIds;
  };

  const setBenefitPainPoint = (benefitId: string, painPoint: string) => {
    benefitPainPoints = {
      ...benefitPainPoints,
      [benefitId]: painPoint
    };
  };
</script>

<ul class="grid w-full gap-[14px] sm:grid-cols-2" aria-label="Benefits">
  {#each mutualSuccessBenefitCards as card (card.id)}
    {@const isChecked = checkedBenefitIds.has(card.id)}
    <li>
      <label class={[cardClasses, isChecked && checkedCardClasses]}>
        <span class="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-[14px]">
          <span class={titleClasses}>{card.title}</span>
          <SuccessRoomCheckbox
            id={`benefit-${card.id}`}
            class={checkboxClasses}
            checked={isChecked}
            onCheckedChange={(checked) => setBenefitChecked(card.id, checked)}
          />
        </span>

        {#if isChecked}
          <textarea
            class={painPointInputClasses}
            aria-label={`${card.title} pain point`}
            placeholder={painPointPlaceholder}
            value={benefitPainPoints[card.id] ?? ''}
            onclick={(event) => event.stopPropagation()}
            oninput={(event) => setBenefitPainPoint(card.id, event.currentTarget.value)}
          ></textarea>
        {:else}
          <span class={descriptionClasses}>{card.description}</span>
        {/if}
      </label>
    </li>
  {/each}
</ul>
