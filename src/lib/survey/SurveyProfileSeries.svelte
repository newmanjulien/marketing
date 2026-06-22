<script lang="ts">
  import type { Snippet } from 'svelte';

  const profileSpacing = {
    desktop: '74px',
    mobile: '56px'
  };

  let { children }: { children: Snippet } = $props();
</script>

<div
  class="survey-profile-series"
  style:--survey-profile-spacing={profileSpacing.desktop}
  style:--survey-profile-spacing-mobile={profileSpacing.mobile}
>
  {@render children()}
</div>

<style>
  .survey-profile-series {
    display: flex;
    flex-direction: column;
    gap: var(--survey-profile-spacing);
  }

  @media (max-width: 640px) {
    .survey-profile-series {
      gap: var(--survey-profile-spacing-mobile);
    }
  }
</style>
