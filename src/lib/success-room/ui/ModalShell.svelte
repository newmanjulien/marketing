<script lang="ts">
  import { XIcon } from 'phosphor-svelte';
  import type { Snippet } from 'svelte';
  import { createModalBehavior } from './modalBehavior';

  type ModalShellProps = {
    open: boolean;
    title: string;
    onClose: () => void;
    class?: string;
    children: Snippet;
  };

  let {
    open,
    title,
    onClose,
    class: className,
    children
  }: ModalShellProps = $props();

  const titleId = $props.id();
  const modal = createModalBehavior({ onClose: () => onClose() });
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
    <button
      type="button"
      tabindex="-1"
      aria-label="Close modal"
      class="absolute inset-0 cursor-default border-0 bg-stone-100/40 p-0"
      onclick={onClose}
    ></button>

    <div
      use:modal
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabindex="-1"
      class={[
        'relative flex max-h-[calc(100vh-3rem)] w-full max-w-[440px] flex-col overflow-hidden rounded-[16px] border border-stone-200/80 bg-white text-stone-950 shadow-[0_12px_34px_rgba(68,64,60,0.14)] outline-none',
        className
      ]}
    >
      <button
        type="button"
        aria-label="Close modal"
        class="absolute right-4 top-4 flex h-[24px] w-[24px] items-center justify-center rounded-[6px] border-0 bg-transparent p-0 text-stone-400 transition-colors duration-150 hover:bg-stone-100 hover:text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20"
        onclick={onClose}
      >
        <XIcon size={15} weight="regular" aria-hidden="true" />
      </button>

      <header class="px-4 py-5">
        <h2 id={titleId} class="text-[14px] font-normal leading-tight tracking-normal text-stone-950">
          {title}
        </h2>
      </header>

      <div class="min-h-0 flex-1 overflow-y-auto px-6 pb-8">
        {@render children()}
      </div>
    </div>
  </div>
{/if}
