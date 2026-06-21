<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="survey-profile-series">
  {@render children()}
</div>

<style>
  .survey-profile-series {
    display: flex;
    flex-direction: column;
    gap: 42px;
  }

  @media (max-width: 640px) {
    .survey-profile-series {
      gap: 34px;
    }
  }
</style>
