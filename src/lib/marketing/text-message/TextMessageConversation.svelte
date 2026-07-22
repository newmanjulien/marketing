<script lang="ts">
  import type { Attachment } from 'svelte/attachments';

  let { message, bubbleMaxWidth = '88%' }: { message: string; bubbleMaxWidth?: string } =
    $props();

  // Each blank-line-separated paragraph becomes its own chat bubble.
  const messages = $derived(
    message
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
  );

  // A wrapped text box takes its full max-width even when every line falls
  // short of it, so all multi-line bubbles would render identically wide.
  // iMessage bubbles hug their text instead: measure the widest rendered line
  // and shrink the bubble to exactly that. The text argument only makes the
  // attachment re-run when the message changes.
  function hugWidestLine(_text: string): Attachment<HTMLElement> {
    return (bubble) => {
      function fit() {
        bubble.style.width = '';
        const range = document.createRange();
        range.selectNodeContents(bubble);
        const widestLine = Math.max(
          0,
          ...Array.from(range.getClientRects(), (rect) => rect.width)
        );
        const { paddingLeft, paddingRight } = getComputedStyle(bubble);
        // ceil keeps the content box at least as wide as the measured line,
        // so nothing re-wraps.
        bubble.style.width = `${Math.ceil(
          widestLine + parseFloat(paddingLeft) + parseFloat(paddingRight)
        )}px`;
      }

      fit();
      // Line metrics shift when the webfont replaces the metric-matched
      // fallback; re-wrapping happens when the pane resizes. Observing the
      // parent, whose width is unaffected by bubble widths, avoids an
      // observer feedback loop.
      document.fonts.ready.then(fit);
      const observer = new ResizeObserver(fit);
      observer.observe(bubble.parentElement!);
      return () => observer.disconnect();
    };
  }
</script>

<div class="min-h-0 flex-1 overflow-auto bg-white px-[18px] py-[16px] sm:px-[22px]">
  <div class="flex flex-col items-start gap-[3px]">
    {#each messages as text}
      <div
        class="bubble whitespace-pre-wrap text-pretty break-words px-[14px] py-[8px] text-left font-body text-[14.5px] font-book leading-[1.35] text-white sm:text-[15.5px]"
        style="max-width: {bubbleMaxWidth}"
        {@attach hugWidestLine(text)}
      >{text}</div>
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
