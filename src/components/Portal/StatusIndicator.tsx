import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { StatusColor } from '../Display/Display';
import './Portal2.css';

export type StatusIndicatorColor = Exclude<StatusColor, 'brand'>;

export interface StatusIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  /** Status color. There is no brand color: a brand color can look like success or error (for example Forest green). Use info for "in progress". */
  color?: StatusIndicatorColor;
  /** The status in words, e.g. "In behandeling". The text carries the meaning; the dot supports it. */
  children: ReactNode;
}

/** Status of an item: coloured dot and text. Lighter than a Badge, for tables and lists. */
export function StatusIndicator({ color = 'gray', className, children, ...rest }: StatusIndicatorProps) {
  return (
    <span className={cx('rb-status', `rb-status--${color}`, className)} {...rest}>
      <span className="rb-status__dot" aria-hidden="true" />
      {children}
    </span>
  );
}
