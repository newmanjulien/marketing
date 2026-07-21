<script lang="ts" generics="Id extends string">
  import { CaretDownIcon } from 'phosphor-svelte';

  type Option = { id: Id; label: string };

  let {
    options,
    selected,
    onSelect,
    placement = 'up'
  }: {
    options: readonly Option[];
    selected: Option;
    onSelect: (id: Id) => void;
    placement?: 'up' | 'down';
  } = $props();

  let open = $state(false);
  let root = $state<HTMLDivElement>();

  function handlePointerDown(event: PointerEvent) {
    if (open && !root?.contains(event.target as Node)) {
      open = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (open && event.key === 'Escape') {
      open = false;
    }
  }
</script>

{#snippet truncatedLabel(label: string)}
  <!-- leading-none = em-box centering (the site-wide pattern); the truncate
       clip would shear ascender/descender ink, so give it symmetric bleed. -->
  <span class="truncate py-[0.25em] leading-none">{label}</span>
{/snippet}

<svelte:window onpointerdown={handlePointerDown} onkeydown={handleKeydown} />

<div bind:this={root} class="relative">
  <button
    type="button"
    class="inline-flex h-[40px] w-full items-center justify-between gap-[10px] rounded-[9px] border border-stone-200 bg-white px-[12px] text-[17px] font-medium leading-none text-stone-750 shadow-[0_2px_8px_rgba(48,47,45,0.06)] transition-colors hover:bg-stone-50"
    aria-haspopup="listbox"
    aria-expanded={open}
    onclick={() => (open = !open)}
  >
    {@render truncatedLabel(selected.label)}
    <CaretDownIcon
      size={13}
      weight="bold"
      class={['shrink-0 text-stone-400 transition-transform', open && 'rotate-180']}
    />
  </button>

  {#if open}
    <div
      role="listbox"
      class={[
        'absolute left-0 z-20 w-full overflow-hidden rounded-[9px] border border-stone-200 bg-white p-[4px] shadow-[0_8px_24px_rgba(48,47,45,0.12)]',
        placement === 'up' ? 'bottom-full mb-[8px]' : 'top-full mt-[8px]'
      ]}
    >
      {#each options as option (option.id)}
        {@const isSelected = option.id === selected.id}
        <button
          type="button"
          role="option"
          aria-selected={isSelected}
          class={[
            'flex h-[36px] w-full items-center rounded-[6px] px-[12px] text-[16px] font-book leading-none transition-colors sm:text-[17px]',
            isSelected ? 'bg-stone-100/80 text-stone-750' : 'text-stone-600 hover:bg-stone-50'
          ]}
          onclick={() => {
            onSelect(option.id);
            open = false;
          }}
        >
          {@render truncatedLabel(option.label)}
        </button>
      {/each}
    </div>
  {/if}
</div>
