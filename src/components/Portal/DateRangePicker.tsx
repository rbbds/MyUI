import { useEffect, useId, useRef, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Button } from '../Button/Button';
import { Calendar, formatDate } from '../Form/DatePicker';
import { Field, type FieldBaseProps } from '../Form/Field';
import { usePanelDismiss, usePlacement } from '../../utils/panel';
import './Portal.css';

export interface DateRange { start: Date | null; end: Date | null }
export interface DateRangePreset { label: string; range: () => { start: Date; end: Date } }

const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const plus = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const same = (a?: Date | null, b?: Date | null) => !!a && !!b && day(a).getTime() === day(b).getTime();

export interface DateRangePresetLabels { today: string; yesterday: string; last7: string; last30: string; thisMonth: string; lastMonth: string; thisYear: string }
export const DEFAULT_DATE_RANGE_PRESET_LABELS: DateRangePresetLabels = {
  today: 'Today', yesterday: 'Yesterday', last7: 'Last 7 days', last30: 'Last 30 days', thisMonth: 'This month', lastMonth: 'Last month', thisYear: 'This year',
};
/** Default quick picks, relative to today. Pass labels to translate them. */
export const defaultDateRangePresets = (today = day(new Date()), labels: Partial<DateRangePresetLabels> = {}): DateRangePreset[] => {
  const l = { ...DEFAULT_DATE_RANGE_PRESET_LABELS, ...labels };
  return [
    { label: l.today, range: () => ({ start: today, end: today }) },
    { label: l.yesterday, range: () => ({ start: plus(today, -1), end: plus(today, -1) }) },
    { label: l.last7, range: () => ({ start: plus(today, -6), end: today }) },
    { label: l.last30, range: () => ({ start: plus(today, -29), end: today }) },
    { label: l.thisMonth, range: () => ({ start: new Date(today.getFullYear(), today.getMonth(), 1), end: new Date(today.getFullYear(), today.getMonth() + 1, 0) }) },
    { label: l.lastMonth, range: () => ({ start: new Date(today.getFullYear(), today.getMonth() - 1, 1), end: new Date(today.getFullYear(), today.getMonth(), 0) }) },
    { label: l.thisYear, range: () => ({ start: new Date(today.getFullYear(), 0, 1), end: new Date(today.getFullYear(), 11, 31) }) },
  ];
};

export interface DateRangePickerLabels {
  quickPicks: string; custom: string; cancel: string; apply: string;
  chooseStart: string; chooseEnd: string; days: (count: number) => string;
}
export const DEFAULT_DATE_RANGE_PICKER_LABELS: DateRangePickerLabels = {
  quickPicks: 'Quick picks', custom: 'Custom', cancel: 'Cancel', apply: 'Apply',
  chooseStart: 'Choose a start date', chooseEnd: 'Choose an end date', days: (count) => `${count} ${count === 1 ? 'day' : 'days'}`,
};

export interface DateRangePickerProps extends FieldBaseProps {
  value?: DateRange;
  defaultValue?: DateRange;
  /** Called on Apply with the chosen range. */
  onChange?: (range: DateRange) => void;
  presets?: DateRangePreset[] | false;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
  locale?: string;
  dialogLabel?: string;
  labels?: Partial<DateRangePickerLabels>;
  className?: string;
}

const fmtShort = (d: Date, locale: string, withYear: boolean) => d.toLocaleDateString(locale, { day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}) });
const days = (r: DateRange) => (r.start && r.end ? Math.round((day(r.end).getTime() - day(r.start).getTime()) / 864e5) + 1 : 0);

/** Pick a period: quick picks, two months side by side, confirm with Apply. */
export function DateRangePicker({
  label, hideLabel, hint, error, required, size = 'md', value, defaultValue = { start: null, end: null }, onChange,
  presets = defaultDateRangePresets(), min, max, disabled, id, placeholder = 'Choose a period', locale = 'en-US',
  dialogLabel = 'Choose a period', labels, className,
}: DateRangePickerProps) {
  const l = { ...DEFAULT_DATE_RANGE_PICKER_LABELS, ...labels };
  const [own, setOwn] = useState<DateRange>(defaultValue);
  const range = value ?? own;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>(range);
  const [hover, setHover] = useState<Date | null>(null);
  const [month, setMonth] = useState<Date>(() => { const b = range.start ?? new Date(); return new Date(b.getFullYear(), b.getMonth(), 1); });
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialogId = useId();
  /* one month on small screens */
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 639px)').matches);
  useEffect(() => {
    const mq = window.matchMedia?.('(max-width: 639px)');
    if (!mq) return;
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);


  const openPanel = () => {
    setDraft(range); setHover(null);
    const b = range.start ?? new Date(); setMonth(new Date(b.getFullYear(), b.getMonth(), 1));
    setOpen(true);
  };
  const close = () => { setOpen(false); trigger.current?.focus(); };
  const panel = useRef<HTMLDivElement>(null);
  const control = useRef<HTMLDivElement>(null);
  usePanelDismiss({ open, root, onDismiss: (reason) => (reason === 'escape' ? close() : setOpen(false)) });
  usePlacement({ open, panel, anchor: control });
  const apply = () => { if (value === undefined) setOwn(draft); onChange?.(draft); close(); };

  const pick = (d: Date) => {
    if (!draft.start || draft.end) setDraft({ start: d, end: null });
    else if (d < draft.start) setDraft({ start: d, end: draft.start });
    else setDraft({ start: draft.start, end: d });
  };
  /* preview while choosing the end date */
  const shown: DateRange = draft.start && !draft.end && hover
    ? (hover < draft.start ? { start: hover, end: draft.start } : { start: draft.start, end: hover })
    : draft;

  const presetList = presets || [];
  const activePreset = presetList.find((p) => { const r = p.range(); return same(r.start, draft.start) && same(r.end, draft.end); });
  const choosePreset = (p: DateRangePreset) => { const r = p.range(); setDraft(r); setMonth(new Date(r.start.getFullYear(), r.start.getMonth(), 1)); };

  const text = range.start && range.end ? `${formatDate(range.start, locale)} – ${formatDate(range.end, locale)}` : '';
  const summary = draft.start && draft.end
    ? `${fmtShort(draft.start, locale, !(draft.start.getFullYear() === draft.end.getFullYear()))} – ${fmtShort(draft.end, locale, true)} · ${l.days(days(draft))}`
    : draft.start ? l.chooseEnd : l.chooseStart;
  const next = new Date(month.getFullYear(), month.getMonth() + 1, 1);
  const common = { rangeStart: shown.start, rangeEnd: shown.end, onChange: pick, onDayHover: setHover, min, max, locale, className: 'rb-calendar--plain', views: ['day' as const] };

  return (
    <Field id={id} label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} className={cx('rb-daterange', className)}>
      {({ id: fieldId, labelId, describedBy, invalid }) => (
        <div ref={root} className="rb-daterange__anchor">
          <div ref={control} className={cx('rb-control', `rb-control--${size}`, invalid && 'rb-control--error', disabled && 'rb-control--disabled')}>
            <CalendarIcon aria-hidden="true" className="rb-daterange__icon" />
            <button
              ref={trigger}
              id={fieldId}
              type="button"
              className={cx('rb-daterange__trigger', !text && 'is-placeholder')}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls={open ? dialogId : undefined}
              /* Label and value: a label alone would hide the chosen period from screen readers. */
              aria-labelledby={`${labelId} ${fieldId}`}
              aria-describedby={describedBy}
              disabled={disabled}
              onClick={() => (open ? setOpen(false) : openPanel())}
            >
              {text || placeholder}
            </button>
          </div>
          {open && (
            <div ref={panel} id={dialogId} role="dialog" aria-label={dialogLabel} className="rb-daterange__panel">
              {presetList.length > 0 && (
                <div className="rb-daterange__presets" role="group" aria-label={l.quickPicks}>
                  {presetList.map((p) => (
                    <button key={p.label} type="button" className="rb-daterange__preset" aria-pressed={activePreset === p} onClick={() => choosePreset(p)}>{p.label}</button>
                  ))}
                  <span className={cx('rb-daterange__preset', 'is-static', !activePreset && draft.start && 'is-current')} aria-hidden="true">{l.custom}</span>
                </div>
              )}
              <div className="rb-daterange__main">
                <div className="rb-daterange__months">
                  <Calendar {...common} month={month} onMonthChange={setMonth} hideNext={!narrow} autoFocus />
                  {!narrow && <Calendar {...common} month={next} onMonthChange={(m) => setMonth(new Date(m.getFullYear(), m.getMonth() - 1, 1))} hidePrevious />}
                </div>
                <div className="rb-daterange__footer">
                  <p className="rb-daterange__summary" aria-live="polite">{summary}</p>
                  <Button hierarchy="secondary" size="sm" onClick={close}>{l.cancel}</Button>
                  <Button size="sm" onClick={apply} disabled={!draft.start || !draft.end}>{l.apply}</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Field>
  );
}
