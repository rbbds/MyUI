import { forwardRef, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cx } from '../../utils/cx';
import { useLabels, useLocale } from '../../utils/locale';
import { useControlled } from '../../utils/useControlled';
import { ButtonIcon } from '../Button/Button';
import { Field, type FieldBaseProps } from './Field';
import { usePanelDismiss, usePlacement } from '../../utils/panel';
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
type DatePart = 'd' | 'm' | 'y';
const orderCache = new Map<string, { order: DatePart[]; sep: string }>();
/** Order of day, month and year and the separator for a locale, e.g. en-US gives m/d/y. */
export const dateOrder = (locale = 'en-US') => {
  let o = orderCache.get(locale);
  if (!o) {
    const parts = new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).formatToParts(new Date(2001, 10, 22));
    const order = parts.filter((p) => p.type === 'day' || p.type === 'month' || p.type === 'year').map((p) => p.type[0] as DatePart);
    o = { order: order.length === 3 ? order : ['m', 'd', 'y'], sep: parts.find((p) => p.type === 'literal')?.value.trim() || '/' };
    orderCache.set(locale, o);
  }
  return o;
};
/** Placeholder that matches the locale, e.g. "mm/dd/yyyy" for en-US or "dd-mm-yyyy" for nl-NL. */
export const datePlaceholder = (locale = 'en-US') => {
  const { order, sep } = dateOrder(locale);
  return order.map((p) => (p === 'd' ? 'dd' : p === 'm' ? 'mm' : 'yyyy')).join(sep);
};
/** Formats a date as numbers in the order of the locale. Default en-US: mm/dd/yyyy. */
export const formatDate = (d: Date, locale = 'en-US') => {
  const { order, sep } = dateOrder(locale);
  return order.map((p) => (p === 'd' ? pad2(d.getDate()) : p === 'm' ? pad2(d.getMonth() + 1) : String(d.getFullYear()))).join(sep);
};
/** Parses a typed date in the order of the locale (separator -, / or .). Returns null when the date does not exist. */
export const parseDate = (s: string, locale = 'en-US'): Date | null => {
  const m = s.trim().match(/^(\d{1,4})[-/.](\d{1,2})[-/.](\d{1,4})$/);
  if (!m) return null;
  const { order } = dateOrder(locale);
  const v: Record<DatePart, number> = { d: 0, m: 0, y: 0 };
  order.forEach((p, i) => { v[p] = +m[i + 1]; });
  if (v.y < 1000) return null;
  const d = new Date(v.y, v.m - 1, v.d);
  return d.getDate() === v.d && d.getMonth() === v.m - 1 ? d : null;
};

/* ---------- Calendar ---------- */
export type CalendarView = 'day' | 'month' | 'year';

export interface CalendarProps {
  value?: Date | null;
  /** Called with the chosen day. */
  onValueChange?: (date: Date) => void;
  /** @deprecated Use onValueChange. Removed in 2.0.0. */
  onChange?: (date: Date) => void;
  /** Month shown when there is no value. Defaults to today. */
  defaultMonth?: Date;
  min?: Date;
  max?: Date;
  disablePast?: boolean;
  disableFuture?: boolean;
  /** Return true to disable a specific day. */
  shouldDisableDate?: (date: Date) => boolean;
  /** Enabled views, in order. Defaults to `['year', 'day']`, like MUI. */
  views?: CalendarView[];
  /** View shown first. Defaults to `day` when enabled. */
  openTo?: CalendarView;
  /** Show the days of the previous and next month in the grid. Off by default. */
  showDaysOutsideCurrentMonth?: boolean;
  /** Always render this many weeks (e.g. 6) so the height never changes. */
  fixedWeekNumber?: number;
  yearsPerRow?: 3 | 4;
  yearsOrder?: 'asc' | 'desc';
  locale?: string;
  /** 1 = Monday (default), 0 = Sunday. */
  weekStartsOn?: 0 | 1;
  /** Move keyboard focus into the grid on mount (used by DatePicker). */
  autoFocus?: boolean;
  labels?: Partial<CalendarLabels>;
  /** @deprecated Use labels.previous. Removed in 2.0.0. */
  previousLabel?: string;
  /** @deprecated Use labels.next. Removed in 2.0.0. */
  nextLabel?: string;
  /** Accessible label of the view switch button. Receives the view that opens on click. */
  /** @deprecated Use labels.switchView. Removed in 2.0.0. */
  switchViewLabel?: (next: CalendarView) => string;
  /** Range mode (used by DateRangePicker): start and end of the selected range. */
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  /** Called while hovering or focusing a day, to preview a range. */
  onDayHover?: (date: Date | null) => void;
  /** Controlled visible month (first day). Use with onMonthChange, e.g. for two calendars side by side. */
  month?: Date;
  onMonthChange?: (month: Date) => void;
  hidePrevious?: boolean;
  hideNext?: boolean;
  className?: string;
}

const DEFAULT_MIN = new Date(1900, 0, 1);
const DEFAULT_MAX = new Date(2099, 11, 31);
export interface CalendarLabels {
  previous: string;
  next: string;
  /** Name of the view switch button. Receives the view that opens on click. */
  switchView: (next: CalendarView) => string;
}
export const DEFAULT_CALENDAR_LABELS: CalendarLabels = {
  previous: 'Previous month',
  next: 'Next month',
  switchView: (v) => (v === 'year' ? 'Choose a year' : v === 'month' ? 'Choose a month' : 'Back to days'),
};

export function Calendar({
  value, onValueChange, onChange, defaultMonth, min, max, disablePast, disableFuture, shouldDisableDate,
  views = ['year', 'day'], openTo, showDaysOutsideCurrentMonth = false, fixedWeekNumber,
  yearsPerRow = 3, yearsOrder = 'asc', locale: localeProp, weekStartsOn = 1, autoFocus,
  labels, previousLabel, nextLabel, switchViewLabel,
  rangeStart, rangeEnd, onDayHover, month: monthProp, onMonthChange, hidePrevious, hideNext, className,
}: CalendarProps) {
  const locale = useLocale(localeProp);
  const l = useLabels('calendar', DEFAULT_CALENDAR_LABELS, labels, { previous: previousLabel, next: nextLabel, switchView: switchViewLabel });
  const choose = (d: Date) => { onValueChange?.(d); onChange?.(d); };
  const today = startOfDay(new Date());
  const lo = startOfDay(new Date(Math.max((min ?? DEFAULT_MIN).getTime(), disablePast ? today.getTime() : -Infinity)));
  const hi = startOfDay(new Date(Math.min((max ?? DEFAULT_MAX).getTime(), disableFuture ? today.getTime() : Infinity)));
  const clamp = (d: Date) => (d < lo ? lo : d > hi ? hi : d);

  const [view, setView] = useState<CalendarView>(() => (openTo && views.includes(openTo) ? openTo : views.includes('day') ? 'day' : views[0]));
  const [focusedRaw, setFocusedRaw] = useState<Date>(() => clamp(startOfDay(monthProp ?? value ?? rangeStart ?? defaultMonth ?? today)));
  /* controlled month: keep the focused day inside the shown month */
  const inShown = !monthProp || (focusedRaw.getFullYear() === monthProp.getFullYear() && focusedRaw.getMonth() === monthProp.getMonth());
  const focused = inShown ? focusedRaw : clamp(new Date(monthProp!.getFullYear(), monthProp!.getMonth(), 1));
  const setFocused = (d: Date) => {
    setFocusedRaw(d);
    if (monthProp && onMonthChange && (d.getFullYear() !== monthProp.getFullYear() || d.getMonth() !== monthProp.getMonth())) onMonthChange(new Date(d.getFullYear(), d.getMonth(), 1));
  };
  const month = new Date(focused.getFullYear(), focused.getMonth(), 1);
  const body = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(Boolean(autoFocus));
  const titleId = useId();

  const isDisabled = (d: Date) => d < lo || d > hi || Boolean(shouldDisableDate?.(d));
  const monthDisabled = (y: number, m: number) => new Date(y, m + 1, 0) < lo || new Date(y, m, 1) > hi;
  const yearDisabled = (y: number) => y < lo.getFullYear() || y > hi.getFullYear();

  const weeks = useMemo(() => {
    const offset = (month.getDay() - weekStartsOn + 7) % 7;
    const start = addDays(month, -offset);
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const count = fixedWeekNumber ?? Math.ceil((offset + daysInMonth) / 7);
    return Array.from({ length: count }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)));
  }, [month.getTime(), weekStartsOn, fixedWeekNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  const weekdays = weeks[0].map((d) => ({
    narrow: d.toLocaleDateString(locale, { weekday: 'narrow' }).toUpperCase(),
    long: d.toLocaleDateString(locale, { weekday: 'long' }),
  }));

  const years = useMemo(() => {
    const list = Array.from({ length: hi.getFullYear() - lo.getFullYear() + 1 }, (_, i) => lo.getFullYear() + i);
    return yearsOrder === 'desc' ? list.reverse() : list;
  }, [lo.getTime(), hi.getTime(), yearsOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  /* focus management: move DOM focus to the focused cell of the current view */
  useEffect(() => {
    const el = body.current?.querySelector<HTMLButtonElement>('[tabindex="0"]');
    if (!el) return;
    if (view === 'year') el.scrollIntoView?.({ block: 'center' });
    if (moveFocus.current) el.focus();
  }, [focused.getTime(), view]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (d: Date) => { moveFocus.current = true; setFocused(clamp(d)); };
  /* M6: skip unavailable days. Walk in the direction of the key; stay put when nothing is available that way. */
  const goDay = (target: Date, dir: 1 | -1) => {
    let d = clamp(target);
    while (isDisabled(d)) {
      const n = addDays(d, dir);
      if (n < lo || n > hi) return;
      d = n;
    }
    go(d);
  };
  const nextView = (from: CalendarView) => views[views.indexOf(from) + 1] ?? null;
  /* MUI: the header button toggles between the day view and the first other view */
  const switchTarget: CalendarView | null = view === 'day' ? (views.find((v) => v !== 'day') ?? null) : views.includes('day') ? 'day' : null;
  const toView = (v: CalendarView) => { moveFocus.current = true; setView(v); };

  const pickYear = (y: number) => {
    const d = clamp(new Date(y, focused.getMonth(), Math.min(focused.getDate(), new Date(y, focused.getMonth() + 1, 0).getDate())));
    setFocused(d);
    const n = nextView('year');
    if (n) toView(n); else choose(d);
  };
  const pickMonth = (m: number) => {
    const y = focused.getFullYear();
    const d = clamp(new Date(y, m, Math.min(focused.getDate(), new Date(y, m + 1, 0).getDate())));
    setFocused(d);
    const n = nextView('month');
    if (n) toView(n); else choose(d);
  };

  const onDayKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const dow = (focused.getDay() - weekStartsOn + 7) % 7;
    const map: Record<string, [() => Date, 1 | -1]> = {
      ArrowLeft: [() => addDays(focused, -1), -1],
      ArrowRight: [() => addDays(focused, 1), 1],
      ArrowUp: [() => addDays(focused, -7), -1],
      ArrowDown: [() => addDays(focused, 7), 1],
      Home: [() => addDays(focused, -dow), 1],
      End: [() => addDays(focused, 6 - dow), -1],
      PageUp: [() => addMonths(focused, e.shiftKey ? -12 : -1), -1],
      PageDown: [() => addMonths(focused, e.shiftKey ? 12 : 1), 1],
    };
    const next = map[e.key];
    if (next) { e.preventDefault(); goDay(next[0](), next[1]); }
  };
  const gridKey = (e: KeyboardEvent<HTMLButtonElement>, perRow: number, step: (n: number) => Date) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -perRow, ArrowDown: perRow };
    const n = map[e.key];
    if (n !== undefined) { e.preventDefault(); go(step(n)); }
  };
  const yearStep = (n: number) => addMonths(focused, n * 12);
  const monthStep = (n: number) => addMonths(focused, n);

  const monthLabel = month.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const canPrev = !monthDisabled(addMonths(month, -1).getFullYear(), addMonths(month, -1).getMonth());
  const canNext = !monthDisabled(addMonths(month, 1).getFullYear(), addMonths(month, 1).getMonth());
  const shiftMonth = (n: number) => { moveFocus.current = false; setFocused(clamp(addMonths(focused, n))); };

  return (
    <div className={cx('rb-calendar', `rb-calendar--${view}`, className)}>
      <div className="rb-calendar__header">
        {switchTarget ? (
          <button
            type="button"
            className="rb-calendar__switch"
            aria-label={`${monthLabel}, ${l.switchView(switchTarget)}`}
            aria-expanded={view !== 'day'}
            onClick={() => toView(switchTarget)}
          >
            <span id={titleId} aria-live="polite">{monthLabel}</span>
            <ChevronDown aria-hidden="true" className={cx('rb-calendar__switch-icon', view !== 'day' && 'is-open')} />
          </button>
        ) : (
          <span id={titleId} className="rb-calendar__title" aria-live="polite">{monthLabel}</span>
        )}
        {view === 'day' && (
          <div className="rb-calendar__arrows">
            {!hidePrevious && <ButtonIcon hierarchy="tertiary" size="sm" icon={<ChevronLeft />} aria-label={l.previous} disabled={!canPrev} onClick={() => shiftMonth(-1)} />}
            {!hideNext && <ButtonIcon hierarchy="tertiary" size="sm" icon={<ChevronRight />} aria-label={l.next} disabled={!canNext} onClick={() => shiftMonth(1)} />}
          </div>
        )}
      </div>

      <div ref={body} className="rb-calendar__body" onMouseLeave={() => onDayHover?.(null)}>
        {view === 'day' && (
          <table role="grid" aria-labelledby={titleId} className="rb-calendar__grid">
            <thead>
              <tr>{weekdays.map((w) => <th key={w.long} scope="col"><span aria-hidden="true">{w.narrow}</span><span className="rb-visually-hidden">{w.long}</span></th>)}</tr>
            </thead>
            <tbody>
              {weeks.map((week) => (
                <tr key={key(week[0])}>
                  {week.map((d) => {
                    const outside = d.getMonth() !== month.getMonth();
                    if (outside && !showDaysOutsideCurrentMonth) return <td key={key(d)} aria-hidden="true" />;
                    const isStart = sameDay(d, rangeStart ?? null);
                    const isEnd = sameDay(d, rangeEnd ?? null);
                    const inRange = !!rangeStart && !!rangeEnd && d > rangeStart && d < rangeEnd;
                    const selected = sameDay(d, value) || isStart || isEnd;
                    const hasRange = !!rangeStart && !!rangeEnd && !sameDay(rangeStart, rangeEnd);
                    const off = isDisabled(d);
                    return (
                      <td key={key(d)} aria-selected={selected || inRange || undefined}
                        className={cx(inRange && 'is-in-range', hasRange && isStart && 'is-range-start', hasRange && isEnd && 'is-range-end')}>
                        <button
                          type="button"
                          data-date={key(d)}
                          tabIndex={sameDay(d, focused) ? 0 : -1}
                          className={cx('rb-calendar__day', selected && 'is-selected', outside && 'is-outside', sameDay(d, today) && 'is-today')}
                          aria-current={sameDay(d, today) ? 'date' : undefined}
                          aria-label={d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                          aria-disabled={off || undefined}
                          onKeyDown={onDayKey}
                          onFocus={() => { if (!sameDay(d, focused)) setFocused(d); if (!off) onDayHover?.(d); }}
                          onMouseEnter={() => { if (!off) onDayHover?.(d); }}
                          onClick={() => { if (!off) choose(d); }}
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
        )}

        {view === 'month' && (
          <div role="radiogroup" aria-label={l.switchView('month')} className="rb-calendar__cells rb-calendar__cells--3">
            {Array.from({ length: 12 }, (_, m) => {
              const y = focused.getFullYear();
              const selected = !!value && value.getFullYear() === y && value.getMonth() === m;
              const isCurrent = today.getFullYear() === y && today.getMonth() === m;
              return (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={new Date(y, m, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
                  tabIndex={focused.getMonth() === m ? 0 : -1}
                  className={cx('rb-calendar__cell', selected && 'is-selected', isCurrent && 'is-today')}
                  disabled={monthDisabled(y, m)}
                  onKeyDown={(e) => gridKey(e, 3, monthStep)}
                  onClick={() => pickMonth(m)}
                >
                  {new Date(y, m, 1).toLocaleDateString(locale, { month: 'short' }).replace('.', '')}
                </button>
              );
            })}
          </div>
        )}

        {view === 'year' && (
          <div role="radiogroup" aria-label={l.switchView('year')} className={cx('rb-calendar__cells', 'rb-calendar__cells--years', `rb-calendar__cells--${yearsPerRow}`)}>
            {years.map((y) => {
              const selected = value?.getFullYear() === y;
              return (
                <button
                  key={y}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={focused.getFullYear() === y ? 0 : -1}
                  className={cx('rb-calendar__cell', selected && 'is-selected', today.getFullYear() === y && 'is-today')}
                  disabled={yearDisabled(y)}
                  onKeyDown={(e) => gridKey(e, yearsPerRow, (n) => yearStep(yearsOrder === 'desc' ? -n : n))}
                  onClick={() => pickYear(y)}
                >
                  {y}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- DatePicker ---------- */
/** Why the value changed. `valid`: a date was typed or picked. `empty`: the field was cleared. `invalid`: the text is not a date. `unavailable`: the date exists but cannot be chosen (min, max, disablePast, disableFuture, shouldDisableDate). */
export type DateChangeReason = 'valid' | 'empty' | 'invalid' | 'unavailable';
export interface DateChangeDetails { reason: DateChangeReason }

export interface DatePickerProps extends FieldBaseProps {
  value?: Date | null;
  defaultValue?: Date | null;
  /** Called with a valid date, or null with a reason when the field is cleared, the text is not a date or the date is unavailable. */
  onValueChange?: (date: Date | null, details: DateChangeDetails) => void;
  /** @deprecated Use onValueChange. Removed in 2.0.0. */
  onChange?: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  name?: string;
  id?: string;
  /** Placeholder. Default: the date pattern of the locale, e.g. mm/dd/yyyy. */
  placeholder?: string;
  /** Locale for the typed date order, month and day names. Default en-US. Use e.g. nl-NL for dd-mm-yyyy. */
  locale?: string;
  /** Hide the format ("Format: MM/DD/YYYY") after the hint. Only when the format is clear from the label or the page. */
  hideFormat?: boolean;
  /** Texts: names, the format hint and the built-in error messages. */
  labels?: Partial<DatePickerLabels>;
  /** @deprecated Use labels.calendar. Removed in 2.0.0. */
  calendarLabel?: string;
  /** Extra Calendar options (views, openTo, disablePast, shouldDisableDate, …). */
  calendarProps?: Omit<CalendarProps, 'value' | 'onChange' | 'onValueChange' | 'min' | 'max' | 'autoFocus'>;
  className?: string;
}

export interface DatePickerLabels {
  /** Name of the calendar button and popover. */
  calendar: string;
  /** Format shown after the hint. Receives the pattern, e.g. MM/DD/YYYY. */
  format: (pattern: string) => string;
  /** Error when the text is not a date. Receives the pattern. */
  invalid: (pattern: string) => string;
  /** Error when the date cannot be chosen. Receives the first and last date that can, formatted, when known. */
  unavailable: (range: { min?: string; max?: string }) => string;
}
export const DEFAULT_DATE_PICKER_LABELS: DatePickerLabels = {
  calendar: 'Choose a date',
  format: (p) => `Format: ${p}`,
  invalid: (p) => `Enter a date as ${p}.`,
  unavailable: ({ min, max }) =>
    min && max ? `Choose a date between ${min} and ${max}.` : min ? `Choose a date on or after ${min}.` : max ? `Choose a date on or before ${max}.` : 'This date is not available. Choose another date.',
};

/** Text input (date in the order of the locale) with a calendar popover. Typing always works; the calendar is an extra. */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker({ label, hideLabel, hint, error, required, size = 'md', value, defaultValue = null, onValueChange, onChange, min, max, disabled, name, id, locale: localeProp, placeholder, hideFormat, labels, calendarLabel, calendarProps, className }, ref) {
  const locale = useLocale(localeProp);
  const l = useLabels('datePicker', DEFAULT_DATE_PICKER_LABELS, labels, { calendar: calendarLabel });
  const [date, commit] = useControlled<Date | null>(value, defaultValue);
  const [text, setText] = useState(date ? formatDate(date, locale) : '');
  const [problem, setProblem] = useState<'invalid' | 'unavailable' | null>(null);
  const lastReason = useRef<DateChangeReason>(date ? 'valid' : 'empty');
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const popId = useId();
  const pattern = datePlaceholder(locale).toUpperCase();

  /* the same limits as the calendar, so typing cannot choose what clicking cannot */
  const today = startOfDay(new Date());
  const lo = [min && startOfDay(min), calendarProps?.disablePast && today].filter(Boolean).reduce<Date | undefined>((a, b) => (!a || b! > a ? (b as Date) : a), undefined);
  const hi = [max && startOfDay(max), calendarProps?.disableFuture && today].filter(Boolean).reduce<Date | undefined>((a, b) => (!a || b! < a ? (b as Date) : a), undefined);
  const unavailable = (d: Date) => (lo && d < lo) || (hi && d > hi) || Boolean(calendarProps?.shouldDisableDate?.(d));

  const change = (d: Date | null, reason: DateChangeReason) => {
    setProblem(reason === 'invalid' || reason === 'unavailable' ? reason : null);
    if (sameDay(d, date) && reason === lastReason.current) return;
    if (!(d === null && date === null)) commit(d);
    lastReason.current = reason;
    onValueChange?.(d, { reason });
    onChange?.(d);
  };

  useEffect(() => { setText(date ? formatDate(date, locale) : ''); }, [date?.getTime()]); // eslint-disable-line react-hooks/exhaustive-deps
  const close = () => { setOpen(false); trigger.current?.focus(); };
  const panel = useRef<HTMLDivElement>(null);
  const control = useRef<HTMLDivElement>(null);
  usePanelDismiss({ open, root, onDismiss: (reason) => (reason === 'escape' ? close() : setOpen(false)) });
  usePlacement({ open, panel, anchor: control });

  const onBlur = () => {
    if (!text.trim()) return change(null, 'empty');
    const d = parseDate(text, locale);
    if (!d) return change(null, 'invalid');
    if (unavailable(d)) return change(null, 'unavailable');
    change(d, 'valid');
  };
  const builtIn = problem === 'invalid' ? l.invalid(pattern)
    : problem === 'unavailable' ? l.unavailable({ min: lo && formatDate(lo, locale), max: hi && formatDate(hi, locale) })
    : undefined;
  const format = hideFormat ? undefined : l.format(pattern);
  const formatNode = format && <span className="rb-datepicker__format">{format}</span>;
  const fullHint = hint && formatNode ? <>{hint} {formatNode}</> : hint ?? formatNode;

  return (
    <Field id={id} label={label} hideLabel={hideLabel} hint={fullHint} error={error ?? builtIn} required={required} disabled={disabled} className={cx('rb-datepicker', className)}>
      {({ id: fieldId, describedBy, invalid }) => (
        <div ref={root} className="rb-datepicker__anchor">
          <div ref={control} className={cx('rb-control', `rb-control--${size}`, invalid && 'rb-control--error', disabled && 'rb-control--disabled')}>
            <button
              ref={trigger}
              type="button"
              className="rb-control__trigger"
              aria-label={l.calendar}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls={open ? popId : undefined}
              disabled={disabled}
              onClick={() => setOpen((o) => !o)}
            >
              <CalendarIcon aria-hidden="true" />
            </button>
            <input
              ref={ref}
              id={fieldId}
              name={name}
              className="rb-control__input"
              inputMode="numeric"
              autoComplete="off"
              placeholder={placeholder ?? datePlaceholder(locale)}
              value={text}
              disabled={disabled}
              required={required}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              onChange={(e) => setText(e.target.value)}
              onBlur={onBlur}
            />
          </div>
          {open && (
            <div ref={panel} id={popId} role="dialog" aria-label={l.calendar} className="rb-datepicker__popover">
              <Calendar locale={locale} {...calendarProps} value={date} min={min} max={max} autoFocus onValueChange={(d) => { change(d, 'valid'); close(); }} />
            </div>
          )}
        </div>
      )}
    </Field>
  );
});
