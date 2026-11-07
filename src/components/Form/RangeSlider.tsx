import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Form.css';

export interface RangeSliderProps {
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  formatValue?: (v: number) => string;
  /** Accessible names of the two handles. */
  minLabel?: string;
  maxLabel?: string;
  disabled?: boolean;
  className?: string;
}

/** Slider with two handles (from/to), e.g. a price range. Two native range inputs, so keyboard and screen readers work. */
export function RangeSlider({ label, hideLabel, hint, min = 0, max = 100, step = 1, value, defaultValue = [min, max], onChange, formatValue = String, minLabel = 'Minimum', maxLabel = 'Maximum', disabled, className }: RangeSliderProps) {
  const [own, setOwn] = useState<[number, number]>(defaultValue);
  const [lo, hi] = value ?? own;
  const id = useId();
  const set = (v: [number, number]) => { if (value === undefined) setOwn(v); onChange?.(v); };
  const pct = (n: number) => ((n - min) / (max - min)) * 100;
  return (
    <div role="group" aria-labelledby={`${id}-l`} aria-describedby={hint ? `${id}-h` : undefined} className={cx('rb-slider', 'rb-range', disabled && 'rb-range--disabled', className)}>
      <span id={`${id}-l`} className={cx('rb-field__label', hideLabel && 'rb-visually-hidden')}>{label}</span>
      <div className="rb-range__track" style={{ '--_lo': `${pct(lo)}%`, '--_hi': `${pct(hi)}%` } as CSSProperties}>
        <input type="range" className="rb-slider__input rb-range__input" aria-label={minLabel} aria-valuetext={formatValue(lo)} min={min} max={max} step={step} value={lo} disabled={disabled} onChange={(e) => set([Math.min(Number(e.target.value), hi - step), hi])} />
        <input type="range" className="rb-slider__input rb-range__input" aria-label={maxLabel} aria-valuetext={formatValue(hi)} min={min} max={max} step={step} value={hi} disabled={disabled} onChange={(e) => set([lo, Math.max(Number(e.target.value), lo + step)])} />
      </div>
      <div className="rb-range__values" aria-hidden="true"><span>{formatValue(lo)}</span><span>{formatValue(hi)}</span></div>
      {hint && <p id={`${id}-h`} className="rb-field__hint">{hint}</p>}
    </div>
  );
}
