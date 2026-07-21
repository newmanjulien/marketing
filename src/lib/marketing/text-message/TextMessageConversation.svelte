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

<div class="flex min-h-0 flex-1 flex-col bg-white">
  <div class="min-h-0 flex-1 overflow-auto px-[18px] py-[16px] sm:px-[22px]">
    <div class="flex flex-col items-start gap-[3px]">
      {#each messages as bubble, index}
        <div
          class="bubble max-w-[82%] whitespace-pre-wrap break-words px-[14px] py-[8px] text-left font-body text-[14.5px] font-book leading-[1.35] tracking-normal text-white sm:text-[15.5px]"
          class:bubble-tail={index === messages.length - 1}
        >{bubble}</div>
      {/each}
    </div>
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
  .bubble-tail::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: -7px;
    width: 20px;
    height: 20px;
    background: #0b84fe;
    border-bottom-right-radius: 15px;
  }

  .bubble-tail::after {
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
