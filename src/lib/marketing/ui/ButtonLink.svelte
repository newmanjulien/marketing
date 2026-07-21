<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  type ButtonLinkProps = Omit<HTMLAnchorAttributes, 'href' | 'children'> & {
    href: string;
    variant: 'primary' | 'secondary' | 'soft';
    size: 'small' | 'medium' | 'large' | 'hero' | 'xlarge';
    shape?: 'default' | 'pill';
    fullWidth?: boolean;
    highlightSweep?: boolean;
    children: Snippet;
  };

  let {
    href,
    variant,
    size,
    shape = 'default',
    fullWidth = false,
    highlightSweep = false,
    children,
    class: className,
    ...anchorProps
  }: ButtonLinkProps = $props();

  const baseClasses =
    'inline-flex items-center justify-center font-book leading-none transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950';

  const shapeClasses = {
    default: 'rounded-[9px]',
    pill: 'rounded-full'
  };

  const sizeClasses = {
    small: 'h-[36px] px-[14px] text-[14px]',
    medium: 'h-[42px] px-[14px] text-[14px]',
    large: 'h-[50px] px-[23px] text-[18px]',
    hero: 'h-[54px] px-[28px] text-[17px]',
    xlarge: 'h-[58px] px-[32px] text-[17px]'
  };

  const variantClasses = {
    primary: 'bg-stone-750 text-white hover:bg-stone-700',
    secondary: 'border border-stone-300 bg-white text-stone-950 hover:bg-stone-50',
    soft: 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
  };
</script>

<a
  {...anchorProps}
  {href}
  class={[
    baseClasses,
    shapeClasses[shape],
    sizeClasses[size],
    variantClasses[variant],
    { 'w-full': fullWidth },
    { 'button-link-highlight-sweep relative overflow-hidden': highlightSweep },
    className
  ]}
>
  {@render children()}
</a>

<style>
  .button-link-highlight-sweep::after {
    content: '';
    position: absolute;
    inset: -40% auto -40% -55%;
    width: 42%;
    transform: skewX(-24deg) translateX(0);
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.04) 24%,
      rgba(255, 255, 255, 0.18) 50%,
      rgba(255, 255, 255, 0.04) 76%,
      transparent 100%
    );
    pointer-events: none;
  }

  .button-link-highlight-sweep:hover::after {
    animation: button-link-highlight-sweep 1160ms cubic-bezier(0.22, 1, 0.36, 1) 160ms;
  }

  @keyframes button-link-highlight-sweep {
    to {
      transform: skewX(-24deg) translateX(430%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .button-link-highlight-sweep:hover::after {
      animation: none;
    }
  }
</style>
