import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Field, type FieldBaseProps } from './Field';

export interface SelectOption { value: string; label: string; disabled?: boolean }

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>, FieldBaseProps {
  options: SelectOption[];
  /** Placeholder shown as an empty, non-selectable first option. */
  placeholder?: string;
  iconLeading?: ReactNode;
}

/** Native select, styled. Native keeps mobile pickers and full keyboard/screen reader support. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hideLabel, hint, error, required, size = 'md', options, placeholder, iconLeading, disabled, className, id, value, defaultValue, 'aria-describedby': describedByProp, ...rest },
  ref,
) {
  return (
    <Field id={id} label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} className={className}>
      {({ id, describedBy, invalid }) => (
        <div className={cx('rb-control', 'rb-control--select', `rb-control--${size}`, Boolean(iconLeading) && 'rb-control--has-icon', invalid && 'rb-control--error', disabled && 'rb-control--disabled')}>
          {iconLeading && <span className="rb-control__icon" aria-hidden="true">{iconLeading}</span>}
          <select
            ref={ref}
            id={id}
            className="rb-control__input rb-control__select"
            disabled={disabled}
            required={required}
            aria-invalid={invalid || undefined}
            aria-describedby={[describedBy, describedByProp].filter(Boolean).join(' ') || undefined}
            value={value}
            defaultValue={value === undefined ? (defaultValue ?? (placeholder !== undefined ? '' : undefined)) : undefined}
            {...rest}
          >
            {placeholder !== undefined && <option value="" disabled>{placeholder}</option>}
            {options.map((o) => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
          </select>
          <span className="rb-control__chevron" aria-hidden="true"><ChevronDown /></span>
        </div>
      )}
    </Field>
  );
});
