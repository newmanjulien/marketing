<script lang="ts">
  let {
    questions,
    onQuestionsChange
  }: {
    questions: Record<string, string>;
    onQuestionsChange: (questions: Record<string, string>) => void;
  } = $props();

  const questionPrompts = [
    {
      id: 'open-questions',
      description:
        'Dummy description text for the first question area, focused on open items that need clarification.',
      ariaLabel: 'Open questions',
      placeholder: 'Dummy placeholder text for open questions.'
    },
    {
      id: 'follow-up-questions',
      description:
        'Dummy description text for the second question area, focused on follow-up items and next conversations.',
      ariaLabel: 'Follow-up questions',
      placeholder: 'Dummy placeholder text for follow-up questions.'
    }
  ] as const;

  const promptListClasses = 'grid gap-[18px]';
  const promptClasses = 'grid gap-[10px]';
  const descriptionClasses =
    'max-w-[42rem] text-[14px] font-book leading-[1.45] tracking-normal text-stone-700 sm:text-[15px]';
  const textAreaClasses =
    'min-h-[132px] w-full resize-y rounded-[10px] border border-stone-200 bg-white px-[18px] py-[14px] text-[14px] font-book leading-[1.45] text-stone-800 outline-none transition-colors duration-150 placeholder:text-stone-400 focus:border-stone-300 focus:ring-2 focus:ring-stone-900/20 sm:min-h-[148px] sm:px-[20px] sm:py-[16px] sm:text-[15px]';

  const setQuestion = (promptId: string, value: string) => {
    onQuestionsChange({
      ...questions,
      [promptId]: value
    });
  };
</script>

<div class={promptListClasses}>
  {#each questionPrompts as prompt (prompt.id)}
    <label class={promptClasses}>
      <span class={descriptionClasses}>{prompt.description}</span>
      <textarea
        class={textAreaClasses}
        aria-label={prompt.ariaLabel}
        placeholder={prompt.placeholder}
        value={questions[prompt.id] ?? ''}
        oninput={(event) => setQuestion(prompt.id, event.currentTarget.value)}
      ></textarea>
    </label>
  {/each}
</div>
