import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Button } from '../Button/Button';
import { Field, type FieldBaseProps } from '../Form/Field';
import './Portal2.css';

export interface CopyInputProps extends FieldBaseProps {
  value: string;
  copyLabel?: string;
  copiedLabel?: string;
  /** Screen reader announcement after copying. */
  copiedMessage?: string;
  id?: string;
  className?: string;
}

/** Read-only value with a copy button, e.g. an account ID or an API key. */
export function CopyInput({ label, hideLabel, hint, error, size = 'md', value, copyLabel = 'Copy', copiedLabel = 'Copied', copiedMessage = 'Copied to the clipboard.', id, className }: CopyInputProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); } catch { input.current?.select(); document.execCommand?.('copy'); }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Field id={id} label={label} hideLabel={hideLabel} hint={hint} error={error} className={cx('rb-copy', className)}>
      {({ id: fieldId, describedBy }) => (
        <div className="rb-copy__row">
          <div className={cx('rb-control', `rb-control--${size}`)}>
            <input ref={input} id={fieldId} className="rb-control__input" value={value} readOnly aria-describedby={describedBy} onFocus={(e) => e.currentTarget.select()} />
          </div>
          <Button hierarchy="secondary" size={size} iconLeading={copied ? <Check aria-hidden /> : <Copy aria-hidden />} onClick={copy}>{copied ? copiedLabel : copyLabel}</Button>
          <span className="rb-visually-hidden" role="status">{copied ? copiedMessage : ''}</span>
        </div>
      )}
    </Field>
  );
}
