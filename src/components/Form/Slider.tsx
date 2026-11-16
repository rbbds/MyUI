import { forwardRef, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControlled } from '../../utils/useControlled';
import { Field } from './Field';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  value?: number;
  /** Start value when uncontrolled. Default: the middle between min and max (on a step). */
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  /** Called with the new value. */
  onValueChange?: (value: number) => void;
  /** @deprecated Use onValueChange. In 2.0.0 onChange gets the native change event, like Input. */
  onChange?: (value: number) => void;
  /** Formats the visible value and aria-valuetext, e.g. v => `€ ${v}`. */
  formatValue?: (value: number) => string;
  showValue?: boolean;
}

/** Single-value range slider based on the native input (keyboard and screen reader support built in). */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { label, hideLabel, hint, value, defaultValue, min = 0, max = 100, step = 1, onValueChange, onChange, formatValue = (v) => String(v), showValue = true, disabled, className, id, ...rest },
  ref,
) {
  const middle = min + Math.round((max - min) / 2 / step) * step;
  const [current, setValue] = useControlled(value, defaultValue ?? middle, (v) => { onValueChange?.(v); onChange?.(v); });
  const pct = ((current - min) / (max - min)) * 100;
  return (
    <Field id={id} label={label} hideLabel={hideLabel} hint={hint} disabled={disabled} className={cx('rb-slider', className)}>
      {({ id, describedBy }) => (
        <div className="rb-slider__row">
          <input
            ref={ref}
            id={id}
            type="range"
            className="rb-slider__input"
            style={{ '--_pct': `${pct}%` } as CSSProperties}
            min={min}
            max={max}
            step={step}
            value={current}
            disabled={disabled}
            aria-describedby={describedBy}
            aria-valuetext={formatValue(current)}
            onChange={(e) => setValue(Number(e.target.value))}
            {...rest}
          />
          {showValue && <output htmlFor={id} className="rb-slider__value">{formatValue(current)}</output>}
        </div>
      )}
    </Field>
  );
});
