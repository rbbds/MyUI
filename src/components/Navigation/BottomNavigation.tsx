import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { Link } from '../../utils/link';
import { cx } from '../../utils/cx';
import './BottomNavigation.css';

export interface BottomNavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: ReactNode;
  /** Short label, one word. Always visible. */
  children: ReactNode;
  /** Current page. Sets aria-current="page". */
  active?: boolean;
  /** Shows a dot on the icon. */
  badge?: boolean;
  /** Screen reader text for the dot. */
  badgeLabel?: string;
}

/** One destination in BottomNavigation: icon with a label below. */
export function BottomNavItem({ icon, children, active, badge, badgeLabel = 'new', className, ...rest }: BottomNavItemProps) {
  return (
    <Link className={cx('rb-bottom-nav__item', className)} aria-current={active ? 'page' : undefined} {...rest}>
      <span className="rb-bottom-nav__indicator" aria-hidden="true">
        {icon}
        {badge && <span className="rb-bottom-nav__badge" />}
      </span>
      <span className="rb-bottom-nav__label">{children}{badge && <span className="rb-visually-hidden">, {badgeLabel}</span>}</span>
    </Link>
  );
}

export interface BottomNavAction {
  icon: ReactNode;
  /** Screen reader name, for example "New project". */
  label: string;
  onClick?: () => void;
  /** Renders a link instead of a button. */
  href?: string;
}

export interface BottomNavigationProps extends HTMLAttributes<HTMLElement> {
  /** 3 to 5 BottomNavItem elements. With an action, use 4. */
  children: ReactNode;
  /** Raised round button in the middle for the main action. Off by default. */
  action?: BottomNavAction;
  /** Name of the navigation. Default "Main menu". */
  label?: string;
}

/** App navigation at the bottom of the screen on mobile. Replaces the Sidebar below 900px. */
export const BottomNavigation = forwardRef<HTMLElement, BottomNavigationProps>(function BottomNavigation({ children, action, label = 'Main menu', 'aria-label': ariaLabel, className, ...rest }, ref) {
  const items = (Array.isArray(children) ? children : [children]).map((c, i) => <li key={i}>{c}</li>);
  if (action) {
    const inner = <span className="rb-bottom-nav__action-icon" aria-hidden="true">{action.icon}</span>;
    items.splice(Math.ceil(items.length / 2), 0, (
      <li key="action" className="rb-bottom-nav__action-slot">
        {action.href
          ? <Link className="rb-bottom-nav__action" href={action.href} aria-label={action.label} onClick={action.onClick}>{inner}</Link>
          : <button type="button" className="rb-bottom-nav__action" aria-label={action.label} onClick={action.onClick}>{inner}</button>}
      </li>
    ));
  }
  return (
    <nav ref={ref} className={cx('rb-bottom-nav', className)} aria-label={ariaLabel ?? label} {...rest}>
      <ul className="rb-bottom-nav__list">{items}</ul>
    </nav>
  );
});
