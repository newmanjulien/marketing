<script lang="ts">
  import { FileIcon, PaperclipIcon, XIcon } from 'phosphor-svelte';
  import type {
    SuccessRoomEditableTextResource,
    SuccessRoomEditableTextState,
    SuccessRoomFileMetadata
  } from './successRoomTypes';

  let {
    roomSlug,
    resource,
    editableState,
    onStateChange
  }: {
    roomSlug: string;
    resource: SuccessRoomEditableTextResource;
    editableState: SuccessRoomEditableTextState;
    onStateChange: (state: SuccessRoomEditableTextState) => void;
  } = $props();

  let fileInput: HTMLInputElement | undefined = $state();

  const textareaClasses =
    'w-full resize-none border-0 bg-transparent font-body text-[14px] font-book leading-[1.65] tracking-normal text-stone-600 outline-none placeholder:text-stone-400 focus:text-stone-900';
  const footerClasses =
    'mt-[14px] flex flex-col gap-[11px] border-t border-stone-200/70 pt-[12px] sm:flex-row sm:items-center sm:justify-between';
  const attachmentButtonClasses =
    'inline-flex h-[32px] w-fit items-center gap-[7px] rounded-[8px] border border-stone-200/70 bg-white px-[10px] font-body text-[13px] font-book leading-none tracking-normal text-stone-600 shadow-[0_1px_0_rgba(48,47,45,0.03)] transition-colors duration-150 hover:border-stone-300 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-300 disabled:shadow-none disabled:hover:border-stone-200/70';
  const attachmentChipClasses =
    'grid w-full min-w-0 grid-cols-[18px_minmax(0,1fr)_24px] items-center gap-[9px] rounded-[8px] border border-stone-200/70 bg-stone-50 px-[10px] py-[8px] text-stone-500 sm:max-w-[280px]';
  const attachmentNameClasses =
    'block truncate text-[13px] font-normal leading-[1.2] tracking-normal text-stone-700';
  const attachmentRemoveButtonClasses =
    'flex h-[24px] w-[24px] items-center justify-center rounded-[6px] border-0 bg-transparent p-0 text-stone-400 transition-colors duration-150 hover:bg-stone-100 hover:text-stone-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20';

  const defaultEditorRows = 9;

  const setContent = (content: string) => {
    onStateChange({
      ...editableState,
      content
    });
  };

  const uploadAttachment = async (file: File) => {
    const uploadUrlResponse = await fetch(`/success-room/${roomSlug}/api/upload-url`, {
      method: 'POST'
    });

    if (!uploadUrlResponse.ok) {
      return;
    }

    const { uploadUrl } = await uploadUrlResponse.json();
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'content-type': file.type || 'application/octet-stream'
      },
      body: file
    });

    if (!uploadResponse.ok) {
      return;
    }

    const { storageId } = await uploadResponse.json();
    const attachmentResponse = await fetch(`/success-room/${roomSlug}/api/editable-attachment`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        resourceSlug: resource.slug,
        file: {
          storageId,
          filename: file.name,
          contentType: file.type || 'application/octet-stream',
          byteSize: file.size
        },
        state: editableState
      })
    });

    if (!attachmentResponse.ok) {
      return;
    }

    const { attachment }: { attachment: SuccessRoomFileMetadata } = await attachmentResponse.json();

    onStateChange({
      ...editableState,
      attachment
    });
  };

  const removeAttachment = async () => {
    await fetch(`/success-room/${roomSlug}/api/editable-attachment`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        resourceSlug: resource.slug
      })
    });

    onStateChange({
      content: editableState.content,
      dataSources: editableState.dataSources
    });
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
    value={editableState.content}
    placeholder="Write the editable text."
    spellcheck="true"
    oninput={(event) => setContent(event.currentTarget.value)}
  ></textarea>

  <div class={footerClasses}>
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
        <span class={attachmentNameClasses}>{editableState.attachment?.filename ?? 'Attachment'}</span>
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
  </div>
</section>
