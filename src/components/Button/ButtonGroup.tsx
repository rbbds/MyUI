import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControlled, type AccessibleName } from '../../utils/useControlled';
import './ButtonGroup.css';

export interface ButtonGroupOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
}

export type ButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> &
  AccessibleName & {
    options: ButtonGroupOption[];
    /** Chosen option. Leave out (and use defaultValue) to let the group keep its own state. */
    value?: string;
    defaultValue?: string;
    /** Called with the chosen value. */
    onValueChange?: (value: string) => void;
    /** @deprecated Use onValueChange. Removed in 2.0.0. */
    onChange?: (value: string) => void;
  };

/** Segmented control. Each item is a toggle button (aria-pressed). Name it with `label`, e.g. "Period". */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { options, value: valueProp, defaultValue, onValueChange, onChange, label, 'aria-label': ariaLabel, className, ...rest },
  ref,
) {
  const [value, setValue] = useControlled(valueProp, defaultValue ?? options[0]?.value ?? '', (v) => { onValueChange?.(v); onChange?.(v); });
  return (
    <div ref={ref} role="group" aria-label={label ?? ariaLabel} className={cx('rb-button-group', className)} {...rest}>
      {options.map((o) => (
        <button key={o.value} type="button" className="rb-button-group__item" aria-pressed={o.value === value} onClick={() => setValue(o.value)}>
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
});
