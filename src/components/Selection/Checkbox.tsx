import { forwardRef, useEffect, useImperativeHandle, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Check, Minus } from 'lucide-react';
import { cx } from '../../utils/cx';
import './Selection.css';

interface BaseProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  hint?: ReactNode;
  size?: 'sm' | 'md';
}

function Text({ label, hint }: { label?: ReactNode; hint?: ReactNode }) {
  if (!label && !hint) return null;
  return (
    <span className="rb-check__text">
      {label && <span className="rb-check__label">{label}</span>}
      {hint && <span className="rb-check__hint">{hint}</span>}
    </span>
  );
}

export interface CheckboxProps extends BaseProps {
  /** Partially selected state, e.g. for a parent of a group. */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, size = 'sm', indeterminate = false, disabled, className, ...rest },
  ref,
) {
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current as HTMLInputElement);
  useEffect(() => { if (inner.current) inner.current.indeterminate = indeterminate; }, [indeterminate]);
  return (
    <label data-size={size} className={cx('rb-check', `rb-check--${size}`, disabled && 'rb-check--disabled', className)}>
      <span className="rb-check__control">
        <input ref={inner} type="checkbox" className="rb-check__input" disabled={disabled} {...rest} />
        <Check className="rb-check__indicator rb-check__indicator--check" aria-hidden="true" strokeWidth={3} />
        <Minus className="rb-check__indicator rb-check__indicator--minus" aria-hidden="true" strokeWidth={3} />
      </span>
      <Text label={label} hint={hint} />
    </label>
  );
});

export type RadioProps = BaseProps;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ label, hint, size = 'sm', disabled, className, ...rest }, ref) {
  return (
    <label data-size={size} className={cx('rb-check', 'rb-check--radio', `rb-check--${size}`, disabled && 'rb-check--disabled', className)}>
      <span className="rb-check__control">
        <input ref={ref} type="radio" className="rb-check__input" disabled={disabled} {...rest} />
        <span className="rb-check__dot" aria-hidden="true" />
      </span>
      <Text label={label} hint={hint} />
    </label>
  );
});

export interface RadioGroupProps {
  legend: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Groups radios in a fieldset with a legend (required for screen readers). */
export function RadioGroup({ legend, children, className }: RadioGroupProps) {
  return (
    <fieldset className={cx('rb-radio-group', className)}>
      <legend className="rb-radio-group__legend">{legend}</legend>
      {children}
    </fieldset>
  );
}

export type ToggleProps = BaseProps;

/** Switch for settings that apply immediately. Use Checkbox for form submissions. */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle({ label, hint, size = 'sm', disabled, className, ...rest }, ref) {
  return (
    <label className={cx('rb-check', 'rb-toggle', `rb-check--${size}`, disabled && 'rb-check--disabled', className)}>
      <span className="rb-toggle__track">
        <input ref={ref} type="checkbox" role="switch" className="rb-check__input" disabled={disabled} {...rest} />
        <span className="rb-toggle__knob" aria-hidden="true" />
      </span>
      <Text label={label} hint={hint} />
    </label>
  );
});
