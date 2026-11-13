import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

/*
 * Shared layer for panels next to a trigger: Dropdown menu, Popover, Date picker, Date range picker,
 * Notification menu, Combobox list and Tooltip.
 *
 * - Escape closes only the topmost panel and calls preventDefault, so a Modal around it stays open.
 * - A click outside closes the panel and leaves the focus where the user clicked.
 * - Focus that leaves the panel and its trigger (Tab, Shift+Tab) closes it (WCAG 2.4.11).
 * - The panel goes to the top layer with the native popover attribute, so overflow in a Modal or a
 *   table cannot clip it. It is placed next to the anchor, flips above when there is no room below,
 *   and stays inside the screen. Without popover support it stays where the CSS puts it.
 */

export type DismissReason = 'escape' | 'outside' | 'focusout';

type Entry = { root: RefObject<HTMLElement | null>; onEscape: () => void; anyTarget: boolean };
const stack: Entry[] = [];

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key !== 'Escape' || e.defaultPrevented) return;
  const t = e.target as Node | null;
  const loose = t === document.body || t === document.documentElement || t === null;
  for (let i = stack.length - 1; i >= 0; i--) {
    const s = stack[i];
    if (s.anyTarget || loose || (t && s.root.current?.contains(t))) {
      // preventDefault stops the cancel of a native <dialog> (Modal, Slideout, Command menu) around the panel.
      e.preventDefault();
      e.stopPropagation();
      s.onEscape();
      return;
    }
  }
};
const push = (entry: Entry) => {
  if (!stack.length) document.addEventListener('keydown', onKeyDown);
  stack.push(entry);
  return () => {
    const i = stack.indexOf(entry);
    if (i >= 0) stack.splice(i, 1);
    if (!stack.length) document.removeEventListener('keydown', onKeyDown);
  };
};

/** Latest value of a callback, so listeners do not have to be re-attached on every render. */
const useLatest = <T,>(value: T) => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};

export interface EscapeOptions {
  open: boolean;
  /** Element that holds the trigger and the panel. */
  root: RefObject<HTMLElement | null>;
  onEscape: () => void;
  /** Handle Escape wherever the focus is (Tooltip: it can be open by hover). */
  anyTarget?: boolean;
}

/** Escape closes the topmost open panel only. */
export function useEscape({ open, root, onEscape, anyTarget = false }: EscapeOptions) {
  const cb = useLatest(onEscape);
  useEffect(() => {
    if (!open) return;
    return push({ root, onEscape: () => cb.current(), anyTarget });
  }, [open, root, anyTarget, cb]);
}

export interface DismissOptions {
  open: boolean;
  root: RefObject<HTMLElement | null>;
  /** Called with the reason. Move the focus back to the trigger only for 'escape'. */
  onDismiss: (reason: DismissReason) => void;
}

/** Escape, a click outside and focus that leaves `root` close the panel. */
export function usePanelDismiss({ open, root, onDismiss }: DismissOptions) {
  const cb = useLatest(onDismiss);
  useEscape({ open, root, onEscape: () => cb.current('escape') });
  useEffect(() => {
    const el = root.current;
    if (!open || !el) return;
    const onDown = (e: PointerEvent) => { if (!el.contains(e.target as Node)) cb.current('outside'); };
    const onFocusOut = (e: FocusEvent) => {
      const to = e.relatedTarget as Node | null;
      if (to && !el.contains(to)) cb.current('focusout');
    };
    document.addEventListener('pointerdown', onDown, true);
    el.addEventListener('focusout', onFocusOut);
    return () => { document.removeEventListener('pointerdown', onDown, true); el.removeEventListener('focusout', onFocusOut); };
  }, [open, root, cb]);
}

export type Side = 'top' | 'bottom' | 'left' | 'right';
const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

export interface PlacementOptions {
  open: boolean;
  /** The panel. It gets popover="manual" and is shown in the top layer. */
  panel: RefObject<HTMLElement | null>;
  /** Element to place the panel against. */
  anchor: RefObject<HTMLElement | null>;
  align?: 'start' | 'center' | 'end';
  /** Same width as the anchor (Combobox list). */
  matchWidth?: boolean;
  /** Side of the anchor. Default bottom. */
  side?: Side;
  /** Use the other side when there is no room. Off for a panel with an arrow. */
  flip?: boolean;
  /** Horizontal point the panel is aligned to, measured from the panel edge (Popover arrow). */
  arrowOffset?: () => number;
}

const supportsPopover = () => typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;
const px = (el: Element, name: string) => parseFloat(getComputedStyle(el).getPropertyValue(name)) || 0;

/**
 * Puts the panel in the top layer and keeps it next to the anchor.
 * Distances come from CSS custom properties on the panel: --rb-layer-gap (anchor to panel, plus
 * --rb-layer-gap-extra for an arrow) and --rb-layer-margin (panel to the edge of the screen).
 */
export function usePlacement({ open, panel, anchor, align = 'start', side = 'bottom', matchWidth = false, flip = true, arrowOffset }: PlacementOptions) {
  const [placed, setPlaced] = useState<Side>(side);
  const offset = useLatest(arrowOffset);
  useLayoutEffect(() => {
    const el = panel.current;
    if (!open || !el || !supportsPopover()) return;
    el.setAttribute('popover', 'manual');
    el.setAttribute('data-rb-layer', '');
    try { el.showPopover(); } catch { return; }
    let frame = 0;
    const place = () => {
      const a = anchor.current;
      if (!a || !el.isConnected) return;
      const r = a.getBoundingClientRect();
      const gap = px(el, '--rb-layer-gap') + px(el, '--rb-layer-gap-extra');
      const margin = px(el, '--rb-layer-margin');
      if (matchWidth) el.style.width = `${r.width}px`;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const room: Record<Side, number> = {
        bottom: vh - r.bottom - gap - margin, top: r.top - gap - margin,
        right: vw - r.right - gap - margin, left: r.left - gap - margin,
      };
      const need = (s: Side) => (s === 'top' || s === 'bottom' ? h : w);
      const at: Side = flip && need(side) > room[side] && room[OPPOSITE[side]] >= need(side) ? OPPOSITE[side] : side;
      let top: number;
      let left: number;
      if (at === 'top' || at === 'bottom') {
        if (offset.current) left = r.left + r.width / 2 - offset.current();
        else if (align === 'end') left = r.right - w;
        else if (align === 'center') left = r.left + r.width / 2 - w / 2;
        else left = r.left;
        top = at === 'top' ? r.top - gap - h : r.bottom + gap;
      } else {
        left = at === 'left' ? r.left - gap - w : r.right + gap;
        top = r.top + r.height / 2 - h / 2;
      }
      left = Math.max(margin, Math.min(left, vw - w - margin));
      // Next to the anchor: keep it on screen. Above or below: never move it over the anchor.
      if (at === 'left' || at === 'right') top = Math.max(margin, Math.min(top, vh - h - margin));
      else if (at === 'top') top = Math.max(margin, top);
      Object.assign(el.style, { top: `${Math.round(top)}px`, left: `${Math.round(left)}px`, right: 'auto', bottom: 'auto' });
      setPlaced(at);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(place); };
    place();
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    ro?.observe(el);
    if (anchor.current) ro?.observe(anchor.current);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      ro?.disconnect();
      try { if (el.matches(':popover-open')) el.hidePopover(); } catch { /* already hidden */ }
    };
  }, [open, panel, anchor, align, side, matchWidth, flip, offset]);
  return { side: placed, above: placed === 'top' };
}

/**
 * The open modal <dialog> that is on top, or null. Content outside it is inert and below its backdrop,
 * so a ToastRegion renders inside it while it is open.
 */
export function useTopModal() {
  const [top, setTop] = useState<HTMLDialogElement | null>(null);
  useEffect(() => {
    const read = () => {
      const open = Array.from(document.querySelectorAll('dialog[open]')).filter((d) => { try { return d.matches(':modal'); } catch { return false; } });
      setTop((open[open.length - 1] as HTMLDialogElement | undefined) ?? null);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'], childList: true });
    return () => mo.disconnect();
  }, []);
  return top;
}
