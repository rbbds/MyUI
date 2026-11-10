import { forwardRef, useImperativeHandle, useRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Search, X } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Kbd } from '../Display/Feedback';
import { Field } from './Field';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue' | 'onChange'> {
  /** Accessible label. Visually hidden unless `showLabel` is set. */
  label: ReactNode;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Shortcut hint shown while the field is empty, e.g. "⌘K". The shortcut itself is up to the app. */
  shortcut?: ReactNode;
  /** Accessible name of the clear button. */
  clearLabel?: string;
}

/** Search field with clear button. Wrap it in <form role="search"> or a region with role="search". */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { label, showLabel = false, size = 'md', value, defaultValue = '', onChange, shortcut, clearLabel = 'Clear search', placeholder = 'Search', disabled, className, id, onKeyDown, ...rest },
  ref,
) {
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current as HTMLInputElement);
  const [own, setOwn] = useState(defaultValue);
  const current = value ?? own;
  const set = (v: string) => { if (value === undefined) setOwn(v); onChange?.(v); };

  return (
    <Field id={id} label={label} hideLabel={!showLabel} disabled={disabled} className={className}>
      {({ id: fieldId }) => (
        <div className={cx('rb-control', 'rb-control--search', `rb-control--${size}`, disabled && 'rb-control--disabled')}>
          <span className="rb-control__icon" aria-hidden="true"><Search /></span>
          <input
            ref={inner}
            id={fieldId}
            type="search"
            className="rb-control__input"
            placeholder={placeholder}
            value={current}
            disabled={disabled}
            onChange={(e) => set(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape' && current) { e.preventDefault(); set(''); } onKeyDown?.(e); }}
            {...rest}
          />
          {current && !disabled ? (
            <button type="button" className="rb-control__clear" aria-label={clearLabel} onClick={() => { set(''); inner.current?.focus(); }}>
              <X aria-hidden="true" />
            </button>
          ) : shortcut ? (
            <Kbd aria-hidden="true">{shortcut}</Kbd>
          ) : null}
        </div>
      )}
    </Field>
  );
});
