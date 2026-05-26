<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { CaretDown } from 'phosphor-svelte';

  type DropdownAction = {
    id: string;
    label: string;
  };

  export let actions: DropdownAction[];
  export let selectedActionId: string;
  export let onSelect: (actionId: string) => void;

  let open = false;
  let rootElement: HTMLDivElement;
  let triggerElement: HTMLButtonElement;
  let menuElement: HTMLDivElement;
  let activeIndex = 0;

  $: selectedIndex = Math.max(
    0,
    actions.findIndex((action) => action.id === selectedActionId)
  );

  $: selectedAction = actions[selectedIndex] ?? actions[0];

  const activationKeys = new Set(['Enter', ' ']);

  async function focusActiveOption() {
    await tick();
    menuElement?.querySelector<HTMLButtonElement>(`#developer-action-option-${activeIndex}`)?.focus();
  }

  function openMenu(index = selectedIndex) {
    activeIndex = index;
    open = true;
    void focusActiveOption();
  }

  function closeMenu(restoreFocus = false) {
    open = false;

    if (restoreFocus) {
      triggerElement?.focus();
    }
  }

  function selectAction(actionId: string) {
    onSelect(actionId);
    closeMenu(true);
  }

  function handleTriggerKeydown(event: KeyboardEvent) {
    if (activationKeys.has(event.key)) {
      event.preventDefault();
      open ? closeMenu() : openMenu();
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        openMenu(selectedIndex);
        break;
      case 'ArrowUp':
        event.preventDefault();
        openMenu(Math.max(0, selectedIndex - 1));
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          closeMenu();
        }
        break;
    }
  }

  function handleOptionKeydown(event: KeyboardEvent) {
    if (activationKeys.has(event.key)) {
      event.preventDefault();
      selectAction(actions[activeIndex].id);
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        closeMenu(true);
        break;
      case 'ArrowDown':
        event.preventDefault();
        activeIndex = (activeIndex + 1) % actions.length;
        void focusActiveOption();
        break;
      case 'ArrowUp':
        event.preventDefault();
        activeIndex = (activeIndex - 1 + actions.length) % actions.length;
        void focusActiveOption();
        break;
    }
  }

  onMount(() => {
    function handleDocumentPointerDown(event: PointerEvent) {
      if (!rootElement?.contains(event.target as Node)) {
        closeMenu();
      }
    }

    document.addEventListener('pointerdown', handleDocumentPointerDown);

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
    };
  });
</script>

<div class="relative block w-full sm:w-[220px]" bind:this={rootElement}>
  <button
    bind:this={triggerElement}
    type="button"
    class="flex h-[35px] w-full items-center justify-between gap-[12px] rounded-[8px] border border-stone-200/70 bg-white px-[13px] text-left text-[14px] font-normal leading-none tracking-normal text-stone-800 shadow-[0_1px_0_rgba(48,47,45,0.03)] outline-none transition-colors hover:border-stone-300 focus:border-stone-300"
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls="developer-action-listbox"
    on:click={() => (open ? closeMenu() : openMenu())}
    on:keydown={handleTriggerKeydown}
  >
    <span class="min-w-0 truncate">{selectedAction.label}</span>
    <CaretDown
      class={`shrink-0 text-stone-500 transition-transform ${open ? 'rotate-180' : ''}`}
      size={14}
      weight="bold"
      aria-hidden="true"
    />
  </button>

  {#if open}
    <div
      bind:this={menuElement}
      id="developer-action-listbox"
      role="listbox"
      aria-activedescendant={`developer-action-option-${activeIndex}`}
      tabindex="-1"
      class="absolute bottom-[41px] right-0 z-20 w-full overflow-hidden rounded-[8px] border border-stone-200/70 bg-white p-[4px] shadow-[0_10px_30px_rgba(48,47,45,0.12)] outline-none"
    >
      {#each actions as action, index}
        <button
          id={`developer-action-option-${index}`}
          data-option-index={index}
          type="button"
          role="option"
          aria-selected={action.id === selectedActionId}
          class={`flex h-[32px] w-full items-center rounded-[6px] px-[9px] text-left text-[14px] font-normal leading-none tracking-normal transition-colors ${
            action.id === selectedActionId
              ? 'bg-stone-100 text-stone-800'
              : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
          }`}
          on:click={() => selectAction(action.id)}
          on:mouseenter={() => (activeIndex = index)}
          on:keydown={handleOptionKeydown}
        >
          <span class="min-w-0 truncate">{action.label}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>
