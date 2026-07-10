<script lang="ts">
  import { FileIcon, PaperclipIcon, XIcon } from 'phosphor-svelte';
  import {
    deleteEditableTextAttachment,
    uploadEditableTextAttachment
  } from './editableTextClient';
  import type { SuccessRoomEditableTextResourceSlug } from '../domain/config';
  import type { SuccessRoomEditableTextState } from '../domain/types';

  let {
    roomSlug,
    resourceSlug,
    editableState = $bindable<SuccessRoomEditableTextState>()
  }: {
    roomSlug: string;
    resourceSlug: SuccessRoomEditableTextResourceSlug;
    editableState: SuccessRoomEditableTextState;
  } = $props();

  let fileInput: HTMLInputElement | undefined = $state();

  const attachmentButtonClasses =
    'inline-flex h-[32px] w-fit items-center gap-[7px] rounded-[8px] border border-stone-200/70 bg-white px-[10px] font-body text-[13px] font-book leading-none tracking-normal text-stone-600 shadow-[0_1px_0_rgba(48,47,45,0.03)] transition-colors duration-150 hover:border-stone-300 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-300 disabled:shadow-none disabled:hover:border-stone-200/70';
  const attachmentChipClasses =
    'grid w-full min-w-0 grid-cols-[18px_minmax(0,1fr)_24px] items-center gap-[9px] rounded-[8px] border border-stone-200/70 bg-stone-50 px-[10px] py-[8px] text-stone-500 sm:max-w-[280px]';
  const attachmentNameClasses =
    'block truncate text-[13px] font-normal leading-[1.2] tracking-normal text-stone-700';
  const attachmentLinkClasses =
    `${attachmentNameClasses} transition-colors duration-150 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20`;
  const attachmentRemoveButtonClasses =
    'flex h-[24px] w-[24px] items-center justify-center rounded-[6px] border-0 bg-transparent p-0 text-stone-400 transition-colors duration-150 hover:bg-stone-100 hover:text-stone-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20';

  const uploadAttachment = async (file: File) => {
    const attachment = await uploadEditableTextAttachment({
      roomSlug,
      resourceSlug,
      file
    });

    if (!attachment) {
      return;
    }

    editableState = {
      ...editableState,
      attachment
    };
  };

  const removeAttachment = async () => {
    const removed = await deleteEditableTextAttachment({
      roomSlug,
      resourceSlug
    });

    if (!removed) {
      return;
    }

    editableState = {
      content: editableState.content,
      dataSources: editableState.dataSources
    };
  };
</script>

<button
  type="button"
  class={attachmentButtonClasses}
  disabled={Boolean(editableState.attachment)}
  onclick={() => fileInput?.click()}
>
  <PaperclipIcon size={15} weight="bold" aria-hidden="true" />
  <span>Add attachment</span>
</button>
<input
  bind:this={fileInput}
  class="sr-only"
  type="file"
  onchange={(event) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';

    if (file) {
      void uploadAttachment(file);
    }
  }}
/>

<div
  class={[attachmentChipClasses, !editableState.attachment && 'invisible pointer-events-none']}
  aria-label={editableState.attachment ? 'Attached file' : undefined}
  aria-hidden={!editableState.attachment}
>
  <FileIcon size={18} weight="regular" aria-hidden="true" />
  <span class="min-w-0">
    {#if editableState.attachment}
      <a
        class={attachmentLinkClasses}
        href={editableState.attachment.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {editableState.attachment.filename}
      </a>
    {:else}
      <span class={attachmentNameClasses}>Attachment</span>
    {/if}
  </span>
  {#if editableState.attachment}
    <button
      type="button"
      class={attachmentRemoveButtonClasses}
      aria-label={`Remove ${editableState.attachment.filename}`}
      onclick={() => void removeAttachment()}
    >
      <XIcon size={13} weight="bold" aria-hidden="true" />
    </button>
  {:else}
    <span class="h-[24px] w-[24px]" aria-hidden="true"></span>
  {/if}
</div>
