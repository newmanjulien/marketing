<script lang="ts">
  import type { SuccessRoomEditableTextState } from '../domain/types';

  let {
    editableState = $bindable()
  }: {
    editableState: SuccessRoomEditableTextState;
  } = $props();

  type SuccessFieldKey = keyof SuccessRoomEditableTextState['success'];

  const successQuestions = [
    {
      key: 'revenueGrowth',
      label: 'How will this email format grow revenue?',
      hint: 'What will happen after the email is received?'
    },
    {
      key: 'audience',
      label: 'Who will be receiving this email?',
      hint: "And what's unique about their perspective?"
    },
    {
      key: 'workflow',
      label: 'How does this fit into their existing workflow?',
      hint: "An existing process or task this person already does that we're accelerating"
    }
  ] as const satisfies readonly { key: SuccessFieldKey; label: string; hint: string }[];

  const setSuccessField = (key: SuccessFieldKey, value: string) => {
    editableState = {
      ...editableState,
      success: {
        ...editableState.success,
        [key]: value
      }
    };
  };
</script>

<div class="grid gap-[18px]">
  {#each successQuestions as question (question.key)}
    <div class="grid gap-[8px]">
      <span class="block text-[14px] font-normal leading-[1.3] tracking-normal text-stone-750 sm:text-[15px]">
        {question.label}
      </span>
      <textarea
        class="min-h-[108px] w-full resize-none rounded-[16px] border border-stone-200 bg-white px-[18px] py-[14px] text-[14px] font-book leading-[1.45] text-stone-800 outline-none transition-colors duration-150 placeholder:text-stone-400 focus:border-stone-300 focus:ring-2 focus:ring-stone-900/20 sm:min-h-[120px] sm:px-[20px] sm:py-[16px] sm:text-[15px]"
        aria-label={question.label}
        placeholder={question.hint}
        bind:value={
          () => editableState.success[question.key] ?? '',
          (value) => setSuccessField(question.key, value)
        }
      ></textarea>
    </div>
  {/each}
</div>
