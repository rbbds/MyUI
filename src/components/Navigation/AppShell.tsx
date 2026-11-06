import { Children, useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { cx } from '../../utils/cx';
import { ButtonIcon } from '../Button/Button';
import { Divider } from '../Display/Display';
import { Slideout } from '../Overlay/Slideout';
import { NavItem } from './Navigation';
import './AppShell.css';

/* ---------- Header ---------- */
export interface HeaderLink {
  label: ReactNode;
  href: string;
  current?: boolean;
  icon?: ReactNode;
}

export interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Logo, usually a link to the home page. */
  logo: ReactNode;
  links?: HeaderLink[];
  /** Right side: notifications, avatar, buttons. */
  actions?: ReactNode;
  navLabel?: string;
  menuLabel?: string;
  /** Title of the mobile menu panel. */
  menuTitle?: ReactNode;
}

/** Top bar. Below 900px the links move into a Slideout behind a menu button. */
export function Header({ logo, links = [], actions, navLabel = 'Hoofdmenu', menuLabel = 'Menu openen', menuTitle = 'Menu', className, ...rest }: HeaderProps) {
  const [open, setOpen] = useState(false);
  return (
    <header className={cx('rb-header', className)} {...rest}>
      <div className="rb-header__logo">{logo}</div>
      {links.length > 0 && (
        <nav aria-label={navLabel} className="rb-header__nav">
          <ul className="rb-header__links">
            {links.map((l, i) => (
              <li key={i}>
                <a href={l.href} className="rb-header__link" aria-current={l.current ? 'page' : undefined}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div className="rb-header__actions">
        {actions}
        {links.length > 0 && (
          <ButtonIcon className="rb-header__menu" hierarchy="secondary" icon={<Menu />} aria-label={menuLabel} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)} />
        )}
      </div>
      {links.length > 0 && (
        <Slideout open={open} onClose={() => setOpen(false)} title={menuTitle} size="sm">
          <nav aria-label={navLabel}>
            <ul className="rb-sidebar__list">
              {links.map((l, i) => (
                <li key={i}><NavItem href={l.href} icon={l.icon} active={l.current}>{l.label}</NavItem></li>
              ))}
            </ul>
          </nav>
        </Slideout>
      )}
    </header>
  );
}

/* ---------- Sidebar ---------- */
export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  logo: ReactNode;
  /** Usually a SearchInput (size sm). */
  search?: ReactNode;
  /** Main navigation: NavItem elements. Each is wrapped in a list item. */
  children: ReactNode;
  /** Secondary navigation at the bottom: NavItem elements. */
  footer?: ReactNode;
  /** Usually SidebarUser. */
  user?: ReactNode;
  navLabel?: string;
  footerLabel?: string;
}

const asList = (nodes: ReactNode) => (
  <ul className="rb-sidebar__list">
    {Children.toArray(nodes).map((n, i) => <li key={i}>{n}</li>)}
  </ul>
);

/** App sidebar: logo, search, main navigation, footer navigation and user. */
export function Sidebar({ logo, search, children, footer, user, navLabel = 'Hoofdmenu', footerLabel = 'Overig', className, ...rest }: SidebarProps) {
  return (
    <aside className={cx('rb-sidebar', className)} {...rest}>
      <div className="rb-sidebar__top">
        <div className="rb-sidebar__logo">{logo}</div>
        {search}
        <nav aria-label={navLabel}>{asList(children)}</nav>
      </div>
      {(footer || user) && (
        <div className="rb-sidebar__bottom">
          {footer && <nav aria-label={footerLabel}>{asList(footer)}</nav>}
          {user && <Divider />}
          {user}
        </div>
      )}
    </aside>
  );
}

export interface SidebarUserProps {
  avatar: ReactNode;
  name: ReactNode;
  email?: ReactNode;
  /** E.g. a ButtonIcon to log out. */
  action?: ReactNode;
}

export function SidebarUser({ avatar, name, email, action }: SidebarUserProps) {
  const id = useId();
  return (
    <div className="rb-sidebar__user" role="group" aria-labelledby={id}>
      {avatar}
      <span className="rb-sidebar__user-text">
        <span id={id} className="rb-sidebar__user-name">{name}</span>
        {email && <span className="rb-sidebar__user-email">{email}</span>}
      </span>
      {action}
    </div>
  );
}
