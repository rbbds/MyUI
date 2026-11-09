import { cloneElement, useEffect, useId, useRef, useState, type ReactElement, type ReactNode, type RefObject } from 'react';
import { X } from 'lucide-react';
import { cx } from '../../utils/cx';
import './Portal2.css';

/** Close on Escape and on a click outside `root`, and return focus to the trigger. */
export function useDismiss(open: boolean, root: RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) close(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open, root, close]);
}

export interface PopoverProps {
  /** The trigger, usually a Button or ButtonIcon. Receives aria-expanded, aria-controls and onClick. */
  trigger: ReactElement<Record<string, unknown>>;
  title?: ReactNode;
  children?: ReactNode;
  /** Buttons at the bottom, e.g. Sluiten and Lees meer. */
  actions?: ReactNode;
  /** Show the close button. Escape and clicking outside always close. */
  closable?: boolean;
  closeLabel?: string;
  align?: 'start' | 'end';
  /** Show an arrow that points to the middle of the trigger. The panel shifts so the arrow lines up. */
  arrow?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * Non-modal panel next to a button with an explanation or a small form.
 * For actions only use DropdownMenu; for one sentence use Tooltip.
 */
export function Popover({ trigger, title, children, actions, closable = true, closeLabel = 'Sluiten', align = 'start', arrow = false, open: openProp, onOpenChange, className }: PopoverProps) {
  const [own, setOwn] = useState(false);
  const open = openProp ?? own;
  const set = (o: boolean) => { if (openProp === undefined) setOwn(o); onOpenChange?.(o); };
  const root = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const titleId = `${id}-title`;
  const close = () => { set(false); (root.current?.querySelector('[aria-controls]') as HTMLElement | null)?.focus(); };
  useDismiss(open, root, close);
  useEffect(() => { if (open) panel.current?.focus(); }, [open]);
  return (
    <span ref={root} className="rb-popover-anchor">
      {cloneElement(trigger, { 'aria-expanded': open, 'aria-controls': id, 'aria-haspopup': 'dialog', onClick: () => set(!open) })}
      {open && (
        <div ref={panel} id={id} role="dialog" aria-labelledby={title ? titleId : undefined} tabIndex={-1} className={cx('rb-popover', `rb-popover--${align}`, arrow && 'rb-popover--arrow', className)}>
          {(title || closable) && (
            <div className="rb-popover__header">
              {title && <p id={titleId} className="rb-popover__title">{title}</p>}
              {closable && <button type="button" className="rb-popover__close" onClick={close} aria-label={closeLabel}><X aria-hidden="true" /></button>}
            </div>
          )}
          {children && <div className="rb-popover__body">{children}</div>}
          {actions && <div className="rb-popover__actions">{actions}</div>}
        </div>
      )}
    </span>
  );
}
