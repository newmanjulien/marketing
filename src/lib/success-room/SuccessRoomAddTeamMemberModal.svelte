<script lang="ts">
  import ModalShell from '$lib/ui/ModalShell.svelte';

  let {
    open,
    onClose
  }: {
    open: boolean;
    onClose: () => void;
  } = $props();

  const inputClasses =
    'mt-[8px] h-[40px] w-full rounded-[8px] border border-stone-200/70 bg-white px-[12px] font-body text-[14px] font-book tracking-normal text-stone-700 outline-none shadow-[0_1px_0_rgba(48,47,45,0.03)] placeholder:text-stone-400 focus:border-stone-300 focus:text-stone-900';
  const labelClasses =
    'block text-[13px] font-book leading-none tracking-normal text-stone-700';
  const secondaryButtonClasses =
    'inline-flex h-[36px] items-center justify-center rounded-[7px] border border-stone-300 bg-white px-[14px] font-body text-[13px] font-book leading-none tracking-normal text-stone-950 transition-colors duration-200 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950';
  const primaryButtonClasses =
    'inline-flex h-[36px] items-center justify-center rounded-[7px] border-0 bg-stone-750 px-[14px] font-body text-[13px] font-book leading-none tracking-normal text-white transition-colors duration-200 hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950';
</script>

<ModalShell {open} title="Add team member" onClose={onClose}>
  <div class="grid gap-[18px]">
    <label class={labelClasses} for="success-room-team-member-name">
      Name
      <input
        id="success-room-team-member-name"
        class={inputClasses}
        type="text"
        placeholder="Alex Morgan"
      />
    </label>

    <label class={labelClasses} for="success-room-team-member-role">
      Role
      <input
        id="success-room-team-member-role"
        class={inputClasses}
        type="text"
        placeholder="Customer success"
      />
    </label>

    <label class={labelClasses} for="success-room-team-member-email">
      Email
      <input
        id="success-room-team-member-email"
        class={inputClasses}
        type="email"
        placeholder="alex@example.com"
      />
    </label>
  </div>

  {#snippet footer()}
    <button type="button" class={secondaryButtonClasses} onclick={onClose}>Cancel</button>
    <button type="button" class={primaryButtonClasses}>Add team member</button>
  {/snippet}
</ModalShell>
