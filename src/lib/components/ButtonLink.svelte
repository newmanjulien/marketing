<script lang="ts">
  export let href = '#';
  export let target: '_self' | '_blank' | '_parent' | '_top' | undefined = undefined;
  export let rel: string | undefined = undefined;
  export let variant: 'primary' | 'secondary' = 'secondary';
  export let size: 'small' | 'default' | 'large' = 'default';
  export let textSize: 'default' | 'compact' = 'default';
  export let fullWidth = false;

  const baseClasses =
    'inline-flex items-center justify-center rounded-[7px] font-normal leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950';

  const sizeClasses = {
    small: 'h-[36px] px-[14px]',
    default: 'h-[43px] px-[16px] md:h-[40px] md:px-[16px]',
    large: 'h-[50px] px-[23px] md:h-[48px] md:px-[22px]'
  };

  const textSizeClasses = {
    default: {
      small: 'text-[14px]',
      default: 'text-[15px] md:text-[15px]',
      large: 'text-[17px] md:text-[16px]'
    },
    compact: {
      small: 'text-[13px]',
      default: 'text-[14px] md:text-[14px]',
      large: 'text-[15px] md:text-[14px]'
    }
  };

  const variantClasses = {
    primary: 'bg-stone-800 text-white hover:bg-stone-950',
    secondary: 'border border-stone-300 bg-white text-stone-950 hover:bg-stone-50'
  };

  $: classes = [
    baseClasses,
    sizeClasses[size],
    textSizeClasses[textSize][size],
    variantClasses[variant],
    fullWidth && 'w-full'
  ]
    .filter(Boolean)
    .join(' ');
</script>

<a {href} {target} {rel} class={classes}>
  <slot />
</a>
