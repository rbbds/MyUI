import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { Field, type FieldBaseProps } from './Field';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, Omit<FieldBaseProps, 'size'> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hideLabel, hint, error, required, disabled, className, id, ...rest },
  ref,
) {
  return (
    <Field id={id} label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} className={className}>
      {({ id, describedBy, invalid }) => (
        <div className={cx('rb-control', 'rb-control--textarea', invalid && 'rb-control--error', disabled && 'rb-control--disabled')}>
          <textarea ref={ref} id={id} className="rb-control__input rb-control__textarea" disabled={disabled} required={required} aria-invalid={invalid || undefined} aria-describedby={describedBy} {...rest} />
        </div>
      )}
    </Field>
  );
});
