import { useEffect, useRef, type MouseEvent, type PointerEvent, type RefObject, type SyntheticEvent } from 'react';

/*
 * Shared behaviour for Modal, Slideout and Command menu, on a native <dialog> with showModal().
 * The browser gives focus trap, Escape and focus back to the trigger. This adds:
 * - A click on the backdrop closes only when the press also started on the backdrop
 *   (selecting text in the panel and letting go outside does not close it).
 * - onClose also runs when the dialog closes itself, e.g. a <form method="dialog"> inside it.
 * - The page behind does not scroll while the dialog is open.
 * - initialFocus: the element that gets focus when the dialog opens.
 */

let locks = 0;
let saved: { overflow: string; paddingRight: string } | null = null;
const lockScroll = () => {
  const html = document.documentElement;
  if (locks++ === 0) {
    const gap = window.innerWidth - html.clientWidth;
    saved = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    html.style.overflow = 'hidden';
    // Keep the width the same when the scrollbar disappears.
    if (gap > 0) html.style.paddingRight = `${gap}px`;
  }
  return () => {
    if (--locks === 0 && saved) {
      html.style.overflow = saved.overflow;
      html.style.paddingRight = saved.paddingRight;
      saved = null;
    }
  };
};

export interface ModalDialogOptions {
  open: boolean;
  onClose: () => void;
  /** Element that gets focus when the dialog opens. Default: the browser picks the first focusable element (or one with autoFocus). */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Runs right before showModal(), e.g. to reset a search field. */
  onOpen?: () => void;
}

export function useModalDialog({ open, onClose, initialFocus, onOpen }: ModalDialogOptions) {
  const ref = useRef<HTMLDialogElement>(null);
  const latest = useRef({ open, onClose, onOpen });
  latest.current = { open, onClose, onOpen };
  const pressedBackdrop = useRef(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      latest.current.onOpen?.();
      d.showModal();
      initialFocus?.current?.focus();
    }
    if (!open && d.open) d.close();
  }, [open, initialFocus]);

  useEffect(() => {
    if (!open) return;
    return lockScroll();
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    // The dialog closed without our state knowing (form method="dialog", dialog.close() elsewhere).
    const onNativeClose = () => { if (latest.current.open) latest.current.onClose(); };
    d.addEventListener('close', onNativeClose);
    return () => d.removeEventListener('close', onNativeClose);
  }, []);

  const props = {
    ref,
    onCancel: (e: SyntheticEvent<HTMLDialogElement>) => { e.preventDefault(); onClose(); },
    onPointerDown: (e: PointerEvent<HTMLDialogElement>) => { pressedBackdrop.current = e.target === ref.current; },
    onClick: (e: MouseEvent<HTMLDialogElement>) => {
      if (pressedBackdrop.current && e.target === ref.current) onClose();
      pressedBackdrop.current = false;
    },
  };
  return props;
}
