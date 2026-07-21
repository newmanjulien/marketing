<script lang="ts">
  import PillTabs from '$lib/ui/PillTabs.svelte';
  import type { PillTab } from '$lib/ui/PillTabs.svelte';
  import AttachmentControl from './AttachmentControl.svelte';
  import type {
    SuccessRoomEditableTextAttachmentUpdate,
    SuccessRoomEditableTextResource,
    SuccessRoomEditableTextState,
    SuccessRoomResourceRoom
  } from '../domain/types';

  type EditableTextSection = PillTab & {
    description: string;
  };

  const editableTextSections = [
    {
      key: 'success',
      label: 'Success',
      description:
        'What does success look like for this email format?'
    },
    {
      key: 'format',
      label: 'Format',
      description:
        'Review the sample email your team will receive'
    },
    {
      key: 'data-sources',
      label: 'Data sources',
      description:
        'What data do we need to test this format?'
    }
  ] as const satisfies readonly EditableTextSection[];

  const panelContentClasses = 'grid gap-[22px]';
  const panelDescriptionClasses =
    'text-[14px] font-book leading-[1.45] tracking-normal text-stone-700 sm:text-[15px]';

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
      label: 'How does this fit into their current workflow?',
      hint: "A process or task this person already does that we're accelerating"
    }
  ] as const satisfies readonly { key: SuccessFieldKey; label: string; hint: string }[];

  const editableTextDataSourceFields = [
    'Add the first data source for this format',
    'Add a second data source, if needed',
    'Add a third data source, if needed',
    'Add a fourth data source, if needed',
    'Add a fifth data source, if needed'
  ] as const;

  const dataSourceInputClasses =
    'h-[42px] w-full rounded-[8px] border border-stone-200 bg-white px-[14px] font-body text-[14px] font-book tracking-normal text-stone-700 outline-none shadow-[0_1px_0_rgba(48,47,45,0.03)] placeholder:text-stone-400 focus:border-stone-300 focus:text-stone-900';

  let {
    room,
    resource,
    editableState = $bindable(),
    onAttachmentPersisted
  }: {
    room: SuccessRoomResourceRoom;
    resource: SuccessRoomEditableTextResource;
    editableState: SuccessRoomEditableTextState;
    onAttachmentPersisted: (update: SuccessRoomEditableTextAttachmentUpdate) => void;
  } = $props();

  const setSuccessField = (key: SuccessFieldKey, value: string) => {
    editableState = {
      ...editableState,
      success: {
        ...editableState.success,
        [key]: value
      }
    };
  };

  const setDataSource = (index: number, value: string) => {
    editableState = {
      ...editableState,
      dataSources: editableTextDataSourceFields.map((_, fieldIndex) =>
        fieldIndex === index ? value : (editableState.dataSources[fieldIndex] ?? '')
      )
    };
  };
</script>

<PillTabs
  tabs={editableTextSections}
  ariaLabel={`${resource.title} sections`}
  listClass="mt-[34px]"
  panelClass="mt-[28px]"
>
  {#snippet children(section)}
    <div class={panelContentClasses}>
      <p class={panelDescriptionClasses}>{section.description}</p>

      {#if section.key === 'format'}
        <section
          class="overflow-hidden rounded-[8px] border border-stone-200 bg-white px-[17px] py-[14px] shadow-[0_1px_0_rgba(48,47,45,0.03)] sm:px-[19px] sm:py-[16px]"
          aria-label={`${resource.title} editable text`}
        >
          <textarea
            class="w-full resize-none border-0 bg-transparent font-body text-[14px] font-book leading-[1.65] tracking-normal text-stone-600 outline-none placeholder:text-stone-400 focus:text-stone-900"
            aria-label={resource.title}
            rows={resource.editorRows}
            bind:value={
              () => editableState.content,
              (content) => (editableState = { ...editableState, content })
            }
            placeholder={resource.editorPlaceholder}
            spellcheck="true"
          ></textarea>

          <div class="mt-[14px] flex flex-col gap-[11px] border-t border-stone-200 pt-[12px] sm:flex-row sm:items-center sm:justify-between">
            {#key `${room.slug}:${resource.slug}`}
              <AttachmentControl
                roomSlug={room.slug}
                resourceSlug={resource.slug}
                attachment={editableState.attachment}
                {onAttachmentPersisted}
              />
            {/key}
          </div>
        </section>
      {:else if section.key === 'data-sources'}
        <div class="grid gap-[12px]">
          {#each editableTextDataSourceFields as placeholder, index}
            <input
              class={dataSourceInputClasses}
              type="text"
              aria-label={placeholder}
              {placeholder}
              bind:value={
                () => editableState.dataSources[index] ?? '',
                (value) => setDataSource(index, value)
              }
            />
          {/each}
        </div>
      {:else if section.key === 'success'}
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
                  () => editableState.success[question.key],
                  (value) => setSuccessField(question.key, value)
                }
              ></textarea>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/snippet}
</PillTabs>
