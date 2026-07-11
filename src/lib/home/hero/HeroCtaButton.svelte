<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import ButtonLink from '$lib/ui/ButtonLink.svelte';

  type HeroCtaButtonProps = Omit<HTMLAnchorAttributes, 'href' | 'children'> & {
    href: string;
    children: Snippet;
  };

  let { children, class: className, ...anchorProps }: HeroCtaButtonProps = $props();
</script>

<ButtonLink
  {...anchorProps}
  variant="primary"
  size="xlarge"
  textSize="compact"
  shape="pill"
  highlightSweep
  class={[
    'shadow-[0_5px_12px_rgba(41,37,36,0.2)] hover:-translate-y-[2px] hover:shadow-[0_8px_16px_rgba(41,37,36,0.28)]',
    className
  ]}
>
  {@render children()}
</ButtonLink>
