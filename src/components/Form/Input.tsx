import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Field, type FieldBaseProps } from './Field';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>, FieldBaseProps {
  /** Icon inside the field, before the value. */
  iconLeading?: ReactNode;
  /** Fixed text before the value, e.g. "€" or "https://". Not part of the value. */
  prefix?: ReactNode;
  /** Fixed text after the value, e.g. "per month" or "%". */
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hideLabel, hint, error, required, size = 'md', iconLeading, prefix, suffix, disabled, className, id, 'aria-describedby': describedByProp, ...rest },
  ref,
) {
  return (
    <Field id={id} label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} className={className}>
      {({ id, describedBy, invalid }) => (
        <div className={cx('rb-control', `rb-control--${size}`, invalid && 'rb-control--error', disabled && 'rb-control--disabled')}>
          {iconLeading && <span className="rb-control__icon" aria-hidden="true">{iconLeading}</span>}
          {prefix && <span id={`${id}-prefix`} className="rb-control__addon">{prefix}</span>}
          <input ref={ref} id={id} className="rb-control__input" disabled={disabled} required={required} aria-invalid={invalid || undefined} aria-describedby={[prefix && `${id}-prefix`, suffix && `${id}-suffix`, describedBy, describedByProp].filter(Boolean).join(' ') || undefined} {...rest} />
          {suffix && <span id={`${id}-suffix`} className="rb-control__addon">{suffix}</span>}
          {invalid && <span className="rb-control__status" aria-hidden="true"><CircleAlert /></span>}
        </div>
      )}
    </Field>
  );
});
