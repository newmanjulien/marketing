<script lang="ts">
  let { open }: { open: boolean } = $props();
</script>

<span class="menu-toggle-icon" aria-hidden="true" data-open={open}>
  <span class="menu-toggle-icon__line menu-toggle-icon__line--top"></span>
  <span class="menu-toggle-icon__line menu-toggle-icon__line--bottom"></span>
</span>

<style>
  .menu-toggle-icon {
    position: relative;
    display: block;
    width: 26px;
    height: 26px;
  }

  .menu-toggle-icon__line {
    position: absolute;
    left: 3px;
    top: 50%;
    width: 20px;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
    transform-origin: center;
    transition: transform 260ms ease;
  }

  .menu-toggle-icon__line--top {
    transform: translateY(-4px) rotate(0deg);
  }

  .menu-toggle-icon__line--bottom {
    transform: translateY(4px) rotate(0deg);
  }

  .menu-toggle-icon[data-open='true'] .menu-toggle-icon__line--top {
    transform: translateY(0) rotate(45deg);
  }

  .menu-toggle-icon[data-open='true'] .menu-toggle-icon__line--bottom {
    transform: translateY(0) rotate(-45deg);
  }

  @media (prefers-reduced-motion: reduce) {
    .menu-toggle-icon__line {
      transition-duration: 1ms;
    }
  }
</style>
