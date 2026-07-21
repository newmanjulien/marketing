<script lang="ts">
  import { maxCustomBenefitLength } from '$shared/successRoomBenefits';
  import Checkbox from './Checkbox.svelte';
  import type { SuccessRoomBenefitCard } from '../domain/types';

  let {
    benefitCards,
    selectedBenefitKeys = $bindable([]),
    customBenefitInput = $bindable(''),
    customBenefitSelected = $bindable(false)
  }: {
    benefitCards: SuccessRoomBenefitCard[];
    selectedBenefitKeys: string[];
    customBenefitInput: string;
    customBenefitSelected: boolean;
  } = $props();

  const canSelectCustomBenefit = $derived(customBenefitInput.trim().length > 0);

  const cardClasses =
    'group flex h-[132px] flex-col rounded-[16px] border border-stone-200 bg-white px-[18px] py-[14px] text-stone-900 shadow-[0_1px_4px_rgba(28,25,23,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-stone-300 hover:shadow-[0_6px_14px_rgba(28,25,23,0.06)] focus-within:border-stone-300 sm:px-[20px] sm:py-[16px]';
  const checkedCardClasses = 'border-stone-300 bg-stone-50/60';
  const titleClasses =
    'min-w-0 text-[15px] font-normal leading-[1.2] text-stone-750 transition-colors duration-200 group-hover:text-stone-900 sm:text-[16px]';
  const checkboxClasses = 'mt-[1px] h-[15px] w-[15px] shrink-0 cursor-pointer';

  const setBenefitChecked = (benefitKey: string, checked: boolean) => {
    selectedBenefitKeys = checked
      ? [...selectedBenefitKeys, benefitKey]
      : selectedBenefitKeys.filter((key) => key !== benefitKey);
  };
</script>

<div class="grid gap-[18px]">
  <p class="text-[14px] font-book leading-[1.45] text-stone-700 sm:text-[15px]">
    Select the most important benefits you're hoping to get from our collaboration
  </p>

  <ul class="grid w-full gap-[14px] sm:grid-cols-2" aria-label="Benefits">
    {#each benefitCards as card (card.key)}
      {@const isChecked = selectedBenefitKeys.includes(card.key)}
      <li>
        <label class={[cardClasses, 'cursor-pointer', isChecked && checkedCardClasses]}>
          <span class="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-[14px]">
            <span class={titleClasses}>{card.title}</span>
            <Checkbox
              class={checkboxClasses}
              bind:checked={
                () => isChecked,
                (checked) => setBenefitChecked(card.key, checked)
              }
            />
          </span>

          <span class="mt-[10px] block max-w-[26rem] text-[13px] font-book leading-[1.4] text-stone-500 sm:text-[14px]">{card.description}</span>
        </label>
      </li>
    {/each}

    <li>
      <div class={[cardClasses, customBenefitSelected && checkedCardClasses]}>
        <span class="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-[14px]">
          <label class={titleClasses} for="custom-benefit-input">Another benefit</label>
          <Checkbox
            class={[checkboxClasses, 'disabled:cursor-not-allowed disabled:opacity-40']}
            disabled={!canSelectCustomBenefit}
            aria-label="Select another benefit"
            bind:checked={customBenefitSelected}
          />
        </span>

        <textarea
          id="custom-benefit-input"
          class="mt-[10px] block min-h-0 w-full flex-1 resize-none rounded-[10px] border border-stone-200 bg-white px-[10px] py-[7px] font-body text-[13px] font-book leading-[1.35] text-stone-800 outline-none transition-[background-color,border-color,color] duration-150 placeholder:text-stone-400 focus:border-stone-300 focus:bg-stone-50/70 focus:text-stone-900 sm:text-[14px]"
          aria-label="Another benefit"
          placeholder="Describe this benefit"
          rows="2"
          maxlength={maxCustomBenefitLength}
          spellcheck="true"
          bind:value={customBenefitInput}
        ></textarea>
      </div>
    </li>
  </ul>
</div>
