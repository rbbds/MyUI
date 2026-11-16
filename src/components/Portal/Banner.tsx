import type { HTMLAttributes, ReactNode } from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { ButtonIcon } from '../Button/Button';
import { cx } from '../../utils/cx';
import { mergeLabels } from '../../utils/labels';
import type { StatusColor } from '../Display/Display';
import './Portal.css';

const ICONS: Record<StatusColor, ReactNode> = {
  gray: <Info />, brand: <Info />, info: <Info />, error: <CircleAlert />, warning: <TriangleAlert />, success: <CircleCheck />,
};

export interface BannerLabels {
  /** Name of the close button. */
  close: string;
  /** Name of the banner when role is 'region'. */
  region: string;
}
export const DEFAULT_BANNER_LABELS: BannerLabels = { close: 'Close message', region: 'Message' };

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  color?: StatusColor;
  /** Short, bold first sentence. */
  title?: ReactNode;
  /** What it means or what to do. */
  children?: ReactNode;
  icon?: ReactNode;
  /** Usually <Button hierarchy="link" size="sm">. */
  actions?: ReactNode;
  onClose?: () => void;
  labels?: Partial<BannerLabels>;
  /** @deprecated Use actions. Removed in 2.0.0. */
  action?: ReactNode;
  /** @deprecated Use labels.close. Removed in 2.0.0. */
  closeLabel?: string;
  /** @deprecated Use labels.region. Removed in 2.0.0. */
  regionLabel?: string;
  /** 'status' for a banner that appears after an action; omit for a banner present on page load. */
  role?: 'status' | 'alert' | 'region';
}

/** Page-wide message above the content (maintenance, incomplete data, new feature). Inside content, use Alert. */
export function Banner({ color = 'brand', title, children, icon, actions, action, onClose, labels, closeLabel, regionLabel, className, role, ...rest }: BannerProps) {
  const l = mergeLabels(DEFAULT_BANNER_LABELS, labels, { close: closeLabel, region: regionLabel });
  const act = actions ?? action;
  return (
    <div className={cx('rb-banner', `rb-banner--${color}`, className)} role={role} aria-label={role === 'region' ? l.region : undefined} {...rest}>
      <span className="rb-banner__icon" aria-hidden="true">{icon ?? ICONS[color]}</span>
      <div className="rb-banner__body">
        <p className="rb-banner__text">
          {title && <strong className="rb-banner__title">{title}</strong>} {children}
        </p>
        {act && <div className="rb-banner__action">{act}</div>}
      </div>
      {onClose && <ButtonIcon hierarchy="tertiary" size="sm" className="rb-banner__close" icon={<X aria-hidden="true" />} onClick={onClose} aria-label={l.close} />}
    </div>
  );
}
