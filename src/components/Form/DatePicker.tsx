import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cx } from '../../utils/cx';
import { ButtonIcon } from '../Button/Button';
import { Field, type FieldBaseProps } from './Field';
import './DatePicker.css';

/* ---------- date helpers (local time, no library) ---------- */
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const r = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate();
  return new Date(r.getFullYear(), r.getMonth(), Math.min(d.getDate(), last));
};
const sameDay = (a?: Date | null, b?: Date | null) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const key = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const pad2 = (n: number) => String(n).padStart(2, '0');
/** Formats as dd-mm-jjjj. */
export const formatDate = (d: Date) => `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`;
/** Parses dd-mm-jjjj (also with / or .). Returns null when the date does not exist. */
export const parseDate = (s: string): Date | null => {
  const m = s.trim().match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (!m) return null;
  const d = new Date(+m[3], +m[2] - 1, +m[1]);
  return d.getDate() === +m[1] && d.getMonth() === +m[2] - 1 ? d : null;
};

/* ---------- Calendar ---------- */
export interface CalendarProps {
  value?: Date | null;
  onChange?: (date: Date) => void;
  /** First month shown. Defaults to the month of `value`, or today. */
  defaultMonth?: Date;
  min?: Date;
  max?: Date;
  locale?: string;
  /** 1 = Monday (default), 0 = Sunday. */
  weekStartsOn?: 0 | 1;
  /** Move keyboard focus into the grid on mount (used by DatePicker). */
  autoFocus?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
}

export function Calendar({ value, onChange, defaultMonth, min, max, locale = 'nl-NL', weekStartsOn = 1, autoFocus, previousLabel = 'Vorige maand', nextLabel = 'Volgende maand', className }: CalendarProps) {
  const today = startOfDay(new Date());
  const [focused, setFocused] = useState<Date>(() => startOfDay(value ?? defaultMonth ?? today));
  const view = new Date(focused.getFullYear(), focused.getMonth(), 1);
  const grid = useRef<HTMLTableElement>(null);
  const moveFocus = useRef(Boolean(autoFocus));
  const titleId = useId();

  const isDisabled = (d: Date) => (min && d < startOfDay(min)) || (max && d > startOfDay(max)) || false;
  const weeks = useMemo(() => {
    const offset = (view.getDay() - weekStartsOn + 7) % 7;
    const start = addDays(view, -offset);
    return Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)));
  }, [view.getTime(), weekStartsOn]); // eslint-disable-line react-hooks/exhaustive-deps

  const weekdays = weeks[0].map((d) => ({
    short: d.toLocaleDateString(locale, { weekday: 'short' }).replace('.', ''),
    long: d.toLocaleDateString(locale, { weekday: 'long' }),
  }));

  useEffect(() => {
    if (!moveFocus.current) return;
    grid.current?.querySelector<HTMLButtonElement>(`[data-date="${key(focused)}"]`)?.focus();
  }, [focused]);

  const go = (d: Date) => { moveFocus.current = true; setFocused(d); };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const map: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -((focused.getDay() - weekStartsOn + 7) % 7)),
      End: () => addDays(focused, 6 - ((focused.getDay() - weekStartsOn + 7) % 7)),
      PageUp: () => addMonths(focused, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, e.shiftKey ? 12 : 1),
    };
    const next = map[e.key];
    if (next) { e.preventDefault(); go(next()); }
  };

  return (
    <div className={cx('rb-calendar', className)}>
      <div className="rb-calendar__header">
        <ButtonIcon hierarchy="tertiary" size="sm" icon={<ChevronLeft />} aria-label={previousLabel} onClick={() => { moveFocus.current = false; setFocused(addMonths(focused, -1)); }} />
        <h2 id={titleId} className="rb-calendar__title" aria-live="polite">
          {view.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
        </h2>
        <ButtonIcon hierarchy="tertiary" size="sm" icon={<ChevronRight />} aria-label={nextLabel} onClick={() => { moveFocus.current = false; setFocused(addMonths(focused, 1)); }} />
      </div>
      <table ref={grid} role="grid" aria-labelledby={titleId} className="rb-calendar__grid">
        <thead>
          <tr>{weekdays.map((w) => <th key={w.long} scope="col" abbr={w.long}>{w.short}</th>)}</tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={key(week[0])}>
              {week.map((d) => {
                const selected = sameDay(d, value);
                const outside = d.getMonth() !== view.getMonth();
                const disabled = isDisabled(d);
                return (
                  <td key={key(d)} aria-selected={selected || undefined}>
                    <button
                      type="button"
                      data-date={key(d)}
                      tabIndex={sameDay(d, focused) ? 0 : -1}
                      className={cx('rb-calendar__day', selected && 'is-selected', outside && 'is-outside', sameDay(d, today) && 'is-today')}
                      aria-current={sameDay(d, today) ? 'date' : undefined}
                      aria-label={d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      disabled={disabled}
                      onKeyDown={onKey}
                      onFocus={() => { if (!sameDay(d, focused)) setFocused(d); }}
                      onClick={() => onChange?.(d)}
                    >
                      {d.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- DatePicker ---------- */
export interface DatePickerProps extends FieldBaseProps {
  value?: Date | null;
  defaultValue?: Date | null;
  /** Called with a valid date, or null when the field is cleared or the text is not a valid date. */
  onChange?: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  name?: string;
  id?: string;
  placeholder?: string;
  /** Accessible name of the calendar button and popover. */
  calendarLabel?: string;
  className?: string;
}

/** Text input (dd-mm-jjjj) with a calendar popover. Typing always works; the calendar is an extra. */
export function DatePicker({ label, hideLabel, hint, error, required, size = 'md', value, defaultValue = null, onChange, min, max, disabled, name, id, placeholder = 'dd-mm-jjjj', calendarLabel = 'Kies een datum', className }: DatePickerProps) {
  const [own, setOwn] = useState<Date | null>(defaultValue);
  const date = value !== undefined ? value : own;
  const [text, setText] = useState(date ? formatDate(date) : '');
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const popId = useId();

  useEffect(() => { setText(date ? formatDate(date) : ''); }, [date?.getTime()]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const commit = (d: Date | null) => { if (value === undefined) setOwn(d); onChange?.(d); };
  const close = () => { setOpen(false); trigger.current?.focus(); };

  return (
    <Field id={id} label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} className={cx('rb-datepicker', className)}>
      {({ id: fieldId, describedBy, invalid }) => (
        <div ref={root} className="rb-datepicker__anchor">
          <div className={cx('rb-control', `rb-control--${size}`, invalid && 'rb-control--error', disabled && 'rb-control--disabled')}>
            <button
              ref={trigger}
              type="button"
              className="rb-control__trigger"
              aria-label={calendarLabel}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls={open ? popId : undefined}
              disabled={disabled}
              onClick={() => setOpen((o) => !o)}
            >
              <CalendarIcon aria-hidden="true" />
            </button>
            <input
              id={fieldId}
              name={name}
              className="rb-control__input"
              inputMode="numeric"
              autoComplete="off"
              placeholder={placeholder}
              value={text}
              disabled={disabled}
              required={required}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => { const d = text ? parseDate(text) : null; if (!sameDay(d, date) && !(d === null && date === null)) commit(d); }}
            />
          </div>
          {open && (
            <div id={popId} role="dialog" aria-label={calendarLabel} className="rb-datepicker__popover" onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } }}>
              <Calendar value={date} min={min} max={max} autoFocus onChange={(d) => { commit(d); close(); }} />
            </div>
          )}
        </div>
      )}
    </Field>
  );
}
