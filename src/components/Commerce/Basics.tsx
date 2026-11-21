import { forwardRef, useId, useState, type CSSProperties, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import { Minus, Plus, Star } from 'lucide-react';
import { cx } from '../../utils/cx';
import { useLabels, useLocale, useText } from '../../utils/locale';
import { useControlled } from '../../utils/useControlled';
import './Commerce.css';

/* ---------- Price ---------- */
export interface PriceProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'prefix'> {
  /** Current price, e.g. 49.95. */
  amount: number;
  /** Original price. When higher than amount, it is shown struck through as "was … now …". */
  compareAt?: number;
  currency?: string;
  locale?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Small text before the price, e.g. "From". */
  prefix?: ReactNode;
  /** Small text after the price, e.g. "per month" or "per piece". */
  suffix?: ReactNode;
  /** Fixed number of decimals, e.g. 3 for a unit price such as €0.523. Default: what the currency uses (2 for EUR). */
  decimals?: number;
  /** Shows "excl. VAT" or "incl. VAT" after the price. The text comes from `labels`. Default: nothing. */
  vat?: 'excl' | 'incl';
  /** Texts: the hidden "Was" and "Now" for screen readers, and the VAT texts. */
  labels?: Partial<PriceLabels>;
}
export interface PriceLabels { was: string; now: string; vatExcl: string; vatIncl: string }
export const DEFAULT_PRICE_LABELS: PriceLabels = { was: 'Was', now: 'Now', vatExcl: 'excl. VAT', vatIncl: 'incl. VAT' };

export const formatMoney = (amount: number, currency = 'EUR', locale = 'en-US', decimals?: number) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency, ...(decimals === undefined ? {} : { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) }).format(amount);

/** Price with optional sale price, prefix, suffix and VAT text. Screen readers hear "Was … Now …". */
export function Price({ amount, compareAt, currency = 'EUR', locale: localeProp, size = 'md', prefix, suffix, decimals, vat, labels, className, ...rest }: PriceProps) {
  const locale = useLocale(localeProp);
  const l = useLabels('price', DEFAULT_PRICE_LABELS, labels);
  const sale = compareAt !== undefined && compareAt > amount;
  return (
    <span className={cx('rb-price', `rb-price--${size}`, sale && 'rb-price--sale', className)} {...rest}>
      {prefix && <span className="rb-price__prefix">{prefix}</span>}
      {sale && (
        <s className="rb-price__compare">
          <span className="rb-visually-hidden">{l.was} </span>
          {formatMoney(compareAt!, currency, locale, decimals)}
        </s>
      )}
      <span className="rb-price__amount">
        {sale && <span className="rb-visually-hidden">{l.now} </span>}
        {formatMoney(amount, currency, locale, decimals)}
      </span>
      {suffix && <span className="rb-price__suffix">{suffix}</span>}
      {vat && <span className="rb-price__vat">{vat === 'excl' ? l.vatExcl : l.vatIncl}</span>}
    </span>
  );
}

/* ---------- Rating ---------- */
export interface RatingProps extends HTMLAttributes<HTMLSpanElement> {
  /** 0 to max, halves are shown as half stars. */
  value: number;
  max?: number;
  /** Number of reviews, shown after the stars. */
  count?: number;
  size?: 'sm' | 'md';
  /** Show the value as number, e.g. "4,5". */
  showValue?: boolean;
  locale?: string;
  /** Accessible name. `value` is already formatted for the locale. */
  labels?: Partial<RatingLabels>;
}
export interface RatingLabels { rating: (value: string, max: number) => string; reviews: (count: number) => string }
export const DEFAULT_RATING_LABELS: RatingLabels = {
  rating: (value, max) => `${value} out of ${max} stars`,
  reviews: (count) => `${count} reviews`,
};

/** Star rating (read-only). One accessible name: "4.5 out of 5 stars, 128 reviews". */
export function Rating({ value, max = 5, count, size = 'md', showValue, locale: localeProp, labels, className, ...rest }: RatingProps) {
  const locale = useLocale(localeProp);
  const l = useLabels('rating', DEFAULT_RATING_LABELS, labels);
  const v = Math.max(0, Math.min(max, Math.round(value * 2) / 2));
  const num = v.toLocaleString(locale, { maximumFractionDigits: 1 });
  const label = [l.rating(num, max), count !== undefined ? l.reviews(count) : null].filter(Boolean).join(', ');
  return (
    <span data-size={size} className={cx('rb-rating', `rb-rating--${size}`, className)} role="img" aria-label={label} {...rest}>
      <span className="rb-rating__stars" aria-hidden="true">
        {Array.from({ length: max }, (_, i) => {
          const fill = v >= i + 1 ? 'full' : v >= i + 0.5 ? 'half' : 'empty';
          return (
            <span key={i} className={cx('rb-rating__star', `is-${fill}`)}>
              <Star className="rb-rating__bg" />
              <Star className="rb-rating__fg" />
            </span>
          );
        })}
      </span>
      {showValue && <span className="rb-rating__value" aria-hidden="true">{num}</span>}
      {count !== undefined && <span className="rb-rating__count" aria-hidden="true">({count})</span>}
    </span>
  );
}

/* ---------- Quantity stepper ---------- */
export interface QuantityStepperProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'size' | 'step'> {
  value?: number;
  defaultValue?: number;
  /** Called with the new quantity (within min and max, and a multiple of step). */
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  /** Order unit, e.g. 12 for a box of twelve. − and + go per step; a typed number is rounded up to the next step. Default 1. */
  step?: number;
  /** Line below the stepper, e.g. "Add 20 more for €0.48 each". A message about a corrected number takes its place for a moment. */
  hint?: ReactNode;
  size?: 'sm' | 'md';
  /** Accessible name, e.g. "Quantity Wool sweater". */
  label?: string;
  labels?: Partial<QuantityStepperLabels>;
  /** @deprecated Use onValueChange. Removed in 2.0.0. */
  onChange?: (value: number) => void;
  /** @deprecated Use labels.decrease. Removed in 2.0.0. */
  decreaseLabel?: string;
  /** @deprecated Use labels.increase. Removed in 2.0.0. */
  increaseLabel?: string;
}
export interface QuantityStepperLabels {
  decrease: string;
  increase: string;
  /** Button names when step is more than 1. */
  decreaseBy: (step: number) => string;
  increaseBy: (step: number) => string;
  /** Messages after a typed number was corrected. */
  minimum: (min: number) => string;
  maximum: (max: number) => string;
  stepped: (value: number, step: number) => string;
}
export const DEFAULT_QUANTITY_STEPPER_LABELS: QuantityStepperLabels = {
  decrease: 'One less',
  increase: 'One more',
  decreaseBy: (step) => `${step} less`,
  increaseBy: (step) => `${step} more`,
  minimum: (min) => `Minimum is ${min}`,
  maximum: (max) => `Maximum is ${max}`,
  stepped: (value, step) => `Changed to ${value}. Sold per ${step}.`,
};

/** Number field with − and + buttons. Typing works too; a number outside min, max or step is corrected and explained. */
export const QuantityStepper = forwardRef<HTMLInputElement, QuantityStepperProps>(function QuantityStepper(
  { value, defaultValue = 1, onValueChange, onChange, min = 1, max = 99, step = 1, hint, size = 'md', label: labelProp, labels, decreaseLabel, increaseLabel, disabled, className, id, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const label = useText('quantityStepper.label', labelProp);
  const l = useLabels('quantityStepper', DEFAULT_QUANTITY_STEPPER_LABELS, labels, { decrease: decreaseLabel, increase: increaseLabel });
  const [draft, setDraft] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [v, setValue] = useControlled(value, defaultValue, (n) => { onValueChange?.(n); onChange?.(n); });
  const autoId = useId();
  const inputId = id ?? autoId;
  // Valid numbers are multiples of the step: the limits move inward to the nearest one.
  const s = Number.isFinite(step) && step >= 1 ? Math.round(step) : 1;
  const lo = Math.ceil(min / s) * s;
  const hi = Math.max(lo, Math.floor(max / s) * s);
  const digits = Math.max(2, String(hi).length);
  const commit = () => {
    if (draft === null) return;
    const n = parseInt(draft, 10);
    let next = Number.isFinite(n) ? n : lo;
    let note: string | null = null;
    if (next < lo) { next = lo; if (Number.isFinite(n)) note = l.minimum(lo); }
    else if (next > hi) { next = hi; note = l.maximum(hi); }
    else if (next % s !== 0) { next = Math.ceil(next / s) * s; note = l.stepped(next, s); }
    setDraft(null);
    setMessage(note);
    setValue(next);
  };
  const press = (next: number) => { setDraft(null); setMessage(null); setValue(Math.max(lo, Math.min(hi, next))); };
  const describedByIds = cx(describedBy, message ? `${inputId}-message` : hint ? `${inputId}-hint` : undefined) || undefined;
  return (
    <div className={cx('rb-qty-field', className)}>
      <div className={cx('rb-qty', `rb-qty--${size}`, disabled && 'rb-qty--disabled')} style={digits > 2 ? ({ '--_digits': digits } as CSSProperties) : undefined}>
        {/* M9: at the limit the button stays focusable (aria-disabled), so focus does not drop to the page */}
        <button type="button" className="rb-qty__btn" aria-label={s > 1 ? l.decreaseBy(s) : l.decrease} aria-controls={inputId} disabled={disabled} aria-disabled={v <= lo || undefined} onClick={() => { if (v > lo) press(Math.ceil(v / s) * s - s); }}>
          <Minus aria-hidden="true" />
        </button>
        <input
          ref={ref}
          id={inputId}
          className="rb-qty__input"
          type="number"
          inputMode="numeric"
          aria-label={label}
          aria-describedby={describedByIds}
          min={lo}
          max={hi}
          step={s > 1 ? s : undefined}
          value={draft ?? v}
          disabled={disabled}
          onChange={(e) => { setDraft(e.target.value); setMessage(null); }}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); }}
          {...rest}
        />
        <button type="button" className="rb-qty__btn" aria-label={s > 1 ? l.increaseBy(s) : l.increase} aria-controls={inputId} disabled={disabled} aria-disabled={v >= hi || undefined} onClick={() => { if (v < hi) press(Math.floor(v / s) * s + s); }}>
          <Plus aria-hidden="true" />
        </button>
      </div>
      {/* Always in the page, so a screen reader announces the message when it appears. */}
      <span id={`${inputId}-message`} className="rb-qty__message" role="status">{message}</span>
      {hint && <span id={`${inputId}-hint`} className="rb-qty__hint" hidden={message !== null}>{hint}</span>}
    </div>
  );
});

/* ---------- Stock indicator ---------- */
export type StockStatus = 'in-stock' | 'low' | 'out' | 'preorder';
export interface StockIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  status: StockStatus;
  /** Overrides the default text, e.g. "Only 3 left". */
  children?: ReactNode;
  /** Text per status. */
  labels?: Partial<Record<StockStatus, string>>;
}
export const DEFAULT_STOCK_LABELS: Record<StockStatus, string> = { 'in-stock': 'In stock', low: 'Almost sold out', out: 'Sold out', preorder: 'Pre-order' };

/** Availability with a colored dot. The text carries the meaning, the dot only supports it. */
export function StockIndicator({ status, children, labels, className, ...rest }: StockIndicatorProps) {
  const l = useLabels('stock', DEFAULT_STOCK_LABELS, labels);
  return (
    <span className={cx('rb-stock', `rb-stock--${status}`, className)} {...rest}>
      <span className="rb-stock__dot" aria-hidden="true" />
      {children ?? l[status]}
    </span>
  );
}
