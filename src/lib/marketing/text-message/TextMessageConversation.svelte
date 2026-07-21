<script lang="ts">
  let { message }: { message: string } = $props();

  // Each blank-line-separated paragraph becomes its own chat bubble.
  const messages = $derived(
    message
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
  );
</script>

<div class="min-h-0 flex-1 overflow-auto bg-white px-[18px] py-[16px] sm:px-[22px]">
  <div class="flex flex-col items-start gap-[3px]">
    {#each messages as bubble}
      <div
        class="bubble max-w-[82%] whitespace-pre-wrap break-words px-[14px] py-[8px] text-left font-body text-[14.5px] font-book leading-[1.35] text-white sm:text-[15.5px]"
      >{bubble}</div>
    {/each}
  </div>
</div>

<style>
  .bubble {
    position: relative;
    background: #0b84fe;
    border-radius: 18px;
  }

  /* iMessage tail: a blue curve hugging the bubble's bottom-left corner,
     carved into a tail shape by a white curve just outside it. */
  .bubble:last-child {
    /* The tail pseudo-elements draw this corner. */
    border-bottom-left-radius: 0;
  }

  .bubble:last-child::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: -7px;
    width: 20px;
    height: 20px;
    background: inherit;
    border-bottom-right-radius: 15px;
  }

  .bubble:last-child::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -10px;
    width: 10px;
    height: 20px;
    background: white;
    border-bottom-right-radius: 10px;
  }
</style>
