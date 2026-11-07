import { forwardRef, useId, useState, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import { Minus, Plus, Star } from 'lucide-react';
import { cx } from '../../utils/cx';
import './Commerce.css';

/* ---------- Price ---------- */
export interface PriceProps extends HTMLAttributes<HTMLSpanElement> {
  /** Current price, e.g. 49.95. */
  amount: number;
  /** Original price. When higher than amount, it is shown struck through as "van … voor …". */
  compareAt?: number;
  currency?: string;
  locale?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Small text after the price, e.g. "per maand" or "incl. btw". */
  suffix?: ReactNode;
}

export const formatMoney = (amount: number, currency = 'EUR', locale = 'nl-NL') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);

/** Price with optional sale price. Screen readers hear "Oude prijs … Nu …". */
export function Price({ amount, compareAt, currency = 'EUR', locale = 'nl-NL', size = 'md', suffix, className, ...rest }: PriceProps) {
  const sale = compareAt !== undefined && compareAt > amount;
  return (
    <span className={cx('rb-price', `rb-price--${size}`, sale && 'rb-price--sale', className)} {...rest}>
      {sale && (
        <s className="rb-price__compare">
          <span className="rb-visually-hidden">Oude prijs </span>
          {formatMoney(compareAt!, currency, locale)}
        </s>
      )}
      <span className="rb-price__amount">
        {sale && <span className="rb-visually-hidden">Nu </span>}
        {formatMoney(amount, currency, locale)}
      </span>
      {suffix && <span className="rb-price__suffix">{suffix}</span>}
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
}

/** Star rating (read-only). One accessible name: "4,5 van 5 sterren, 128 beoordelingen". */
export function Rating({ value, max = 5, count, size = 'md', showValue, locale = 'nl-NL', className, ...rest }: RatingProps) {
  const v = Math.max(0, Math.min(max, Math.round(value * 2) / 2));
  const num = v.toLocaleString(locale, { maximumFractionDigits: 1 });
  const label = `${num} van ${max} sterren${count !== undefined ? `, ${count} beoordelingen` : ''}`;
  return (
    <span className={cx('rb-rating', `rb-rating--${size}`, className)} role="img" aria-label={label} {...rest}>
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
export interface QuantityStepperProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'size'> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  /** Accessible name, e.g. "Aantal Wollen trui". */
  label?: string;
  decreaseLabel?: string;
  increaseLabel?: string;
}

/** Number field with − and + buttons. Typing works too; the value is clamped to min and max. */
export const QuantityStepper = forwardRef<HTMLInputElement, QuantityStepperProps>(function QuantityStepper(
  { value, defaultValue = 1, onChange, min = 1, max = 99, size = 'md', label = 'Aantal', decreaseLabel = 'Eén minder', increaseLabel = 'Eén meer', disabled, className, id, ...rest },
  ref,
) {
  const [own, setOwn] = useState(defaultValue);
  const [draft, setDraft] = useState<string | null>(null);
  const v = value ?? own;
  const autoId = useId();
  const set = (n: number) => {
    const c = Math.max(min, Math.min(max, Number.isFinite(n) ? Math.round(n) : min));
    if (value === undefined) setOwn(c);
    onChange?.(c);
  };
  return (
    <div className={cx('rb-qty', `rb-qty--${size}`, disabled && 'rb-qty--disabled', className)}>
      <button type="button" className="rb-qty__btn" aria-label={decreaseLabel} aria-controls={id ?? autoId} disabled={disabled || v <= min} onClick={() => set(v - 1)}>
        <Minus aria-hidden="true" />
      </button>
      <input
        ref={ref}
        id={id ?? autoId}
        className="rb-qty__input"
        type="number"
        inputMode="numeric"
        aria-label={label}
        min={min}
        max={max}
        value={draft ?? v}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { if (draft !== null) { set(parseInt(draft, 10)); setDraft(null); } }}
        onKeyDown={(e) => { if (e.key === 'Enter' && draft !== null) { set(parseInt(draft, 10)); setDraft(null); } }}
        {...rest}
      />
      <button type="button" className="rb-qty__btn" aria-label={increaseLabel} aria-controls={id ?? autoId} disabled={disabled || v >= max} onClick={() => set(v + 1)}>
        <Plus aria-hidden="true" />
      </button>
    </div>
  );
});

/* ---------- Stock indicator ---------- */
export type StockStatus = 'in-stock' | 'low' | 'out' | 'preorder';
export interface StockIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  status: StockStatus;
  /** Overrides the default text, e.g. "Nog 3 op voorraad". */
  children?: ReactNode;
}
const STOCK_TEXT: Record<StockStatus, string> = { 'in-stock': 'Op voorraad', low: 'Bijna uitverkocht', out: 'Uitverkocht', preorder: 'Pre-order' };

/** Availability with a colored dot. The text carries the meaning, the dot only supports it. */
export function StockIndicator({ status, children, className, ...rest }: StockIndicatorProps) {
  return (
    <span className={cx('rb-stock', `rb-stock--${status}`, className)} {...rest}>
      <span className="rb-stock__dot" aria-hidden="true" />
      {children ?? STOCK_TEXT[status]}
    </span>
  );
}
