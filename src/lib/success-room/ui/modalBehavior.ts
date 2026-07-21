import { tick } from 'svelte';
import type { Attachment } from 'svelte/attachments';

let activeScrollLocks = 0;
let previousBodyOverflow = '';

type ModalBehaviorOptions = {
  onClose: () => void;
};

export function createModalBehavior({ onClose }: ModalBehaviorOptions): Attachment<HTMLDivElement> {
  return (dialogElement) => {
    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    lockBodyScroll();
    document.addEventListener('keydown', handleKeydown);
    void focusDialogAfterRender();

    async function focusDialogAfterRender() {
      await tick();
      (getFocusableElements()[0] ?? dialogElement).focus();
    }

    function getFocusableElements() {
      return Array.from(
        dialogElement.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]'
        )
      ).filter((element) => element.tabIndex >= 0);
    }

    function handleKeydown(event: KeyboardEvent) {
      // Escape during IME composition cancels the composition, not the modal.
      if (event.isComposing) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        trapFocus(event);
      }
    }

    function trapFocus(event: KeyboardEvent) {
      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0] ?? dialogElement;
      const lastElement = focusableElements.at(-1) ?? dialogElement;
      const activeElement = document.activeElement;

      if (!dialogElement.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
        return;
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      unlockBodyScroll();
      previouslyFocusedElement?.focus();
    };
  };
}

function lockBodyScroll() {
  if (activeScrollLocks === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  activeScrollLocks += 1;
}

function unlockBodyScroll() {
  activeScrollLocks = Math.max(0, activeScrollLocks - 1);

  if (activeScrollLocks === 0) {
    document.body.style.overflow = previousBodyOverflow;
    previousBodyOverflow = '';
  }
}
