<script lang="ts">
  let {
    eyebrow,
    backHref,
    backLabel,
    title,
    description
  }: {
    eyebrow?: string;
    backHref?: string;
    backLabel?: string;
    title: string;
    description?: string;
  } = $props();

  const eyebrowClasses = 'm-0 block text-[14px] font-medium leading-none text-stone-500';
  const backLinkClasses = `${eyebrowClasses} transition-colors duration-200 hover:text-stone-900`;
</script>

<header>
  {#if backHref && backLabel}
    <a href={backHref} class={backLinkClasses}>
      {backLabel}
    </a>
  {:else if eyebrow}
    <p class={eyebrowClasses}>
      {eyebrow}
    </p>
  {/if}

  <h1
    class="mt-[28px] font-heading text-[32px] font-normal leading-[1.05] text-stone-750"
  >
    {title}
  </h1>

  {#if description}
    <p
      class="mt-[20px] text-[14px] font-book leading-[1.45] text-stone-700 sm:text-[15px]"
    >
      {description}
    </p>
  {/if}
</header>
