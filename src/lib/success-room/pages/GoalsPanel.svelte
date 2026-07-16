<script lang="ts">
  let {
    selectedBenefits,
    goalsByBenefitKey,
    onGoalChange
  }: {
    selectedBenefits: { key: string; label: string }[];
    goalsByBenefitKey: Record<string, string>;
    onGoalChange: (benefitKey: string, value: string) => void;
  } = $props();

  const promptListClasses = 'grid gap-[18px]';
  const descriptionClasses =
    'text-[14px] font-book leading-[1.45] tracking-normal text-stone-700 sm:text-[15px]';
  const benefitLabelClasses =
    'block text-[14px] font-normal leading-[1.3] tracking-normal text-stone-750 sm:text-[15px]';
  const textAreaClasses =
    'min-h-[108px] w-full resize-none rounded-[16px] border border-stone-200 bg-white px-[18px] py-[14px] text-[14px] font-book leading-[1.45] text-stone-800 outline-none transition-colors duration-150 placeholder:text-stone-400 focus:border-stone-300 focus:ring-2 focus:ring-stone-900/20 sm:min-h-[120px] sm:px-[20px] sm:py-[16px] sm:text-[15px]';
</script>

<div class={promptListClasses}>
  <p class={descriptionClasses}>
    For each benefit you selected, tell us the goals and how you measure them.
  </p>

  {#each selectedBenefits as benefit (benefit.key)}
    {@const prompt = `What KPIs do you currently use to track “${benefit.label}”? Are there existing projects to achieve this?`}
    <div class="grid gap-[8px]">
      <span class={benefitLabelClasses}>{benefit.label}</span>
      <textarea
        class={textAreaClasses}
        aria-label={prompt}
        placeholder={prompt}
        bind:value={
          () => goalsByBenefitKey[benefit.key] ?? '',
          (value) => onGoalChange(benefit.key, value)
        }
      ></textarea>
    </div>
  {/each}
</div>
