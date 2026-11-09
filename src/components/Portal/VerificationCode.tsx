import { useState } from 'react';
import { cx } from '../../utils/cx';
import { Field, type FieldBaseProps } from '../Form/Field';
import './Portal2.css';

export interface VerificationCodeProps extends Omit<FieldBaseProps, 'size'> {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called when all digits are filled. */
  onComplete?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  autoFocus?: boolean;
  className?: string;
}

/**
 * One-time code (2FA, e-mail check). One real input with autocomplete="one-time-code",
 * shown as boxes. Typing, pasting and SMS autofill all work.
 */
export function VerificationCode({ label, hideLabel, hint, error, required, length = 6, value, defaultValue = '', onChange, onComplete, disabled, id, name, autoFocus, className }: VerificationCodeProps) {
  const [own, setOwn] = useState(defaultValue);
  const v = value ?? own;
  const [focused, setFocused] = useState(false);
  const change = (raw: string) => {
    const next = raw.replace(/\D/g, '').slice(0, length);
    if (value === undefined) setOwn(next);
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  };
  return (
    <Field id={id} label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} className={cx('rb-code', className)}>
      {({ id: fieldId, describedBy, invalid }) => (
        <div className={cx('rb-code__boxes', invalid && 'is-invalid', disabled && 'is-disabled')}>
          <input
            id={fieldId} name={name} className="rb-code__input" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*"
            maxLength={length} value={v} disabled={disabled} required={required} autoFocus={autoFocus}
            aria-invalid={invalid || undefined} aria-describedby={describedBy}
            onChange={(e) => change(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          />
          {Array.from({ length }, (_, i) => (
            <span key={i} aria-hidden="true" className={cx('rb-code__box', focused && i === Math.min(v.length, length - 1) && 'is-active')}>{v[i] ?? ''}</span>
          ))}
        </div>
      )}
    </Field>
  );
}
