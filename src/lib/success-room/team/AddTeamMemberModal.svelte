<script lang="ts">
  import ModalShell from '$lib/ui/ModalShell.svelte';
  import TeamMemberPhotoPicker from './TeamMemberPhotoPicker.svelte';

  type TeamMemberInput = {
    name: string;
    role: string;
    photoFile: File;
  };

  let {
    open,
    onClose,
    onAddTeamMember
  }: {
    open: boolean;
    onClose: () => void;
    onAddTeamMember: (member: TeamMemberInput) => Promise<void>;
  } = $props();

  let name = $state('');
  let role = $state('');
  let photoFile = $state<File | null>(null);
  let errorMessage = $state('');
  let submitting = $state(false);

  const inputClasses =
    'h-[42px] w-full rounded-[8px] border border-stone-200 bg-white px-[12px] font-body text-[14px] font-book leading-none tracking-normal text-stone-800 outline-none transition-colors duration-150 placeholder:text-stone-400 focus:border-stone-300 focus:ring-2 focus:ring-stone-900/20';
  const labelClasses = 'grid gap-[7px] text-[13px] font-book leading-none tracking-normal text-stone-500';

  const resetForm = () => {
    name = '';
    role = '';
    photoFile = null;
    errorMessage = '';
  };

  const closeModal = () => {
    if (submitting) {
      return;
    }

    resetForm();
    onClose();
  };

  const submit = async () => {
    const trimmedName = name.trim();
    const trimmedRole = role.trim();

    if (!trimmedName || !trimmedRole || !photoFile || submitting) {
      return;
    }

    submitting = true;
    errorMessage = '';

    try {
      await onAddTeamMember({
        name: trimmedName,
        role: trimmedRole,
        photoFile
      });
      resetForm();
      onClose();
    } catch {
      errorMessage = 'Team member could not be added.';
    } finally {
      submitting = false;
    }
  };
</script>

<ModalShell open={open} title="Add team member" onClose={closeModal}>
  <form
    class="grid gap-[14px]"
    onsubmit={(event) => {
      event.preventDefault();
      void submit();
    }}
  >
    <label class={labelClasses}>
      <span>Name</span>
      <input class={inputClasses} autocomplete="name" bind:value={name} />
    </label>

    <label class={labelClasses}>
      <span>Role</span>
      <input class={inputClasses} autocomplete="organization-title" bind:value={role} />
    </label>

    <TeamMemberPhotoPicker bind:value={photoFile} disabled={submitting} />

    {#if errorMessage}
      <p class="m-0 text-[13px] font-book leading-[1.35] tracking-normal text-red-700">
        {errorMessage}
      </p>
    {/if}

    <div class="mt-[4px] flex items-center justify-end gap-[9px]">
      <button
        type="button"
        class="h-[36px] rounded-[8px] border border-stone-200 bg-white px-[13px] font-body text-[13px] font-book leading-none tracking-normal text-stone-600 transition-colors duration-150 hover:border-stone-300 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20"
        onclick={closeModal}
      >
        Cancel
      </button>

      <button
        type="submit"
        class="h-[36px] rounded-[8px] border border-stone-900 bg-stone-900 px-[13px] font-body text-[13px] font-book leading-none tracking-normal text-white transition-colors duration-150 hover:border-stone-700 hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20 disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-100 disabled:text-stone-400"
        disabled={!name.trim() || !role.trim() || !photoFile || submitting}
      >
        {submitting ? 'Adding' : 'Add'}
      </button>
    </div>
  </form>
</ModalShell>
