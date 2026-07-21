<script lang="ts">
  import { ImageIcon, PencilSimpleIcon, TrashIcon } from 'phosphor-svelte';

  let {
    value = $bindable(null),
    disabled = false
  }: {
    value: File | null;
    disabled?: boolean;
  } = $props();

  let fileInput: HTMLInputElement | undefined = $state();
  let pickerError = $state('');
  let previewUrl = $state('');

  const clearInput = () => {
    if (fileInput) {
      fileInput.value = '';
    }
  };

  $effect(() => {
    if (!value) {
      previewUrl = '';
      clearInput();
      return;
    }

    const objectUrl = URL.createObjectURL(value);
    previewUrl = objectUrl;

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  });

  const openFilePicker = () => fileInput?.click();
  const selectFile = (file: File | null) => {
    pickerError = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      pickerError = 'Choose an image file.';
      value = null;
      clearInput();
      return;
    }

    value = file;
  };

  const removeFile = () => {
    pickerError = '';
    value = null;
  };
</script>

<div class="grid gap-[7px] text-[13px] font-book leading-none text-stone-500">
  <span>Photo</span>

  <div class="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-[14px]">
    <button
      type="button"
      class="group relative flex aspect-square w-[88px] items-center justify-center overflow-hidden rounded-[8px] border border-stone-200 bg-stone-100 text-stone-400 transition-colors duration-150 hover:border-stone-300 hover:text-stone-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={value ? 'Replace team member photo' : 'Choose team member photo'}
      {disabled}
      onclick={openFilePicker}
    >
      {#if previewUrl}
        <img src={previewUrl} alt="" class="h-full w-full object-cover" />
        <span
          class="absolute inset-0 flex items-center justify-center bg-stone-950/0 text-white opacity-0 transition duration-150 group-hover:bg-stone-950/28 group-hover:opacity-100"
          aria-hidden="true"
        >
          <PencilSimpleIcon size={18} weight="bold" />
        </span>
      {:else}
        <ImageIcon size={24} weight="regular" aria-hidden="true" />
      {/if}
    </button>

    <div class="min-w-0">
      <div class="flex flex-wrap items-center gap-[8px]">
        <button
          type="button"
          class="inline-flex h-[34px] items-center gap-[7px] rounded-[8px] border border-stone-200 bg-white px-[11px] font-body text-[13px] font-book leading-none text-stone-600 transition-colors duration-150 hover:border-stone-300 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-300"
          {disabled}
          onclick={openFilePicker}
        >
          <ImageIcon size={15} weight="regular" aria-hidden="true" />
          <span>{value ? 'Replace' : 'Choose photo'}</span>
        </button>

        {#if value}
          <button
            type="button"
            class="inline-flex h-[34px] items-center gap-[7px] rounded-[8px] border border-transparent bg-transparent px-[9px] font-body text-[13px] font-book leading-none text-stone-400 transition-colors duration-150 hover:bg-stone-100 hover:text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20 disabled:cursor-not-allowed disabled:text-stone-300"
            {disabled}
            onclick={removeFile}
          >
            <TrashIcon size={14} weight="regular" aria-hidden="true" />
            <span>Remove</span>
          </button>
        {/if}
      </div>

      <p class="mt-[8px] truncate text-[12px] leading-[1.25] text-stone-400">
        {value ? value.name : 'Use a square headshot for the best fit.'}
      </p>
    </div>
  </div>

  <input
    bind:this={fileInput}
    class="sr-only"
    type="file"
    accept="image/*"
    {disabled}
    onchange={(event) => {
      selectFile(event.currentTarget.files?.[0] ?? null);
    }}
  />

  {#if pickerError}
    <p class="m-0 text-[12px] font-book leading-[1.3] text-red-700">
      {pickerError}
    </p>
  {/if}
</div>
