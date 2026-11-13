import { cloneElement, useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactElement, type ReactNode, type Ref } from 'react';
import { cx } from '../../utils/cx';
import { usePanelDismiss, usePlacement } from '../../utils/panel';
import './Overlay.css';

export type MenuEntry =
  | { type?: 'item'; label: string; icon?: ReactNode; shortcut?: string; destructive?: boolean; disabled?: boolean; onSelect: () => void }
  | { type: 'separator' };

export interface DropdownMenuProps {
  /** The trigger, typically a Button. Receives aria-haspopup/expanded and onClick. Its own onClick and ref keep working. */
  trigger: ReactElement<Record<string, unknown>>;
  items: MenuEntry[];
  align?: 'start' | 'end';
  label?: string;
}

const setRef = <T,>(ref: Ref<T> | undefined, value: T) => {
  if (typeof ref === 'function') ref(value);
  else if (ref && typeof ref === 'object') (ref as { current: T }).current = value;
};

/**
 * Menu button pattern: Enter, Space, Arrow down or Arrow up on the trigger opens the menu.
 * Arrow keys, Home and End move, typing a letter jumps to the next item that starts with it.
 * Escape closes and returns the focus to the trigger; Tab or a click outside closes.
 */
export function DropdownMenu({ trigger, items, align = 'start', label }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLButtonElement[]>([]);
  const openFocus = useRef<'first' | 'last'>('first');
  const typed = useRef({ text: '', at: 0 });

  const enabled = () => itemRefs.current.filter((el) => el && el.isConnected && !el.disabled);
  useEffect(() => {
    if (!open) return;
    const els = enabled();
    (openFocus.current === 'last' ? els[els.length - 1] : els[0])?.focus();
  }, [open]);

  const close = () => { setOpen(false); triggerRef.current?.focus(); };
  usePanelDismiss({ open, root: rootRef, onDismiss: (reason) => (reason === 'escape' ? close() : setOpen(false)) });
  usePlacement({ open, panel: menuRef, anchor: triggerRef, align });

  const show = (where: 'first' | 'last') => { openFocus.current = where; setOpen(true); };
  const onMenuKeyDown = (e: KeyboardEvent) => {
    const els = enabled();
    const i = els.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); els[(i + 1) % els.length]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); els[(i - 1 + els.length) % els.length]?.focus(); }
    else if (e.key === 'Home') { e.preventDefault(); els[0]?.focus(); }
    else if (e.key === 'End') { e.preventDefault(); els[els.length - 1]?.focus(); }
    else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Typeahead: letters typed within 500 ms add up ("de" finds "Delete"). The same letter again moves to the next match.
      const now = Date.now();
      typed.current = { text: (now - typed.current.at < 500 ? typed.current.text : '') + e.key.toLowerCase(), at: now };
      const text = typed.current.text;
      const repeat = [...text].every((c) => c === text[0]);
      const q = repeat ? text[0] : text;
      const after = [...els.slice(i + 1), ...els.slice(0, i + 1)];
      const order = repeat ? after : [els[i], ...after].filter(Boolean);
      order.find((el) => el.textContent?.trim().toLowerCase().startsWith(q))?.focus();
    }
  };

  const own = trigger.props as { onClick?: (e: MouseEvent) => void; onKeyDown?: (e: KeyboardEvent) => void };
  const ownRef = (trigger as unknown as { props: { ref?: Ref<HTMLElement> }; ref?: Ref<HTMLElement> }).props.ref ?? (trigger as unknown as { ref?: Ref<HTMLElement> }).ref;

  // Items that are gone (fewer items than before) are skipped by isConnected in enabled().
  let n = 0;
  return (
    <span className="rb-menu-anchor" ref={rootRef}>
      {cloneElement(trigger, {
        ref: (el: HTMLElement | null) => { triggerRef.current = el; setRef(ownRef, el); },
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? menuId : undefined,
        onClick: (e: MouseEvent) => { own.onClick?.(e); if (!e.defaultPrevented) { if (open) setOpen(false); else show('first'); } },
        onKeyDown: (e: KeyboardEvent) => {
          own.onKeyDown?.(e);
          if (e.defaultPrevented) return;
          if (e.key === 'ArrowDown') { e.preventDefault(); show('first'); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); show('last'); }
        },
      })}
      {open && (
        <div ref={menuRef} id={menuId} role="menu" aria-label={label} className={cx('rb-menu', align === 'end' && 'rb-menu--end')} onKeyDown={onMenuKeyDown}>
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
