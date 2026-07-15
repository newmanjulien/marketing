<script lang="ts">
  let {
    selectedBenefits,
    painPointsByBenefitKey,
    onPainPointChange
  }: {
    selectedBenefits: { key: string; label: string }[];
    painPointsByBenefitKey: Record<string, string>;
    onPainPointChange: (benefitKey: string, value: string) => void;
  } = $props();

  const promptListClasses = 'grid gap-[18px]';
  const descriptionClasses =
    'max-w-[42rem] text-[14px] font-book leading-[1.45] tracking-normal text-stone-700 sm:text-[15px]';
  const benefitLabelClasses =
    'block text-[14px] font-normal leading-[1.3] tracking-normal text-stone-750 sm:text-[15px]';
  const textAreaClasses =
    'min-h-[108px] w-full resize-none rounded-[16px] border border-stone-200 bg-white px-[18px] py-[14px] text-[14px] font-book leading-[1.45] text-stone-800 outline-none transition-colors duration-150 placeholder:text-stone-400 focus:border-stone-300 focus:ring-2 focus:ring-stone-900/20 sm:min-h-[120px] sm:px-[20px] sm:py-[16px] sm:text-[15px]';
</script>

<div class={promptListClasses}>
  <p class={descriptionClasses}>
    For each benefit you selected, tell us the pain points and related metrics keeping you from it.
  </p>

  {#each selectedBenefits as benefit (benefit.key)}
    {@const prompt = `What's keeping you from “${benefit.label}”?`}
    <div class="grid gap-[8px]">
      <span class={benefitLabelClasses}>{benefit.label}</span>
      <textarea
        class={textAreaClasses}
        aria-label={prompt}
        placeholder={prompt}
        bind:value={
          () => painPointsByBenefitKey[benefit.key] ?? '',
          (value) => onPainPointChange(benefit.key, value)
        }
      ></textarea>
    </div>
  {/each}
</div>
