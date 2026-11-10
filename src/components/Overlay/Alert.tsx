import type { HTMLAttributes, ReactNode } from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { cx } from '../../utils/cx';
import type { StatusColor } from '../Display/Display';
import './Overlay.css';

const ICONS: Record<StatusColor, ReactNode> = {
  gray: <Info />, brand: <Info />, info: <Info />, error: <CircleAlert />, warning: <TriangleAlert />, success: <CircleCheck />,
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  color?: StatusColor;
  /** What happened. */
  title: ReactNode;
  /** What to do next. */
  children?: ReactNode;
  icon?: ReactNode;
  /** Buttons (e.g. Button hierarchy="link" size="sm"). */
  actions?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  /** Use 'alert' only when the alert appears dynamically for an error or warning. */
  role?: 'alert' | 'status' | 'region';
}

/** Inline message tied to page content. Do not auto-dismiss. */
export function Alert({ color = 'info', title, children, icon, actions, onClose, closeLabel = 'Close', className, role, ...rest }: AlertProps) {
  return (
    <div className={cx('rb-alert', `rb-alert--${color}`, className)} role={role} {...rest}>
      <span className="rb-alert__icon" aria-hidden="true">{icon ?? ICONS[color]}</span>
      <div className="rb-alert__content">
        <div className="rb-alert__text">
          <p className="rb-alert__title">{title}</p>
          {children && <p className="rb-alert__body">{children}</p>}
        </div>
        {actions && <div className="rb-alert__actions">{actions}</div>}
      </div>
      {onClose && <button type="button" className="rb-alert__close" onClick={onClose} aria-label={closeLabel}><X aria-hidden="true" /></button>}
    </div>
  );
}

export type ToastProps = Omit<AlertProps, 'role'>;

/** Temporary notification. Render inside ToastRegion. role="status" (polite). */
export function Toast({ className, ...props }: ToastProps) {
  return <Alert {...props} role="status" className={cx('rb-alert--toast', className)} />;
}

export function ToastRegion({ children, label = 'Notifications' }: { children: ReactNode; label?: string }) {
  return <section className="rb-toast-region" aria-label={label} aria-live="polite">{children}</section>;
}
