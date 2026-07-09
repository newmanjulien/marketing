<script lang="ts">
  let {
    painPoints,
    onPainPointsChange
  }: {
    painPoints: string[];
    onPainPointsChange: (painPoints: string[]) => void;
  } = $props();

  const promptListClasses = 'grid gap-[18px]';
  const descriptionClasses =
    'max-w-[42rem] text-[14px] font-book leading-[1.45] tracking-normal text-stone-700 sm:text-[15px]';
  const textAreaClasses =
    'min-h-[108px] w-full resize-y rounded-[10px] border border-stone-200 bg-white px-[18px] py-[14px] text-[14px] font-book leading-[1.45] text-stone-800 outline-none transition-colors duration-150 placeholder:text-stone-400 focus:border-stone-300 focus:ring-2 focus:ring-stone-900/20 sm:min-h-[120px] sm:px-[20px] sm:py-[16px] sm:text-[15px]';
  const painPointPrompts = [
    'First pain point',
    'Second pain point',
    'Third pain point'
  ];

  const setPainPoint = (index: number, value: string) => {
    onPainPointsChange(
      painPoints.map((painPoint, painPointIndex) =>
        painPointIndex === index ? value : painPoint
      )
    );
  };
</script>

<div class={promptListClasses}>
  <p class={descriptionClasses}>
    What pain points are currently stopping you from getting the benefits you selected
  </p>

  {#each painPoints as painPoint, index}
    {@const painPointPrompt = painPointPrompts[index] ?? `Pain point ${index + 1}`}
    <textarea
      class={textAreaClasses}
      aria-label={painPointPrompt}
      placeholder={painPointPrompt}
      value={painPoint}
      oninput={(event) => setPainPoint(index, event.currentTarget.value)}
    ></textarea>
  {/each}
</div>
