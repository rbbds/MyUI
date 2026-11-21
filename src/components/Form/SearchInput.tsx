import { forwardRef, useImperativeHandle, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Search, X } from 'lucide-react';
import { cx } from '../../utils/cx';
import { useLabels, useText } from '../../utils/locale';
import { useControlled } from '../../utils/useControlled';
import { Kbd } from '../Display/Feedback';
import { Field } from './Field';

export interface SearchInputLabels {
  /** Name of the clear button. */
  clear: string;
}
export const DEFAULT_SEARCH_INPUT_LABELS: SearchInputLabels = { clear: 'Clear search' };

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue' | 'onChange'> {
  /** Accessible label. Visually hidden by default (`hideLabel` is true). */
  label: ReactNode;
  /** Hide the label visually. Default true: a search field usually explains itself. Set false to show it, like Field. */
  hideLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  value?: string;
  defaultValue?: string;
  /** Called with the new text. */
  onValueChange?: (value: string) => void;
  /** Shortcut hint shown while the field is empty, e.g. "⌘K". The shortcut itself is up to the app. */
  shortcut?: ReactNode;
  labels?: Partial<SearchInputLabels>;
  /** @deprecated Use hideLabel={false}. Removed in 2.0.0. */
  showLabel?: boolean;
  /** @deprecated Use onValueChange. In 2.0.0 onChange gets the native change event, like Input. */
  onChange?: (value: string) => void;
  /** @deprecated Use labels.clear. Removed in 2.0.0. */
  clearLabel?: string;
}

/** Search field with clear button. Wrap it in <form role="search"> or a region with role="search". */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { label, hideLabel, showLabel, size = 'md', value, defaultValue = '', onValueChange, onChange, shortcut, labels, clearLabel, placeholder: placeholderProp, disabled, className, id, onKeyDown, ...rest },
  ref,
) {
  const placeholder = useText('searchInput.placeholder', placeholderProp);
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current as HTMLInputElement);
  const l = useLabels('searchInput', DEFAULT_SEARCH_INPUT_LABELS, labels, { clear: clearLabel });
  const [current, set] = useControlled(value, defaultValue, (v) => { onValueChange?.(v); onChange?.(v); });
  const hidden = hideLabel ?? (showLabel === undefined ? true : !showLabel);

  return (
    <Field id={id} label={label} hideLabel={hidden} disabled={disabled} className={className}>
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
            <button type="button" className="rb-control__clear" aria-label={l.clear} onClick={() => { set(''); inner.current?.focus(); }}>
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
