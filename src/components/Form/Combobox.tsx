import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Field, type FieldBaseProps } from './Field';
import { usePlacement } from '../../utils/panel';
import './Combobox.css';

export interface ComboboxOption {
  value: string;
  label: string;
  /** Leading visual, e.g. a `<Flag code="NL" />`, an avatar or a lucide icon. Decorative. */
  icon?: ReactNode;
  /** Heading the option is grouped under. Options are shown in the order given. */
  group?: string;
  /** Extra search terms, e.g. an ISO code or an English name. */
  keywords?: string[];
  disabled?: boolean;
}

export interface ComboboxProps extends FieldBaseProps {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null, option: ComboboxOption | null) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  emptyText?: string;
  /** Accessible label of the chevron button. */
  toggleLabel?: string;
  className?: string;
}

const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

/**
 * Select with search and a visual per option (APG "combobox with listbox popup").
 * Use it when a native select is not enough: long lists that need filtering, or options that need a flag or avatar.
 */
export function Combobox({ label, hideLabel, hint, error, required, size = 'md', options, value, defaultValue = null, onChange, placeholder = 'Choose or type to search', disabled, name, id, emptyText = 'No results', toggleLabel = 'Show options', className }: ComboboxProps) {
  const [own, setOwn] = useState<string | null>(defaultValue);
  const selectedValue = value !== undefined ? value : own;
  const selected = options.find((o) => o.value === selectedValue) ?? null;
  const [text, setText] = useState(selected?.label ?? '');
  const [query, setQuery] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const control = useRef<HTMLDivElement>(null);
  const base = useId();

  useEffect(() => { if (query === null) setText(selected?.label ?? ''); }, [selected?.label, query]);

  const results = useMemo(() => {
    if (!query) return options;
    const q = norm(query.trim());
    return options.filter((o) => [o.label, ...(o.keywords ?? [])].some((t) => norm(t).includes(q)));
  }, [options, query]);
  const enabled = results.filter((r) => !r.disabled);
  const current = open ? enabled[Math.min(active, enabled.length - 1)] : undefined;
  const optId = (o: ComboboxOption) => `${base}-o-${o.value.replace(/[^\w-]/g, '_')}`;

  useEffect(() => {
    if (current) list.current?.querySelector(`#${CSS.escape(optId(current))}`)?.scrollIntoView({ block: 'nearest' });
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) close(); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  usePlacement({ open, panel: list, anchor: control, matchWidth: true });

  const openList = () => {
    if (disabled || open) return;
    const i = selected ? enabled.indexOf(selected) : 0;
    setActive(i < 0 ? 0 : i);
    setOpen(true);
  };
  const close = () => { setOpen(false); setQuery(null); };
  const pick = (o?: ComboboxOption) => {
    if (!o || o.disabled) return;
    if (value === undefined) setOwn(o.value);
    onChange?.(o.value, o);
    close();
    setText(o.label);
    input.current?.focus();
  };
  const groups = results.reduce<{ name: string; items: ComboboxOption[] }[]>((acc, r) => {
    const g = r.group ?? '';
    const last = acc[acc.length - 1];
    if (last && last.name === g) last.items.push(r); else acc.push({ name: g, items: [r] });
    return acc;
  }, []);

  return (
    <Field id={id} label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} className={cx('rb-combobox', className)}>
      {({ id: fieldId, describedBy, invalid }) => (
        <div ref={root} className="rb-combobox__anchor">
          <div ref={control} className={cx('rb-control', `rb-control--${size}`, Boolean(selected?.icon) && 'rb-control--has-icon', invalid && 'rb-control--error', disabled && 'rb-control--disabled')}>
            {selected?.icon && query === null && <span className="rb-control__icon rb-combobox__value-icon" aria-hidden="true">{selected.icon}</span>}
            <input
              ref={input}
              id={fieldId}
              className="rb-control__input"
              role="combobox"
              aria-expanded={open}
              aria-controls={`${base}-list`}
              aria-autocomplete="list"
              aria-activedescendant={current ? optId(current) : undefined}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              autoComplete="off"
              placeholder={placeholder}
              value={query ?? text}
              disabled={disabled}
              required={required}
              onClick={openList}
              onChange={(e) => { setQuery(e.target.value); setActive(0); setOpen(true); }}
              onBlur={(e) => { if (!root.current?.contains(e.relatedTarget as Node)) close(); }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) openList(); else setActive((a) => (enabled.length ? (a + 1) % enabled.length : 0)); }
                else if (e.key === 'ArrowUp') { e.preventDefault(); if (!open) openList(); else setActive((a) => (enabled.length ? (a - 1 + enabled.length) % enabled.length : 0)); }
                else if (e.key === 'Home' && open) { e.preventDefault(); setActive(0); }
                else if (e.key === 'End' && open) { e.preventDefault(); setActive(enabled.length - 1); }
                else if (e.key === 'Enter' && open) { e.preventDefault(); pick(current); }
                else if (e.key === 'Escape') { if (open) { e.preventDefault(); e.stopPropagation(); close(); } }
                else if (e.key === 'Tab' && open && query) { pick(current); }
              }}
            />
            {name && <input type="hidden" name={name} value={selectedValue ?? ''} />}
            <button type="button" tabIndex={-1} className="rb-combobox__toggle" aria-label={toggleLabel} aria-expanded={open} aria-controls={`${base}-list`} disabled={disabled} onClick={() => { if (open) close(); else { openList(); input.current?.focus(); } }}>
              <ChevronDown aria-hidden="true" className={cx(open && 'is-open')} />
            </button>
          </div>
          <div ref={list} id={`${base}-list`} role="listbox" aria-label={typeof label === 'string' ? label : undefined} className="rb-combobox__list" hidden={!open}>
            {open && results.length === 0 && <p className="rb-combobox__empty" role="status">{emptyText}</p>}
            {open && groups.map((g, gi) => (
              <div key={`${g.name}-${gi}`} role="group" aria-labelledby={g.name ? `${base}-g${gi}` : undefined} className="rb-combobox__group">
                {g.name && <div id={`${base}-g${gi}`} className="rb-combobox__group-label" role="presentation">{g.name}</div>}
                {g.items.map((o) => (
                  <div
                    key={o.value}
                    id={optId(o)}
                    role="option"
                    aria-selected={o === selected}
                    aria-disabled={o.disabled || undefined}
                    className={cx('rb-combobox__option', o === current && 'is-active', o === selected && 'is-selected', o.disabled && 'is-disabled')}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseMove={() => { const i = enabled.indexOf(o); if (i >= 0 && i !== active) setActive(i); }}
                    onClick={() => pick(o)}
                  >
                    {o.icon && <span className="rb-combobox__option-icon" aria-hidden="true">{o.icon}</span>}
                    <span className="rb-combobox__option-label">{o.label}</span>
                    {o === selected && <Check aria-hidden="true" className="rb-combobox__check" />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </Field>
  );
}
