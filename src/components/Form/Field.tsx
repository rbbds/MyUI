import { useId, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Form.css';

export interface FieldBaseProps {
  /** Visible label. Always provide one; use `hideLabel` only when context makes it obvious. */
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  /** Error message. Replaces the hint and marks the control invalid. Say how to fix it. */
  error?: ReactNode;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface FieldProps extends FieldBaseProps {
  id?: string;
  disabled?: boolean;
  className?: string;
  children: (ids: { id: string; labelId: string; describedBy?: string; invalid: boolean }) => ReactNode;
}

export function Field({ id: idProp, label, hideLabel, hint, error, required, disabled, className, children }: FieldProps) {
  const auto = useId();
  const id = idProp ?? `rb-${auto}`;
  const hintId = hint && !error ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cx('rb-field', disabled && 'rb-field--disabled', className)}>
      <label id={`${id}-label`} htmlFor={id} className={cx('rb-field__label', hideLabel && 'rb-visually-hidden')}>
        {label}
        {required && <span className="rb-field__required" aria-hidden="true">*</span>}
      </label>
      {children({ id, labelId: `${id}-label`, describedBy: errorId ?? hintId, invalid: Boolean(error) })}
      {error ? (
        <p id={errorId} className="rb-field__error">{error}</p>
      ) : hint ? (
        <p id={hintId} className="rb-field__hint">{hint}</p>
      ) : null}
    </div>
  );
}
