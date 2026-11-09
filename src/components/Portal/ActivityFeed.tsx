import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Portal2.css';

export interface ActivityFeedProps extends HTMLAttributes<HTMLOListElement> {
  /** ActivityItem elements, in one chosen order (newest first or oldest first). */
  children: ReactNode;
}

/** Timeline of events, e.g. the status history of an application. */
export function ActivityFeed({ className, children, ...rest }: ActivityFeedProps) {
  return <ol className={cx('rb-activity', className)} {...rest}>{children}</ol>;
}

export interface ActivityItemProps {
  title: ReactNode;
  /** Shown time, e.g. "12 okt., 09:14". */
  time: string;
  /** Machine-readable time for <time dateTime>. */
  dateTime?: string;
  /** Icon (lucide) or an <Avatar size="sm" />. Without both a dot is shown. */
  icon?: ReactNode;
  avatar?: ReactNode;
  children?: ReactNode;
}

export function ActivityItem({ title, time, dateTime, icon, avatar, children }: ActivityItemProps) {
  const kind = avatar ? 'avatar' : icon ? 'icon' : 'dot';
  return (
    <li className="rb-activity__item">
      <span className={cx('rb-activity__marker', `rb-activity__marker--${kind}`)} aria-hidden="true">{avatar ?? icon}</span>
      <div className="rb-activity__content">
        <div className="rb-activity__head">
          <p className="rb-activity__title">{title}</p>
          <time className="rb-activity__time" dateTime={dateTime}>{time}</time>
        </div>
        {children && <p className="rb-activity__text">{children}</p>}
      </div>
    </li>
  );
}
