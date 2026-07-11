<script lang="ts">
  import { CaretDoubleRightIcon, CaretRightIcon } from 'phosphor-svelte';

  type DocumentLinkCardVariant = 'document' | 'request';

  let {
    href,
    label,
    target,
    rel,
    variant = 'document'
  }: {
    href: string;
    label: string;
    target?: string;
    rel?: string;
    variant?: DocumentLinkCardVariant;
  } = $props();

  const cardVariantClasses = {
    document: 'bg-white hover:border-stone-300',
    request: 'bg-stone-100/60 hover:bg-stone-100'
  } as const;

  const labelVariantClasses = {
    document: 'text-stone-750',
    request: 'text-stone-600'
  } as const;

  const actionVariantClasses = {
    document: 'text-stone-700',
    request: 'bg-white text-stone-600'
  } as const;
</script>

<a
  {href}
  {target}
  {rel}
  class={[
    'group flex min-h-[92px] w-full items-center justify-between gap-[38px] rounded-[16px] border border-stone-200 px-[22px] py-[24px] text-stone-900 shadow-[0_1px_4px_rgba(28,25,23,0.06)] outline-none transition-[background-color,border-color,box-shadow] duration-200 hover:shadow-[0_6px_14px_rgba(28,25,23,0.06)] focus-visible:ring-2 focus-visible:ring-stone-900/20 sm:gap-[48px] sm:px-[24px]',
    cardVariantClasses[variant]
  ]}
>
  <span
    class={[
      'min-w-0 break-words text-[16px] font-book leading-[1.4] tracking-normal transition-colors duration-200 group-hover:text-stone-900',
      labelVariantClasses[variant]
    ]}
  >
    {label}
  </span>

  <span
    class={[
      'flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full border border-stone-300 transition-colors duration-200 group-hover:bg-stone-100 group-hover:text-stone-900',
      actionVariantClasses[variant]
    ]}
    aria-hidden="true"
  >
    {#if variant === 'request'}
      <CaretDoubleRightIcon size={16} weight="bold" />
    {:else}
      <CaretRightIcon size={16} weight="bold" />
    {/if}
  </span>
</a>
