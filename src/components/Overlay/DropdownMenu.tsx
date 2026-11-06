import { cloneElement, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Overlay.css';

export type MenuEntry =
  | { type?: 'item'; label: string; icon?: ReactNode; shortcut?: string; destructive?: boolean; disabled?: boolean; onSelect: () => void }
  | { type: 'separator' };

export interface DropdownMenuProps {
  /** The trigger, typically a Button. Receives aria-haspopup/expanded and onClick. */
  trigger: ReactElement<Record<string, unknown>>;
  items: MenuEntry[];
  align?: 'start' | 'end';
  label?: string;
}

/** Menu button pattern: arrow keys, Home/End, Escape returns focus to the trigger. */
export function DropdownMenu({ trigger, items, align = 'start', label }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    if (!open) return;
    const first = itemRefs.current.find((el) => el && !el.disabled);
    first?.focus();
    const onDoc = (e: MouseEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const close = () => { setOpen(false); triggerRef.current?.focus(); };
  const onKeyDown = (e: KeyboardEvent) => {
    const els = itemRefs.current.filter((el) => el && !el.disabled);
    const i = els.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); els[(i + 1) % els.length]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); els[(i - 1 + els.length) % els.length]?.focus(); }
    else if (e.key === 'Home') { e.preventDefault(); els[0]?.focus(); }
    else if (e.key === 'End') { e.preventDefault(); els[els.length - 1]?.focus(); }
    else if (e.key === 'Escape' || e.key === 'Tab') { close(); }
  };

  let n = 0;
  return (
    <span className="rb-menu-anchor" ref={rootRef}>
      {cloneElement(trigger, {
        ref: (el: HTMLElement | null) => { triggerRef.current = el; },
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? menuId : undefined,
        onClick: () => setOpen((o) => !o),
      })}
      {open && (
        <div id={menuId} role="menu" aria-label={label} className={cx('rb-menu', align === 'end' && 'rb-menu--end')} onKeyDown={onKeyDown}>
          {items.map((it, idx) => {
            if (it.type === 'separator') return <hr key={idx} className="rb-menu__separator" />;
            const k = n++;
            return (
              <button
                key={idx}
                ref={(el) => { if (el) itemRefs.current[k] = el; }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                disabled={it.disabled}
                className={cx('rb-menu__item', it.destructive && 'rb-menu__item--destructive')}
                onClick={() => { it.onSelect(); close(); }}
              >
                {it.icon}
                <span className="rb-menu__label">{it.label}</span>
                {it.shortcut && <span className="rb-menu__shortcut">{it.shortcut}</span>}
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
}
