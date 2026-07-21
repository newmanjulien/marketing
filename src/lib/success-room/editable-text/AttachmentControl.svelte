<script lang="ts">
  import { FileIcon, PaperclipIcon, XIcon } from 'phosphor-svelte';
  import {
    deleteEditableTextAttachment,
    uploadEditableTextAttachment
  } from './editableTextClient';
  import type { SuccessRoomEditableTextResourceSlug } from '../domain/resourceSlugs';
  import type {
    SuccessRoomEditableTextAttachmentUpdate,
    SuccessRoomLinkedFileMetadata
  } from '../domain/types';

  type AttachmentOperation = 'uploading' | 'removing';

  let {
    roomSlug,
    resourceSlug,
    attachment,
    onAttachmentPersisted
  }: {
    roomSlug: string;
    resourceSlug: SuccessRoomEditableTextResourceSlug;
    attachment?: SuccessRoomLinkedFileMetadata;
    onAttachmentPersisted: (update: SuccessRoomEditableTextAttachmentUpdate) => void;
  } = $props();

  let fileInput: HTMLInputElement | undefined = $state();
  let pendingOperation = $state<AttachmentOperation | null>(null);
  let attachmentError = $state('');

  const attachmentButtonClasses =
    'inline-flex h-[32px] w-fit items-center gap-[7px] rounded-[8px] border border-stone-200 bg-white px-[10px] font-body text-[13px] font-book leading-none tracking-normal text-stone-600 shadow-[0_1px_0_rgba(48,47,45,0.03)] transition-colors duration-150 hover:border-stone-300 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-300 disabled:shadow-none disabled:hover:border-stone-200';
  const attachmentChipClasses =
    'grid w-full min-w-0 grid-cols-[18px_minmax(0,1fr)_24px] items-center gap-[9px] rounded-[8px] border border-stone-200 bg-stone-50 px-[10px] py-[8px] text-stone-500 sm:max-w-[280px]';
  const attachmentNameClasses =
    'block truncate text-[13px] font-normal leading-[1.2] tracking-normal text-stone-700';
  const attachmentLinkClasses =
    `${attachmentNameClasses} transition-colors duration-150 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20`;
  const attachmentRemoveButtonClasses =
    'flex h-[24px] w-[24px] items-center justify-center rounded-[6px] border-0 bg-transparent p-0 text-stone-400 transition-colors duration-150 hover:bg-stone-100 hover:text-stone-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20 disabled:cursor-not-allowed disabled:text-stone-300 disabled:hover:bg-transparent disabled:hover:text-stone-300';

  const runAttachmentOperation = async (
    operation: AttachmentOperation,
    fallbackErrorMessage: string,
    perform: () => Promise<void>
  ) => {
    if (pendingOperation) {
      return;
    }

    pendingOperation = operation;
    attachmentError = '';

    try {
      await perform();
    } catch (error) {
      attachmentError = error instanceof Error ? error.message : fallbackErrorMessage;
    } finally {
      pendingOperation = null;
    }
  };

  const uploadAttachment = (file: File) =>
    runAttachmentOperation('uploading', 'Could not upload this attachment.', async () => {
      const uploadedAttachment = await uploadEditableTextAttachment({
        roomSlug,
        file
      });

      onAttachmentPersisted({
        roomSlug,
        resourceSlug,
        attachment: uploadedAttachment
      });
    });

  const removeAttachment = () =>
    runAttachmentOperation('removing', 'Could not remove this attachment.', async () => {
      await deleteEditableTextAttachment({ roomSlug });
      onAttachmentPersisted({ roomSlug, resourceSlug });
    });
</script>

<div class="grid gap-[8px]">
  <button
    type="button"
    class={attachmentButtonClasses}
    disabled={Boolean(attachment) || pendingOperation !== null}
    onclick={() => fileInput?.click()}
  >
    <PaperclipIcon size={15} weight="bold" aria-hidden="true" />
    <span>{pendingOperation === 'uploading' ? 'Uploading...' : 'Add attachment'}</span>
  </button>
  <input
    bind:this={fileInput}
    class="sr-only"
    type="file"
    disabled={pendingOperation !== null}
    onchange={(event) => {
      const file = event.currentTarget.files?.[0];
      event.currentTarget.value = '';

      if (file) {
        void uploadAttachment(file);
      }
    }}
  />

  {#if attachmentError}
    <p
      class="m-0 text-[13px] font-book leading-[1.35] tracking-normal text-red-700"
      aria-live="polite"
    >
      {attachmentError}
    </p>
  {/if}
</div>

{#if attachment}
  <div class={attachmentChipClasses} aria-label="Attached file">
    <FileIcon size={18} weight="regular" aria-hidden="true" />
    <span class="min-w-0">
      <a
        class={attachmentLinkClasses}
        href={attachment.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {attachment.filename}
      </a>
    </span>
    <button
      type="button"
      class={attachmentRemoveButtonClasses}
      aria-label={`${pendingOperation === 'removing' ? 'Removing' : 'Remove'} ${attachment.filename}`}
      disabled={pendingOperation !== null}
      onclick={() => void removeAttachment()}
    >
      <XIcon size={13} weight="bold" aria-hidden="true" />
    </button>
  </div>
{/if}
