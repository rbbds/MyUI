import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cx } from '../../utils/cx';
import './Button.css';

/** accent: the action that sells, for example Add to cart or Buy now. Use it once per screen. */
export type ButtonHierarchy = 'primary' | 'accent' | 'secondary' | 'tertiary' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. Use one Primary per view. */
  hierarchy?: ButtonHierarchy;
  size?: ButtonSize;
  /** Destructive variant for irreversible actions. Pair with a confirmation step. */
  destructive?: boolean;
  /** Icon before the label, e.g. `<Plus />` from lucide-react. */
  iconLeading?: ReactNode;
  /** Icon after the label. */
  iconTrailing?: ReactNode;
  /** Shows a spinner, sets aria-busy and blocks clicks. The button stays focusable (aria-disabled), so focus is not lost. Keep the label. */
  loading?: boolean;
  fullWidth?: boolean;
}

/**
 * M9: a loading or aria-disabled button stays focusable but ignores clicks (and does not submit a form).
 * `disabled` would drop the focus to the page when the button disables itself.
 */
function blockWhenBusy(loading: boolean | undefined, rest: ButtonHTMLAttributes<HTMLButtonElement>) {
  const off = Boolean(loading) || rest['aria-disabled'] === true || rest['aria-disabled'] === 'true';
  if (!off) return {};
  return {
    'aria-disabled': true as const,
    onClick: (e: MouseEvent<HTMLButtonElement>) => { e.preventDefault(); },
  };
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { hierarchy = 'primary', size = 'md', destructive, iconLeading, iconTrailing, loading, fullWidth, disabled, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-size={size}
      className={cx('rb-button', `rb-button--${hierarchy}`, `rb-button--${size}`, destructive && 'rb-button--destructive', fullWidth && 'rb-button--full', className)}
      disabled={disabled}
      aria-busy={loading || undefined}
      {...rest}
      {...blockWhenBusy(loading, rest)}
    >
      {loading ? <LoaderCircle className="rb-button__spinner" aria-hidden="true" /> : iconLeading}
      {children}
      {iconTrailing}
    </button>
  );
});

export interface ButtonIconProps extends Omit<ButtonProps, 'iconLeading' | 'iconTrailing' | 'children' | 'hierarchy'> {
  hierarchy?: Exclude<ButtonHierarchy, 'link' | 'accent'>;
  /** The icon to render, e.g. `<Plus />`. */
  icon: ReactNode;
  /** Required accessible name. Also show it in a Tooltip. */
  'aria-label': string;
}

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(function ButtonIcon(
  { icon, hierarchy = 'secondary', size = 'md', destructive, loading, disabled, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-size={size}
      className={cx('rb-button', 'rb-button--icon-only', `rb-button--${hierarchy}`, `rb-button--${size}`, destructive && 'rb-button--destructive', className)}
      disabled={disabled}
      aria-busy={loading || undefined}
      {...rest}
      {...blockWhenBusy(loading, rest)}
    >
      {loading ? <LoaderCircle className="rb-button__spinner" aria-hidden="true" /> : icon}
    </button>
  );
});
