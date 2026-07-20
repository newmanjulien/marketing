<script lang="ts">
  import { CaretDownIcon } from 'phosphor-svelte';

  let {
    scenarios,
    selectedScenarioId,
    onSelect
  }: {
    scenarios: readonly { id: string; label: string }[];
    selectedScenarioId: string;
    onSelect: (id: string) => void;
  } = $props();

  let open = $state(false);
  let root = $state<HTMLDivElement>();

  const selectedLabel = $derived(
    scenarios.find((scenario) => scenario.id === selectedScenarioId)!.label
  );

  function select(id: string) {
    onSelect(id);
    open = false;
  }

  function handlePointerDown(event: PointerEvent) {
    if (open && root && !root.contains(event.target as Node)) {
      open = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (open && event.key === 'Escape') {
      open = false;
    }
  }
</script>

<svelte:window onpointerdown={handlePointerDown} onkeydown={handleKeydown} />

<div bind:this={root} class="relative">
  <button
    type="button"
    class="inline-flex h-[38px] w-full items-center justify-between gap-[10px] rounded-[9px] border border-stone-200/70 bg-white px-[10px] text-[17px] font-medium leading-none tracking-normal text-stone-750 shadow-[0_2px_8px_rgba(48,47,45,0.06)] transition-colors hover:bg-stone-50"
    aria-haspopup="listbox"
    aria-expanded={open}
    onclick={() => (open = !open)}
  >
    <span>{selectedLabel}</span>
    <CaretDownIcon
      size={14}
      weight="bold"
      class="text-stone-400 transition-transform {open ? 'rotate-180' : ''}"
    />
  </button>

  {#if open}
    <div
      role="listbox"
      class="absolute bottom-full left-0 z-10 mb-[8px] w-full overflow-hidden rounded-[9px] border border-stone-200/70 bg-white p-[4px] shadow-[0_8px_24px_rgba(48,47,45,0.12)]"
    >
      {#each scenarios as scenario (scenario.id)}
        <button
          type="button"
          role="option"
          aria-selected={scenario.id === selectedScenarioId}
          class={[
            'flex h-[34px] w-full items-center rounded-[6px] px-[10px] text-[16px] font-book leading-none tracking-normal transition-colors sm:text-[17px]',
            scenario.id === selectedScenarioId
              ? 'bg-stone-100 text-stone-750'
              : 'text-stone-600 hover:bg-stone-50'
          ]}
          onclick={() => select(scenario.id)}
        >
          {scenario.label}
        </button>
      {/each}
    </div>
  {/if}
</div>
