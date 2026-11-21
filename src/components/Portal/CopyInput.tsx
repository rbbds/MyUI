import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cx } from '../../utils/cx';
import { useLabels } from '../../utils/locale';
import { Button } from '../Button/Button';
import { Field, type FieldBaseProps } from '../Form/Field';
import './Portal2.css';

export interface CopyInputProps extends FieldBaseProps {
  value: string;
  labels?: Partial<CopyInputLabels>;
  /** @deprecated Use labels.copy. Removed in 2.0.0. */
  copyLabel?: string;
  /** @deprecated Use labels.copied. Removed in 2.0.0. */
  copiedLabel?: string;
  /** @deprecated Use labels.copiedMessage. Removed in 2.0.0. */
  copiedMessage?: string;
  id?: string;
  className?: string;
}

export interface CopyInputLabels {
  copy: string;
  copied: string;
  /** Screen reader announcement after copying. */
  copiedMessage: string;
}
export const DEFAULT_COPY_INPUT_LABELS: CopyInputLabels = { copy: 'Copy', copied: 'Copied', copiedMessage: 'Copied to the clipboard.' };

/** Read-only value with a copy button, e.g. an account ID or an API key. */
export function CopyInput({ label, hideLabel, hint, error, size = 'md', value, labels, copyLabel, copiedLabel, copiedMessage, id, className }: CopyInputProps) {
  const l = useLabels('copyInput', DEFAULT_COPY_INPUT_LABELS, labels, { copy: copyLabel, copied: copiedLabel, copiedMessage });
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
          <Button hierarchy="secondary" size={size} iconLeading={copied ? <Check aria-hidden /> : <Copy aria-hidden />} onClick={copy}>{copied ? l.copied : l.copy}</Button>
          <span className="rb-visually-hidden" role="status">{copied ? l.copiedMessage : ''}</span>
        </div>
      )}
    </Field>
  );
}
