<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  type CheckboxProps = Omit<HTMLInputAttributes, 'type' | 'checked'> & {
    checked?: boolean;
  };

  let {
    checked = $bindable(false),
    class: className,
    ...inputProps
  }: CheckboxProps = $props();
</script>

<input
  {...inputProps}
  type="checkbox"
  class={['success-room-checkbox', className]}
  bind:checked
/>

<style>
  .success-room-checkbox {
    -webkit-appearance: none;
    appearance: none;
    border: 1px solid rgb(214 211 209);
    border-radius: 4px;
    background: white;
    display: grid;
    place-content: center;
  }

  .success-room-checkbox::before {
    content: '';
    width: 7px;
    height: 7px;
    transform: scale(0);
    transition: transform 80ms ease-out;
    clip-path: polygon(14% 44%, 0 59%, 39% 100%, 100% 18%, 84% 4%, 37% 68%);
    background: white;
  }

  .success-room-checkbox:checked {
    border-color: rgb(28 25 23);
    background: rgb(28 25 23);
  }

  .success-room-checkbox:checked::before {
    transform: scale(1);
  }

  .success-room-checkbox:focus-visible {
    outline: 2px solid rgb(28 25 23 / 0.2);
    outline-offset: 3px;
  }
</style>
