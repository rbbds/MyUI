import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './ButtonGroup.css';

export interface ButtonGroupOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
}

export interface ButtonGroupProps {
  options: ButtonGroupOption[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the group, e.g. "Periode". */
  'aria-label': string;
  className?: string;
}

/** Segmented control. Each item is a toggle button (aria-pressed). */
export function ButtonGroup({ options, value, onChange, className, ...rest }: ButtonGroupProps) {
  return (
    <div role="group" className={cx('rb-button-group', className)} {...rest}>
      {options.map((o) => (
        <button key={o.value} type="button" className="rb-button-group__item" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}
