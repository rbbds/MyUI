import type { AnchorHTMLAttributes, ReactNode } from 'react';
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
    <a className={cx('rb-bottom-nav__item', className)} aria-current={active ? 'page' : undefined} {...rest}>
      <span className="rb-bottom-nav__indicator" aria-hidden="true">
        {icon}
        {badge && <span className="rb-bottom-nav__badge" />}
      </span>
      <span className="rb-bottom-nav__label">{children}{badge && <span className="rb-visually-hidden">, {badgeLabel}</span>}</span>
    </a>
  );
}

export interface BottomNavigationProps {
  /** 3 to 5 BottomNavItem elements. */
  children: ReactNode;
  'aria-label'?: string;
  className?: string;
}

/** App navigation at the bottom of the screen on mobile. Replaces the Sidebar below 600px. */
export function BottomNavigation({ children, className, ...rest }: BottomNavigationProps) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <nav className={cx('rb-bottom-nav', className)} aria-label={rest['aria-label'] ?? 'Main menu'}>
      <ul className="rb-bottom-nav__list">
        {items.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
    </nav>
  );
}
