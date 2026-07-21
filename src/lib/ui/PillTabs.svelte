<script module lang="ts">
  export type PillTab = {
    key: string;
    label: string;
  };
</script>

<script lang="ts" generics="Tab extends PillTab">
  import type { Snippet } from 'svelte';
  import { flip } from 'svelte/animate';
  import { cubicOut } from 'svelte/easing';
  import { prefersReducedMotion } from 'svelte/motion';

  let {
    tabs,
    ariaLabel,
    activeTabKey = $bindable(),
    animatedTabKeys = [],
    listClass,
    panelClass,
    children
  }: {
    tabs: readonly Tab[];
    ariaLabel: string;
    activeTabKey?: Tab['key'];
    animatedTabKeys?: readonly Tab['key'][];
    listClass?: string;
    panelClass?: string;
    children: Snippet<[Tab]>;
  } = $props();

  const idBase = $props.id();

  const activeTab = $derived(tabs.find(({ key }) => key === activeTabKey) ?? tabs[0]);

  const baseListClasses = 'flex flex-wrap items-center gap-[7px]';
  const tabClasses =
    'min-h-[34px] rounded-full border border-stone-200 bg-stone-100 px-[18px] text-[14px] font-medium leading-none text-stone-600 transition-colors duration-150 hover:bg-stone-50 hover:text-stone-800';
  const activeTabClasses = 'bg-white text-stone-800';

  const getTabId = (tabKey: Tab['key']) => `${idBase}-${tabKey}-tab`;
  const getPanelId = (tabKey: Tab['key']) => `${idBase}-${tabKey}-panel`;
  const getPillTabReflowDuration = () => (prefersReducedMotion.current ? 0 : 160);
  const pillTabTransition =
    (duration: number, offsetPx: number) => (_node: Element, tabKey: Tab['key']) => {
      if (!animatedTabKeys.includes(tabKey) || prefersReducedMotion.current) {
        return { duration: 0 };
      }

      return {
        duration,
        easing: cubicOut,
        css: (t: number) => `
          opacity: ${t};
          transform: translateY(${(1 - t) * offsetPx}px) scale(${0.985 + t * 0.015});
          transform-origin: center left;
        `
      };
    };
  const pillTabEntry = pillTabTransition(220, 4);
  const pillTabExit = pillTabTransition(160, 2);
  const focusTab = (tabKey: Tab['key']) => {
    document.getElementById(getTabId(tabKey))?.focus();
  };
  const selectTab = (tabKey: Tab['key']) => {
    activeTabKey = tabKey;
  };
  const selectTabAt = (index: number) => {
    const tab = tabs[index];

    if (tab) {
      selectTab(tab.key);
      focusTab(tab.key);
    }
  };
  // Navigates from the tab the event fired on, not from `activeTab`: the bound
  // `activeTabKey` can update asynchronously (e.g. via a `goto` setter), so
  // `activeTab` may still point at the previous tab while focus has moved.
  const handleTabKeydown = (event: KeyboardEvent, currentIndex: number) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        selectTabAt(currentIndex <= 0 ? tabs.length - 1 : currentIndex - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        selectTabAt(currentIndex === tabs.length - 1 ? 0 : currentIndex + 1);
        break;
      case 'Home':
        event.preventDefault();
        selectTabAt(0);
        break;
      case 'End':
        event.preventDefault();
        selectTabAt(tabs.length - 1);
        break;
    }
  };
</script>

{#if activeTab}
  <div class={[baseListClasses, listClass]} role="tablist" aria-label={ariaLabel}>
    {#each tabs as tab, index (tab.key)}
      {@const isActive = activeTab.key === tab.key}
      <span
        class="inline-flex"
        animate:flip={{ duration: getPillTabReflowDuration, easing: cubicOut }}
      >
        <button
          id={getTabId(tab.key)}
          type="button"
          role="tab"
          aria-selected={isActive}
          aria-controls={isActive ? getPanelId(tab.key) : undefined}
          tabindex={isActive ? 0 : -1}
          class={[tabClasses, isActive && activeTabClasses]}
          in:pillTabEntry={tab.key}
          out:pillTabExit={tab.key}
          onclick={() => selectTab(tab.key)}
          onkeydown={(event) => handleTabKeydown(event, index)}
        >
          {tab.label}
        </button>
      </span>
    {/each}
  </div>

  {#key activeTab.key}
    <div
      id={getPanelId(activeTab.key)}
      class={panelClass}
      role="tabpanel"
      aria-labelledby={getTabId(activeTab.key)}
    >
      {@render children(activeTab)}
    </div>
  {/key}
{/if}
