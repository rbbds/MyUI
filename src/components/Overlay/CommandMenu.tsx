import { forwardRef, useEffect, useId, useMemo, useRef, useState, type DialogHTMLAttributes, type ReactNode } from 'react';
import { Search } from 'lucide-react';
import { cx } from '../../utils/cx';
import { useModalDialog } from '../../utils/dialog';
import { mergeLabels } from '../../utils/labels';
import { mergeRefs } from '../../utils/refs';
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

export interface CommandMenuProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'onClose'> {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  /** Accessible name of the dialog and the result list. */
  label?: string;
  placeholder?: string;
  emptyText?: string;
  /** Show the keyboard hints footer. */
  showHints?: boolean;
  /** @deprecated Use labels.navigate, labels.select and labels.close. Removed in 2.0.0. */
  hintLabels?: { navigate: string; select: string; close: string };
  /** Names of the search field and the result list, the key cap and the result count that screen readers hear. */
  labels?: Partial<CommandMenuLabels>;
}

export interface CommandMenuLabels {
  search: string;
  results: string;
  escapeKey: string;
  count: (count: number) => string;
  /** Words in the keyboard hints footer. */
  navigate: string;
  select: string;
  close: string;
}
export const DEFAULT_COMMAND_MENU_LABELS: CommandMenuLabels = {
  search: 'Search', results: 'Results', escapeKey: 'Esc', count: (count) => `${count} ${count === 1 ? 'result' : 'results'}`,
  navigate: 'navigate', select: 'open', close: 'close',
};
const safeId = (id: string) => id.replace(/[^\w-]/g, '_');

/**
 * Keyboard-first search over pages and actions. Combobox (input) + listbox (results);
 * arrow keys move aria-activedescendant, Enter runs the item, Escape closes.
 */
export const CommandMenu = forwardRef<HTMLDialogElement, CommandMenuProps>(function CommandMenu({ open, onClose, items, label = 'Commands', placeholder = 'Search or type a command…', emptyText = 'No results found.', showHints = true, hintLabels, labels, className, ...rest }, ref) {
  const l = mergeLabels(DEFAULT_COMMAND_MENU_LABELS, labels, hintLabels);
  const list = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const base = useId();
  const optId = (it: CommandItem) => `${base}-o-${safeId(it.id)}`;
  const dialog = useModalDialog({ open, onClose, onOpen: () => { setQuery(''); setActive(0); } });
  const dialogRef = useMemo(() => mergeRefs(dialog.ref, ref), [dialog.ref, ref]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => !q || [i.label, ...(i.keywords ?? [])].some((t) => t.toLowerCase().includes(q)));
  }, [items, query]);
  const enabled = results.filter((r) => !r.disabled);
  const current = enabled[Math.min(active, enabled.length - 1)];

  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => {
    if (current) list.current?.querySelector(`#${CSS.escape(optId(current))}`)?.scrollIntoView({ block: 'nearest' });
  }, [current, base]); // eslint-disable-line react-hooks/exhaustive-deps

  const run = (item?: CommandItem) => { if (!item || item.disabled) return; onClose(); item.onSelect(); };
  const groups = results.reduce<Record<string, CommandItem[]>>((acc, r) => { (acc[r.group ?? ''] ??= []).push(r); return acc; }, {});

  return (
    <dialog {...rest} {...dialog} ref={dialogRef} className={cx('rb-command', className)} aria-label={label}>
      <div className="rb-command__panel">
        <div className="rb-command__search">
          <Search aria-hidden="true" />
          <input
            className="rb-command__input"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${base}-list`}
            aria-autocomplete="list"
            aria-activedescendant={current ? optId(current) : undefined}
            aria-label={l.search}
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
          <Kbd aria-hidden="true">{l.escapeKey}</Kbd>
        </div>
        {/* One live region that is always there: it announces the number of results while you type. */}
        <p className="rb-visually-hidden" role="status">{open && query.trim() ? (results.length ? l.count(results.length) : emptyText) : ''}</p>
        <div ref={list} id={`${base}-list`} role="listbox" aria-label={l.results} className="rb-command__list">
          {results.length === 0 && <p className="rb-command__empty" aria-hidden="true">{emptyText}</p>}
          {Object.entries(groups).map(([group, its], gi) => (
            <div key={group} role="group" aria-labelledby={group ? `${base}-g${gi}` : undefined}>
              {group && <div id={`${base}-g${gi}`} className="rb-command__group" role="presentation">{group}</div>}
              {its.map((it) => (
                <div
                  key={it.id}
                  id={optId(it)}
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
            <span><Kbd>↑</Kbd><Kbd>↓</Kbd> {l.navigate}</span>
            <span><Kbd>↵</Kbd> {l.select}</span>
            <span><Kbd>{l.escapeKey}</Kbd> {l.close}</span>
          </div>
        )}
      </div>
    </dialog>
  );
});

/** Opens something on ⌘K (Mac) or Ctrl+K (Windows/Linux). */
export function useCommandShortcut(onOpen: () => void, key = 'k') {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key) { e.preventDefault(); onOpen(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onOpen, key]);
}
