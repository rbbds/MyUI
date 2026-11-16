import { forwardRef, useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { mergeLabels } from '../../utils/labels';
import { useControlled } from '../../utils/useControlled';
import './Form.css';

export interface RangeSliderLabels {
  /** Names of the two handles. */
  min: string;
  max: string;
}
export const DEFAULT_RANGE_SLIDER_LABELS: RangeSliderLabels = { min: 'Minimum', max: 'Maximum' };

export interface RangeSliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  /** Called with [from, to]. */
  onValueChange?: (value: [number, number]) => void;
  formatValue?: (v: number) => string;
  disabled?: boolean;
  labels?: Partial<RangeSliderLabels>;
  /** @deprecated Use onValueChange. Removed in 2.0.0. */
  onChange?: (value: [number, number]) => void;
  /** @deprecated Use labels.min. Removed in 2.0.0. */
  minLabel?: string;
  /** @deprecated Use labels.max. Removed in 2.0.0. */
  maxLabel?: string;
}

/** Slider with two handles (from/to), e.g. a price range. Two native range inputs, so keyboard and screen readers work. */
export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(function RangeSlider({ label, hideLabel, hint, min = 0, max = 100, step = 1, value, defaultValue, onValueChange, onChange, formatValue = String, labels, minLabel, maxLabel, disabled, className, ...rest }, ref) {
  const l = mergeLabels(DEFAULT_RANGE_SLIDER_LABELS, labels, { min: minLabel, max: maxLabel });
  const [[lo, hi], set] = useControlled<[number, number]>(value, defaultValue ?? [min, max], (v) => { onValueChange?.(v); onChange?.(v); });
  const id = useId();
  const pct = (n: number) => ((n - min) / (max - min)) * 100;
  return (
    <div ref={ref} {...rest} role="group" aria-labelledby={`${id}-l`} aria-describedby={hint ? `${id}-h` : undefined} className={cx('rb-slider', 'rb-range', disabled && 'rb-range--disabled', className)}>
      <span id={`${id}-l`} className={cx('rb-field__label', hideLabel && 'rb-visually-hidden')}>{label}</span>
      <div className="rb-range__track" style={{ '--_lo': `${pct(lo)}%`, '--_hi': `${pct(hi)}%` } as CSSProperties}>
        <input type="range" className="rb-slider__input rb-range__input" aria-label={l.min} aria-valuetext={formatValue(lo)} min={min} max={max} step={step} value={lo} disabled={disabled} onChange={(e) => set([Math.min(Number(e.target.value), hi - step), hi])} />
        <input type="range" className="rb-slider__input rb-range__input" aria-label={l.max} aria-valuetext={formatValue(hi)} min={min} max={max} step={step} value={hi} disabled={disabled} onChange={(e) => set([lo, Math.max(Number(e.target.value), lo + step)])} />
      </div>
      <div className="rb-range__values" aria-hidden="true"><span>{formatValue(lo)}</span><span>{formatValue(hi)}</span></div>
      {hint && <p id={`${id}-h`} className="rb-field__hint">{hint}</p>}
    </div>
  );
});
