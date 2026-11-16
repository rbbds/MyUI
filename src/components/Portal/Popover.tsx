import { cloneElement, useEffect, useId, useRef, useState, type MouseEvent, type ReactElement, type ReactNode, type RefObject } from 'react';
import { usePanelDismiss, usePlacement } from '../../utils/panel';
import { X } from 'lucide-react';
import { ButtonIcon } from '../Button/Button';
import { cx } from '../../utils/cx';
import { mergeLabels } from '../../utils/labels';
import { useControlled } from '../../utils/useControlled';
import './Portal2.css';

/**
 * Close on Escape, on a click outside `root` and when the focus leaves `root`.
 * @deprecated Will be removed in 2.0.0. The components use the shared panel layer (src/utils/panel.ts).
 */
export function useDismiss(open: boolean, root: RefObject<HTMLElement | null>, close: () => void) {
  usePanelDismiss({ open, root, onDismiss: () => close() });
}

export interface PopoverProps {
  /** The trigger, usually a Button or ButtonIcon. Receives aria-expanded, aria-controls and onClick. */
  trigger: ReactElement<Record<string, unknown>>;
  title?: ReactNode;
  children?: ReactNode;
  /** Buttons at the bottom, e.g. Close and Read more. */
  actions?: ReactNode;
  /** Show the close button. Escape and clicking outside always close. */
  closable?: boolean;
  labels?: Partial<PopoverLabels>;
  /** @deprecated Use labels.close. Removed in 2.0.0. */
  closeLabel?: string;
  align?: 'start' | 'end';
  /** Show an arrow that points to the middle of the trigger. The panel shifts so the arrow lines up. */
  arrow?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}
export interface PopoverLabels {
  /** Name of the close button. */
  close: string;
}
export const DEFAULT_POPOVER_LABELS: PopoverLabels = { close: 'Close' };

/**
 * Non-modal panel next to a button with an explanation or a small form.
 * For actions only use DropdownMenu; for one sentence use Tooltip.
 */
export function Popover({ trigger, title, children, actions, closable = true, labels, closeLabel, align = 'start', arrow = false, open: openProp, defaultOpen = false, onOpenChange, className }: PopoverProps) {
  const l = mergeLabels(DEFAULT_POPOVER_LABELS, labels, { close: closeLabel });
  const [open, set] = useControlled(openProp, defaultOpen, onOpenChange);
  const root = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const titleId = `${id}-title`;
  const triggerEl = () => root.current?.querySelector<HTMLElement>("[aria-controls]");
  /* Escape and the close button return the focus to the trigger; a click outside or Tab leaves it where it went. */
  const close = () => { set(false); triggerEl()?.focus(); };
  usePanelDismiss({ open, root, onDismiss: (reason) => (reason === 'escape' ? close() : set(false)) });
  const anchor = useRef<HTMLElement | null>(null);
  anchor.current = triggerEl() ?? root.current;
  usePlacement({
    open, panel, anchor, align, flip: !arrow,
    // With an arrow, the arrow tip points to the middle of the trigger.
    arrowOffset: arrow ? () => {
      const el = panel.current;
      if (!el) return 0;
      const cs = getComputedStyle(el);
      const off = parseFloat(cs.getPropertyValue('--popover-arrow-offset')) || 0;
      const w = parseFloat(cs.getPropertyValue('--popover-arrow-width')) || 0;
      return align === 'end' ? el.offsetWidth - off - w / 2 : off + w / 2;
    } : undefined,
  });
  useEffect(() => { if (open) panel.current?.focus(); }, [open]);
  return (
    <span ref={root} className="rb-popover-anchor">
      {cloneElement(trigger, { 'aria-expanded': open, 'aria-controls': id, 'aria-haspopup': 'dialog', onClick: (e: MouseEvent) => { (trigger.props.onClick as ((e: MouseEvent) => void) | undefined)?.(e); if (!e.defaultPrevented) set(!open); } })}
      {open && (
        <div ref={panel} id={id} role="dialog" aria-labelledby={title ? titleId : undefined} tabIndex={-1} className={cx('rb-popover', `rb-popover--${align}`, arrow && 'rb-popover--arrow', className)}>
          {(title || closable) && (
            <div className="rb-popover__header">
              {title && <p id={titleId} className="rb-popover__title">{title}</p>}
              {closable && <ButtonIcon hierarchy="tertiary" size="sm" className="rb-popover__close" icon={<X aria-hidden="true" />} onClick={close} aria-label={l.close} />}
            </div>
          )}
          {children && <div className="rb-popover__body">{children}</div>}
          {actions && <div className="rb-popover__actions">{actions}</div>}
        </div>
      )}
    </span>
  );
}
