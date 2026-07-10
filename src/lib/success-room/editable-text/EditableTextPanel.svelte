<script lang="ts">
  import AttachmentControl from './AttachmentControl.svelte';
  import type {
    SuccessRoomEditableTextResource,
    SuccessRoomEditableTextState
  } from '../domain/types';

  let {
    roomSlug,
    resource,
    editableState = $bindable<SuccessRoomEditableTextState>()
  }: {
    roomSlug: string;
    resource: SuccessRoomEditableTextResource;
    editableState: SuccessRoomEditableTextState;
  } = $props();

  const textareaClasses =
    'w-full resize-none border-0 bg-transparent font-body text-[14px] font-book leading-[1.65] tracking-normal text-stone-600 outline-none placeholder:text-stone-400 focus:text-stone-900';
  const footerClasses =
    'mt-[14px] flex flex-col gap-[11px] border-t border-stone-200/70 pt-[12px] sm:flex-row sm:items-center sm:justify-between';
  const defaultEditorRows = 9;

  const setContent = (content: string) => {
    editableState = {
      ...editableState,
      content
    };
  };
</script>

<section
  class="overflow-hidden rounded-[8px] border border-stone-200/70 bg-white px-[17px] py-[14px] shadow-[0_1px_0_rgba(48,47,45,0.03)] sm:px-[19px] sm:py-[16px]"
  aria-label={`${resource.title} editable text`}
>
  <textarea
    class={textareaClasses}
    aria-label={resource.title}
    rows={resource.editorRows ?? defaultEditorRows}
    bind:value={
      () => editableState.content,
      (content) => setContent(content)
    }
    placeholder="Write the initial email format"
    spellcheck="true"
  ></textarea>

  <div class={footerClasses}>
    <AttachmentControl
      {roomSlug}
      resourceSlug={resource.slug}
      bind:editableState
    />
  </div>
</section>
