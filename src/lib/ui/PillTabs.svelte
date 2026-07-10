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

  let {
    idBase,
    tabs,
    ariaLabel,
    defaultActiveTabKey,
    activeTabKey: controlledActiveTabKey,
    onActiveTabKeyChange,
    animatedTabKeys = [],
    listClass,
    panelClass,
    children
  }: {
    idBase: string;
    tabs: readonly Tab[];
    ariaLabel: string;
    defaultActiveTabKey?: string;
    activeTabKey?: string;
    onActiveTabKeyChange?: (tabKey: string) => void;
    animatedTabKeys?: readonly string[];
    listClass?: string;
    panelClass?: string;
    children: Snippet<[Tab]>;
  } = $props();

  let selectedTabKey = $state<string | undefined>();
  const getFallbackTab = () =>
    tabs.find(({ key }) => key === defaultActiveTabKey) ?? tabs[0];
  const resolveTab = (tabKey: string | undefined) =>
    tabs.find(({ key }) => key === tabKey) ?? getFallbackTab();

  let activeTab = $derived(resolveTab(controlledActiveTabKey ?? selectedTabKey));
  let activeTabKey = $derived(activeTab?.key);

  $effect(() => {
    if (controlledActiveTabKey !== undefined) {
      return;
    }

    const resolvedTabKey = resolveTab(selectedTabKey)?.key;

    if (selectedTabKey !== resolvedTabKey) {
      selectedTabKey = resolvedTabKey;
    }
  });

  const baseListClasses = 'flex flex-wrap items-center gap-[7px]';
  const tabClasses =
    'min-h-[34px] rounded-full border border-stone-200/70 bg-stone-100 px-[18px] text-[14px] font-medium leading-none text-stone-600 transition-colors duration-150 hover:border-stone-200/70 hover:bg-stone-50 hover:text-stone-800';
  const activeTabClasses = 'border-stone-200/70 bg-white text-stone-800';

  const getTabId = (tabKey: string) => `${idBase}-${tabKey}-tab`;
  const getPanelId = (tabKey: string) => `${idBase}-${tabKey}-panel`;
  const prefersReducedMotion = () =>
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const getPillTabReflowDuration = () => (prefersReducedMotion() ? 0 : 160);
  const pillTabEntry = (_node: Element, tabKey: string) => {
    if (!animatedTabKeys.includes(tabKey)) {
      return { duration: 0 };
    }

    if (prefersReducedMotion()) {
      return { duration: 0 };
    }

    return {
      duration: 220,
      easing: cubicOut,
      css: (t: number) => `
        opacity: ${t};
        transform: translateY(${(1 - t) * 4}px) scale(${0.985 + t * 0.015});
        transform-origin: center left;
      `
    };
  };
  const pillTabExit = (_node: Element, tabKey: string) => {
    if (!animatedTabKeys.includes(tabKey)) {
      return { duration: 0 };
    }

    if (prefersReducedMotion()) {
      return { duration: 0 };
    }

    return {
      duration: 160,
      easing: cubicOut,
      css: (t: number) => `
        opacity: ${t};
        transform: translateY(${(1 - t) * 2}px) scale(${0.985 + t * 0.015});
        transform-origin: center left;
      `
    };
  };
  const focusTab = (tabKey: string) => {
    document.getElementById(getTabId(tabKey))?.focus();
  };
  const selectTab = (tabKey: string) => {
    if (controlledActiveTabKey === undefined) {
      selectedTabKey = tabKey;
    }

    onActiveTabKeyChange?.(tabKey);
  };
  const selectTabAt = (index: number) => {
    const tab = tabs[index];

    if (tab) {
      selectTab(tab.key);
      focusTab(tab.key);
    }
  };
  const handleTabKeydown = (event: KeyboardEvent) => {
    const currentIndex = tabs.findIndex(({ key }) => key === activeTabKey);

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
    {#each tabs as tab (tab.key)}
      <span
        class="inline-flex"
        animate:flip={{ duration: getPillTabReflowDuration, easing: cubicOut }}
      >
        <button
          id={getTabId(tab.key)}
          type="button"
          role="tab"
          aria-selected={activeTabKey === tab.key}
          aria-controls={activeTabKey === tab.key ? getPanelId(tab.key) : undefined}
          tabindex={activeTabKey === tab.key ? 0 : -1}
          class={[tabClasses, activeTabKey === tab.key && activeTabClasses]}
          in:pillTabEntry={tab.key}
          out:pillTabExit={tab.key}
          onclick={() => {
            selectTab(tab.key);
          }}
          onkeydown={handleTabKeydown}
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
