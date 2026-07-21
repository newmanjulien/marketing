<script lang="ts">
  import AttachmentControl from './AttachmentControl.svelte';
  import type {
    SuccessRoomEditableTextAttachmentUpdate,
    SuccessRoomEditableTextResource,
    SuccessRoomEditableTextState
  } from '../domain/types';

  let {
    roomSlug,
    resource,
    editableState = $bindable(),
    onAttachmentPersisted
  }: {
    roomSlug: string;
    resource: SuccessRoomEditableTextResource;
    editableState: SuccessRoomEditableTextState;
    onAttachmentPersisted: (update: SuccessRoomEditableTextAttachmentUpdate) => void;
  } = $props();

  const setContent = (content: string) => {
    editableState = {
      ...editableState,
      content
    };
  };
</script>

<section
  class="overflow-hidden rounded-[8px] border border-stone-200 bg-white px-[17px] py-[14px] shadow-[0_1px_0_rgba(48,47,45,0.03)] sm:px-[19px] sm:py-[16px]"
  aria-label={`${resource.title} editable text`}
>
  <textarea
    class="w-full resize-none border-0 bg-transparent font-body text-[14px] font-book leading-[1.65] tracking-normal text-stone-600 outline-none placeholder:text-stone-400 focus:text-stone-900"
    aria-label={resource.title}
    rows={resource.editorRows}
    bind:value={() => editableState.content, setContent}
    placeholder={resource.editorPlaceholder}
    spellcheck="true"
  ></textarea>

  <div class="mt-[14px] flex flex-col gap-[11px] border-t border-stone-200 pt-[12px] sm:flex-row sm:items-center sm:justify-between">
    {#key `${roomSlug}:${resource.slug}`}
      <AttachmentControl
        {roomSlug}
        resourceSlug={resource.slug}
        attachment={editableState.attachment}
        {onAttachmentPersisted}
      />
    {/key}
  </div>
</section>
