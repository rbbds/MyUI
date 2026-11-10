import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { Search } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Kbd } from '../Display/Feedback';
import './CommandMenu.css';

export interface CommandItem {
  id: string;
  label: string;
  /** Heading the item is grouped under, e.g. "Pages" or "Actions". */
  group?: string;
  icon?: ReactNode;
  /** Shortcut hint, e.g. "⌘N". Display only. */
  shortcut?: string;
  /** Extra search terms. */
  keywords?: string[];
  disabled?: boolean;
  onSelect: () => void;
}

export interface CommandMenuProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  /** Accessible name of the dialog and the result list. */
  label?: string;
  placeholder?: string;
  emptyText?: string;
  /** Show the keyboard hints footer. */
  showHints?: boolean;
  hintLabels?: { navigate: string; select: string; close: string };
}

/**
 * Keyboard-first search over pages and actions. Combobox (input) + listbox (results);
 * arrow keys move aria-activedescendant, Enter runs the item, Escape closes.
 */
export function CommandMenu({ open, onClose, items, label = 'Commands', placeholder = 'Search or type a command…', emptyText = 'No results found.', showHints = true, hintLabels = { navigate: 'navigate', select: 'open', close: 'close' } }: CommandMenuProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const base = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) { setQuery(''); setActive(0); d.showModal(); }
    if (!open && d.open) d.close();
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => !q || [i.label, ...(i.keywords ?? [])].some((t) => t.toLowerCase().includes(q)));
  }, [items, query]);
  const enabled = results.filter((r) => !r.disabled);
  const current = enabled[Math.min(active, enabled.length - 1)];

  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => {
    if (current) list.current?.querySelector(`#${CSS.escape(`${base}-${current.id}`)}`)?.scrollIntoView({ block: 'nearest' });
  }, [current, base]);

  const run = (item?: CommandItem) => { if (!item || item.disabled) return; onClose(); item.onSelect(); };
  const groups = results.reduce<Record<string, CommandItem[]>>((acc, r) => { (acc[r.group ?? ''] ??= []).push(r); return acc; }, {});

  return (
    <dialog
      ref={ref}
      className="rb-command"
      aria-label={label}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <div className="rb-command__panel">
        <div className="rb-command__search">
          <Search aria-hidden="true" />
          <input
            className="rb-command__input"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${base}-list`}
            aria-autocomplete="list"
            aria-activedescendant={current ? `${base}-${current.id}` : undefined}
            aria-label={label}
            placeholder={placeholder}
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (enabled.length ? (a + 1) % enabled.length : 0)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (enabled.length ? (a - 1 + enabled.length) % enabled.length : 0)); }
              else if (e.key === 'Enter') { e.preventDefault(); run(current); }
            }}
          />
          <Kbd aria-hidden="true">Esc</Kbd>
        </div>
        <div ref={list} id={`${base}-list`} role="listbox" aria-label={label} className="rb-command__list">
          {results.length === 0 && <p className="rb-command__empty" role="status">{emptyText}</p>}
          {Object.entries(groups).map(([group, its], gi) => (
            <div key={group} role="group" aria-labelledby={group ? `${base}-g${gi}` : undefined}>
              {group && <div id={`${base}-g${gi}`} className="rb-command__group" role="presentation">{group}</div>}
              {its.map((it) => (
                <div
                  key={it.id}
                  id={`${base}-${it.id}`}
                  role="option"
                  aria-selected={it === current}
                  aria-disabled={it.disabled || undefined}
                  className={cx('rb-command__item', it === current && 'is-active', it.disabled && 'is-disabled')}
                  onMouseMove={() => { const i = enabled.indexOf(it); if (i >= 0 && i !== active) setActive(i); }}
                  onClick={() => run(it)}
                >
                  {it.icon && <span className="rb-command__icon" aria-hidden="true">{it.icon}</span>}
                  <span className="rb-command__label">{it.label}</span>
                  {it.shortcut && <Kbd aria-hidden="true">{it.shortcut}</Kbd>}
                </div>
              ))}
            </div>
          ))}
        </div>
        {showHints && (
          <div className="rb-command__footer" aria-hidden="true">
            <span><Kbd>↑</Kbd><Kbd>↓</Kbd> {hintLabels.navigate}</span>
            <span><Kbd>↵</Kbd> {hintLabels.select}</span>
            <span><Kbd>Esc</Kbd> {hintLabels.close}</span>
          </div>
        )}
      </div>
    </dialog>
  );
}

/** Opens something on ⌘K (Mac) or Ctrl+K (Windows/Linux). */
export function useCommandShortcut(onOpen: () => void, key = 'k') {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key) { e.preventDefault(); onOpen(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onOpen, key]);
}
