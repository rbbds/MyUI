import type { HTMLAttributes, ReactNode } from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { cx } from '../../utils/cx';
import type { StatusColor } from '../Display/Display';
import './Portal.css';

const ICONS: Record<StatusColor, ReactNode> = {
  gray: <Info />, brand: <Info />, info: <Info />, error: <CircleAlert />, warning: <TriangleAlert />, success: <CircleCheck />,
};

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  color?: StatusColor;
  /** Short, bold first sentence. */
  title?: ReactNode;
  /** What it means or what to do. */
  children?: ReactNode;
  icon?: ReactNode;
  /** Usually <Button hierarchy="link" size="sm">. */
  action?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  /** 'status' for a banner that appears after an action; omit for a banner present on page load. */
  role?: 'status' | 'alert' | 'region';
}

/** Page-wide message above the content (maintenance, incomplete data, new feature). Inside content, use Alert. */
export function Banner({ color = 'brand', title, children, icon, action, onClose, closeLabel = 'Close message', className, role, ...rest }: BannerProps) {
  return (
    <div className={cx('rb-banner', `rb-banner--${color}`, className)} role={role} aria-label={role === 'region' ? 'Message' : undefined} {...rest}>
      <span className="rb-banner__icon" aria-hidden="true">{icon ?? ICONS[color]}</span>
      <div className="rb-banner__body">
        <p className="rb-banner__text">
          {title && <strong className="rb-banner__title">{title}</strong>} {children}
        </p>
        {action && <div className="rb-banner__action">{action}</div>}
      </div>
      {onClose && <button type="button" className="rb-banner__close" onClick={onClose} aria-label={closeLabel}><X aria-hidden="true" /></button>}
    </div>
  );
}
