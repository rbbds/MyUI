import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { X } from 'lucide-react';
import { cx } from '../../utils/cx';
import './CloseButton.css';

/** xs: Tag. sm: Alert and Toast. md: Modal and Slideout. */
export type CloseButtonSize = 'xs' | 'sm' | 'md';

export interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: CloseButtonSize;
  /** Required accessible name, for example "Close" or "Remove Design". */
  'aria-label': string;
}

/**
 * Internal close button (Figma: `_Close button`). The hit area and hover surface sit outside the icon
 * (negative margin), so the button takes up only the icon size in the layout.
 */
export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(function CloseButton(
  { size = 'sm', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cx('rb-close', `rb-close--${size}`, className)} {...rest}>
      <X aria-hidden="true" />
    </button>
  );
});
