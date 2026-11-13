import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Check, Circle, Eye, EyeOff } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Field, type FieldBaseProps } from '../Form/Field';
import './Portal2.css';

export interface PasswordRequirement { label: string; test: (value: string) => boolean }

export interface PasswordRequirementLabels { length: string; case: string; digit: string }
export const DEFAULT_PASSWORD_REQUIREMENT_LABELS: PasswordRequirementLabels = {
  length: 'At least 12 characters', case: 'An upper and a lower case letter', digit: 'A digit or a symbol',
};
/** The default rules, with your own texts if you pass them. */
export const passwordRequirements = (labels: Partial<PasswordRequirementLabels> = {}): PasswordRequirement[] => {
  const l = { ...DEFAULT_PASSWORD_REQUIREMENT_LABELS, ...labels };
  return [
    { label: l.length, test: (v) => v.length >= 12 },
    { label: l.case, test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
    { label: l.digit, test: (v) => /[\d\W_]/.test(v) },
  ];
};
export const defaultPasswordRequirements: PasswordRequirement[] = passwordRequirements();

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value' | 'defaultValue' | 'onChange'>, FieldBaseProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** New password: show strength and requirements. Leave off for login. */
  showStrength?: boolean;
  requirements?: PasswordRequirement[];
  showLabel?: string;
  hideLabelText?: string;
  /** Strength texts and the screen reader text per requirement. */
  labels?: Partial<PasswordInputLabels>;
}

export interface PasswordInputLabels { empty: string; weak: string; fair: string; good: string; strong: string; met: string; notMet: string }
export const DEFAULT_PASSWORD_INPUT_LABELS: PasswordInputLabels = {
  empty: 'Choose a strong password', weak: 'Strength: weak', fair: 'Strength: fair', good: 'Strength: good', strong: 'Strength: strong',
  met: ', met', notMet: ', not met yet',
};
const KEYS = ['empty', 'weak', 'fair', 'good', 'strong'] as const;

/** Password field with show/hide. With showStrength: strength meter and requirement list for a new password. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { label, hideLabel, hint, error, required, size = 'md', value, defaultValue = '', onChange, showStrength, requirements = defaultPasswordRequirements, showLabel = 'Show password', hideLabelText = 'Hide password', labels, disabled, id, className, autoComplete, ...rest },
  ref,
) {
  const l = { ...DEFAULT_PASSWORD_INPUT_LABELS, ...labels };
  const [own, setOwn] = useState(defaultValue);
  const v = value ?? own;
  const [visible, setVisible] = useState(false);
  const met = requirements.map((r) => r.test(v));
  const count = met.filter(Boolean).length;
  const level = !v ? 0 : Math.max(1, Math.min(4, count + (v.length >= 16 && count === requirements.length ? 1 : 0)));
  return (
    <Field id={id} label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} className={cx('rb-password', className)}>
      {({ id: fieldId, describedBy, invalid }) => (
        <>
          <div className={cx('rb-control', `rb-control--${size}`, invalid && 'rb-control--error', disabled && 'rb-control--disabled')}>
            <input ref={ref} id={fieldId} type={visible ? 'text' : 'password'} className="rb-control__input" value={v} disabled={disabled} required={required}
              autoComplete={autoComplete ?? (showStrength ? 'new-password' : 'current-password')} spellCheck={false}
              aria-invalid={invalid || undefined} aria-describedby={[describedBy, showStrength && `${fieldId}-req`].filter(Boolean).join(' ') || undefined}
              onChange={(e) => { if (value === undefined) setOwn(e.target.value); onChange?.(e.target.value); }} {...rest} />
            <button type="button" className="rb-password__toggle" aria-label={visible ? hideLabelText : showLabel} disabled={disabled} onClick={() => setVisible((x) => !x)}>
              {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            </button>
          </div>
          {showStrength && (
            <div className="rb-password__strength">
              <div className={cx('rb-password__meter', `is-${KEYS[level]}`)} aria-hidden="true">{[1, 2, 3, 4].map((n) => <span key={n} className={cx(n <= level && 'is-on')} />)}</div>
              <p className="rb-password__level" aria-live="polite">{l[KEYS[level]]}</p>
              <ul id={`${fieldId}-req`} className="rb-password__reqs">
                {requirements.map((r, i) => (
                  <li key={r.label} className={cx(met[i] && 'is-met')}>
                    {met[i] ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}
                    {r.label}<span className="rb-visually-hidden">{met[i] ? l.met : l.notMet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </Field>
  );
});
