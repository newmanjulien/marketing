<script module lang="ts">
  export type PillTab = {
    key: string;
    label: string;
  };
</script>

<script lang="ts" generics="Tab extends PillTab">
  import type { Snippet } from 'svelte';

  let {
    idBase,
    tabs,
    ariaLabel,
    defaultActiveTabKey,
    panelClass,
    children
  }: {
    idBase: string;
    tabs: readonly Tab[];
    ariaLabel: string;
    defaultActiveTabKey?: string;
    panelClass?: string;
    children: Snippet<[Tab]>;
  } = $props();

  let selectedTabKey = $state<string | undefined>();
  let activeTab = $derived.by(() => {
    const requestedTabKey = selectedTabKey ?? defaultActiveTabKey;

    if (requestedTabKey) {
      const selectedTab = tabs.find(({ key }) => key === requestedTabKey);

      if (selectedTab) {
        return selectedTab;
      }
    }

    return tabs[0];
  });
  let activeTabKey = $derived(activeTab?.key);

  const listClasses = 'mt-[34px] flex flex-wrap items-center gap-[7px]';
  const tabClasses =
    'min-h-[34px] rounded-full border border-stone-200/70 bg-stone-100 px-[18px] text-[14px] font-medium leading-none text-stone-600 transition-colors duration-150 hover:border-stone-200/70 hover:bg-stone-50 hover:text-stone-800';
  const activeTabClasses = 'border-stone-200/70 bg-white text-stone-800';

  const getTabId = (tabKey: string) => `${idBase}-${tabKey}-tab`;
  const getPanelId = (tabKey: string) => `${idBase}-${tabKey}-panel`;
  const focusTab = (tabKey: string) => {
    document.getElementById(getTabId(tabKey))?.focus();
  };
  const selectTabAt = (index: number) => {
    const tab = tabs[index];

    if (tab) {
      selectedTabKey = tab.key;
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

{#if tabs.length > 0}
  <div class={listClasses} role="tablist" aria-label={ariaLabel}>
    {#each tabs as tab (tab.key)}
      <button
        id={getTabId(tab.key)}
        type="button"
        role="tab"
        aria-selected={activeTabKey === tab.key}
        aria-controls={getPanelId(tab.key)}
        tabindex={activeTabKey === tab.key ? 0 : -1}
        class={[tabClasses, activeTabKey === tab.key && activeTabClasses]}
        onclick={() => {
          selectedTabKey = tab.key;
        }}
        onkeydown={handleTabKeydown}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  {#each tabs as tab (tab.key)}
    <div
      id={getPanelId(tab.key)}
      class={panelClass}
      role="tabpanel"
      aria-labelledby={getTabId(tab.key)}
      hidden={activeTabKey !== tab.key}
    >
      {@render children(tab)}
    </div>
  {/each}
{/if}
