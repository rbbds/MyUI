import { forwardRef, useId, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Bell } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Button } from '../Button/Button';
import { useDismiss } from './Popover';
import './Portal2.css';

export interface NotificationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Number of unread notifications. 0 hides the badge. */
  count?: number;
  label?: string;
  /** Screen reader text for the count. */
  countLabel?: (n: number) => string;
}

/** Bell button for the header. Accessible name includes the count: "Meldingen, 3 ongelezen". */
export const NotificationButton = forwardRef<HTMLButtonElement, NotificationButtonProps>(function NotificationButton(
  { count = 0, label = 'Meldingen', countLabel = (n) => `${n} ongelezen`, className, ...rest }, ref,
) {
  return (
    <button ref={ref} type="button" className={cx('rb-notif-button', className)} aria-label={count > 0 ? `${label}, ${countLabel(count)}` : label} {...rest}>
      <Bell aria-hidden="true" />
      {count > 0 && <span className="rb-notif-button__count" aria-hidden="true">{count > 99 ? '99+' : count}</span>}
    </button>
  );
});

export interface NotificationItemProps {
  title: ReactNode;
  children?: ReactNode;
  time: string;
  dateTime?: string;
  unread?: boolean;
  /** Avatar or icon. */
  avatar?: ReactNode;
  /** Opens the subject. Mark as read in your onClick. */
  href?: string;
  onClick?: () => void;
  unreadLabel?: string;
}

export function NotificationItem({ title, children, time, dateTime, unread, avatar, href, onClick, unreadLabel = 'Ongelezen' }: NotificationItemProps) {
  const inner = (
    <>
      {avatar}
      <span className="rb-notif__content">
        <span className="rb-notif__title">{unread && <span className="rb-visually-hidden">{unreadLabel}: </span>}{title}</span>
        {children && <span className="rb-notif__text">{children}</span>}
        <time className="rb-notif__time" dateTime={dateTime}>{time}</time>
      </span>
      {unread && <span className="rb-notif__dot" aria-hidden="true" />}
    </>
  );
  return (
    <li className={cx('rb-notif', unread && 'rb-notif--unread')}>
      {href ? <a href={href} onClick={onClick} className="rb-notif__link">{inner}</a> : <button type="button" onClick={onClick} className="rb-notif__link">{inner}</button>}
    </li>
  );
}

export interface NotificationPanelProps {
  title?: ReactNode;
  onMarkAllRead?: () => void;
  markAllLabel?: string;
  /** Footer link or button, e.g. "Alle meldingen bekijken". */
  footer?: ReactNode;
  /** Shown when there are no NotificationItems. */
  empty?: ReactNode;
  children?: ReactNode;
  id?: string;
  className?: string;
}

/** Panel with notifications. Use it in NotificationMenu or on its own page. */
export function NotificationPanel({ title = 'Meldingen', onMarkAllRead, markAllLabel = 'Alles gelezen', footer, empty, children, id, className }: NotificationPanelProps) {
  const titleId = useId();
  const has = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <section id={id} aria-labelledby={titleId} className={cx('rb-notif-panel', className)}>
      <div className="rb-notif-panel__header">
        <h2 id={titleId} className="rb-notif-panel__title">{title}</h2>
        {onMarkAllRead && has && <Button hierarchy="link" size="sm" onClick={onMarkAllRead}>{markAllLabel}</Button>}
      </div>
      {has ? <ul className="rb-notif-panel__items">{children}</ul> : <div className="rb-notif-panel__empty">{empty ?? <><p className="rb-notif-panel__empty-title">Geen nieuwe meldingen</p><p>Je bent helemaal bij.</p></>}</div>}
      {footer && <div className="rb-notif-panel__footer">{footer}</div>}
    </section>
  );
}

export interface NotificationMenuProps extends Omit<NotificationPanelProps, 'id'> {
  count?: number;
}

/** NotificationButton that opens a NotificationPanel. Escape or a click outside closes it. */
export function NotificationMenu({ count = 0, ...panel }: NotificationMenuProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();
  useDismiss(open, root, () => { setOpen(false); btn.current?.focus(); });
  return (
    <div ref={root} className="rb-notif-menu">
      <NotificationButton ref={btn} count={count} aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} />
      {open && <NotificationPanel id={id} {...panel} className="rb-notif-menu__panel" />}
    </div>
  );
}
