<script lang="ts">
  import type { SuccessRoomQuestion } from '../domain/types';

  let {
    questions,
    questionAnswers,
    onQuestionAnswersChange
  }: {
    questions: SuccessRoomQuestion[];
    questionAnswers: Record<string, string>;
    onQuestionAnswersChange: (questionAnswers: Record<string, string>) => void;
  } = $props();

  const promptListClasses = 'grid gap-[18px]';
  const promptClasses = 'grid gap-[10px]';
  const questionClasses =
    'max-w-[42rem] text-[14px] font-book leading-[1.45] tracking-normal text-stone-700 sm:text-[15px]';
  const textAreaClasses =
    'min-h-[132px] w-full resize-y rounded-[10px] border border-stone-200 bg-white px-[18px] py-[14px] text-[14px] font-book leading-[1.45] text-stone-800 outline-none transition-colors duration-150 placeholder:text-stone-400 focus:border-stone-300 focus:ring-2 focus:ring-stone-900/20 sm:min-h-[148px] sm:px-[20px] sm:py-[16px] sm:text-[15px]';
  const answerPlaceholder = 'Add your answer here.';

  const setQuestionAnswer = (questionId: string, value: string) => {
    onQuestionAnswersChange({
      ...questionAnswers,
      [questionId]: value
    });
  };
</script>

<div class={promptListClasses}>
  {#each questions as question (question.id)}
    <label class={promptClasses}>
      <span class={questionClasses}>{question.question}</span>
      <textarea
        class={textAreaClasses}
        aria-label={question.question}
        placeholder={answerPlaceholder}
        value={questionAnswers[question.id] ?? ''}
        oninput={(event) => setQuestionAnswer(question.id, event.currentTarget.value)}
      ></textarea>
    </label>
  {/each}
</div>
