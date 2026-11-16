import { Children, useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Menu, PanelLeft } from 'lucide-react';
import { cx } from '../../utils/cx';
import { mergeLabels } from '../../utils/labels';
import { ButtonIcon } from '../Button/Button';
import { Divider } from '../Display/Display';
import { Slideout } from '../Overlay/Slideout';
import { NavCompactContext, NavItem } from './Navigation';
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
  /** Name of the navigation. Default "Main menu". */
  label?: string;
  labels?: Partial<HeaderLabels>;
  /** @deprecated Use label. Removed in 2.0.0. */
  navLabel?: string;
  /** @deprecated Use labels.menu. Removed in 2.0.0. */
  menuLabel?: string;
  /** @deprecated Use labels.menuTitle. Removed in 2.0.0. */
  menuTitle?: ReactNode;
}
export interface HeaderLabels {
  /** Name of the navigation. */
  label: string;
  /** Name of the menu button on small screens. */
  menu: string;
  /** Title of the mobile menu panel. */
  menuTitle: ReactNode;
}
export const DEFAULT_HEADER_LABELS: HeaderLabels = { label: 'Main menu', menu: 'Open menu', menuTitle: 'Menu' };

/** Top bar. Below 900px the links move into a Slideout behind a menu button. */
export function Header({ logo, links = [], actions, label, labels, navLabel, menuLabel, menuTitle, className, ...rest }: HeaderProps) {
  const l = mergeLabels(DEFAULT_HEADER_LABELS, labels, { label: label ?? navLabel, menu: menuLabel, menuTitle });
  const [open, setOpen] = useState(false);
  return (
    <header className={cx('rb-header', className)} {...rest}>
      <div className="rb-header__logo">{logo}</div>
      {links.length > 0 && (
        <nav aria-label={l.label} className="rb-header__nav">
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
          <ButtonIcon className="rb-header__menu" hierarchy="secondary" icon={<Menu />} aria-label={l.menu} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)} />
        )}
      </div>
      {links.length > 0 && (
        <Slideout open={open} onClose={() => setOpen(false)} title={l.menuTitle} size="sm">
          <nav aria-label={l.label}>
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
  /** Logo when collapsed, usually the logo mark only. Default: logo. */
  logoCollapsed?: ReactNode;
  /** Usually a SearchInput (size sm). */
  search?: ReactNode;
  /** Search when collapsed, usually a ButtonIcon that opens the CommandMenu. */
  searchCollapsed?: ReactNode;
  /** Main navigation: NavItem elements. Each is wrapped in a list item. */
  children: ReactNode;
  /** Secondary navigation at the bottom: NavItem elements. */
  footer?: ReactNode;
  /** Usually SidebarUser. */
  user?: ReactNode;
  /** User when collapsed, usually the Avatar only. */
  userCollapsed?: ReactNode;
  /** Name of the main navigation. Default "Main menu". */
  label?: string;
  labels?: Partial<SidebarLabels>;
  /** Show only icons. Use with onCollapsedChange to show the collapse button. */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** @deprecated Use label. Removed in 2.0.0. */
  navLabel?: string;
  /** @deprecated Use labels.footer. Removed in 2.0.0. */
  footerLabel?: string;
  /** @deprecated Use labels.collapse. Removed in 2.0.0. */
  collapseLabel?: string;
  /** @deprecated Use labels.expand. Removed in 2.0.0. */
  expandLabel?: string;
}
export interface SidebarLabels {
  /** Name of the main navigation. */
  label: string;
  /** Name of the navigation at the bottom. */
  footer: string;
  collapse: string;
  expand: string;
}
export const DEFAULT_SIDEBAR_LABELS: SidebarLabels = { label: 'Main menu', footer: 'More', collapse: 'Collapse sidebar', expand: 'Expand sidebar' };

const asList = (nodes: ReactNode) => (
  <ul className="rb-sidebar__list">
    {Children.toArray(nodes).map((n, i) => <li key={i}>{n}</li>)}
  </ul>
);

/** App sidebar: logo, search, main navigation, footer navigation and user. Can collapse to icons only. */
export function Sidebar({ logo, logoCollapsed, search, searchCollapsed, children, footer, user, userCollapsed, label, labels, navLabel, footerLabel, collapsed = false, onCollapsedChange, collapseLabel, expandLabel, className, ...rest }: SidebarProps) {
  const l = mergeLabels(DEFAULT_SIDEBAR_LABELS, labels, { label: label ?? navLabel, footer: footerLabel, collapse: collapseLabel, expand: expandLabel });
  const navId = useId();
  const toggle = onCollapsedChange && (
    <ButtonIcon hierarchy="tertiary" size="sm" icon={<PanelLeft />} aria-label={collapsed ? l.expand : l.collapse} aria-expanded={!collapsed} aria-controls={navId} onClick={() => onCollapsedChange(!collapsed)} className="rb-sidebar__toggle" />
  );
  return (
    <NavCompactContext.Provider value={collapsed}>
      <aside id={navId} className={cx('rb-sidebar', collapsed && 'rb-sidebar--collapsed', className)} {...rest}>
        <div className="rb-sidebar__top">
          <div className="rb-sidebar__logo">{collapsed ? (logoCollapsed ?? logo) : logo}{toggle}</div>
          {collapsed ? searchCollapsed : search}
          <nav aria-label={l.label}>{asList(children)}</nav>
        </div>
        {(footer || user) && (
          <div className="rb-sidebar__bottom">
            {footer && <nav aria-label={l.footer}>{asList(footer)}</nav>}
            {user && <Divider />}
            {collapsed ? (userCollapsed ?? user) : user}
          </div>
        )}
      </aside>
    </NavCompactContext.Provider>
  );
}

export interface DualSidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  /** Small logo at the top of the rail. */
  logo: ReactNode;
  /** Main sections in the rail: NavItem elements with an icon. They show as icons only. */
  rail: ReactNode;
  /** Sections at the bottom of the rail, e.g. Settings and Help. */
  railFooter?: ReactNode;
  /** Usually an Avatar, at the bottom of the rail. */
  avatar?: ReactNode;
  /** Name of the chosen section, the title of the panel. */
  title: ReactNode;
  /** Pages of the chosen section: NavItem elements. */
  children: ReactNode;
  /** Bottom of the panel, usually SidebarUser without avatar. */
  user?: ReactNode;
  /** Hide the panel. The rail stays. */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  labels?: Partial<DualSidebarLabels>;
  /** @deprecated Use labels.rail. Removed in 2.0.0. */
  railLabel?: string;
  /** @deprecated Use labels.railFooter. Removed in 2.0.0. */
  railFooterLabel?: string;
  /** @deprecated Use labels.collapse. Removed in 2.0.0. */
  collapseLabel?: string;
}
export interface DualSidebarLabels {
  /** Name of the navigation in the rail. */
  rail: string;
  /** Name of the navigation at the bottom of the rail. */
  railFooter: string;
  collapse: string;
  /** Name of the button in the rail that opens the panel again. */
  expand: string;
}
export const DEFAULT_DUAL_SIDEBAR_LABELS: DualSidebarLabels = { rail: 'Sections', railFooter: 'More', collapse: 'Collapse panel', expand: 'Expand panel' };

/** Sidebar with two levels: a rail with the main sections and a panel with the pages of the chosen section. */
export function DualSidebar({ logo, rail, railFooter, avatar, title, children, user, collapsed = false, onCollapsedChange, labels, railLabel, railFooterLabel, collapseLabel, className, ...rest }: DualSidebarProps) {
  const l = mergeLabels(DEFAULT_DUAL_SIDEBAR_LABELS, labels, { rail: railLabel, railFooter: railFooterLabel, collapse: collapseLabel });
  const titleId = useId();
  const panelId = useId();
  const expandRef = useRef<HTMLButtonElement>(null);
  const collapseRef = useRef<HTMLButtonElement>(null);
  const toggled = useRef(false);
  const toggle = (next: boolean) => { toggled.current = true; onCollapsedChange?.(next); };
  // The button you pressed disappears, so the focus moves to the button that does the opposite.
  useEffect(() => {
    if (!toggled.current) return;
    toggled.current = false;
    (collapsed ? expandRef : collapseRef).current?.focus();
  }, [collapsed]);
  return (
    <aside className={cx('rb-sidebar', 'rb-sidebar--dual', collapsed && 'rb-sidebar--collapsed', className)} {...rest}>
      <NavCompactContext.Provider value>
        <div className="rb-sidebar__rail">
          <div className="rb-sidebar__top">
            <div className="rb-sidebar__logo">{logo}</div>
            {onCollapsedChange && collapsed && <ButtonIcon ref={expandRef} hierarchy="tertiary" size="sm" icon={<PanelLeft />} aria-label={l.expand} aria-expanded={false} aria-controls={panelId} onClick={() => toggle(false)} className="rb-sidebar__toggle" />}
            <nav aria-label={l.rail}>{asList(rail)}</nav>
          </div>
          <div className="rb-sidebar__bottom">
            {railFooter && <nav aria-label={l.railFooter}>{asList(railFooter)}</nav>}
            {avatar}
          </div>
        </div>
      </NavCompactContext.Provider>
      <div id={panelId} className="rb-sidebar__panel" hidden={collapsed}>
        <div className="rb-sidebar__top">
          <div className="rb-sidebar__panel-head">
            <h2 id={titleId} className="rb-sidebar__panel-title">{title}</h2>
            {onCollapsedChange && <ButtonIcon ref={collapseRef} hierarchy="tertiary" size="sm" icon={<PanelLeft />} aria-label={l.collapse} aria-expanded={!collapsed} aria-controls={panelId} onClick={() => toggle(true)} />}
          </div>
          <nav aria-labelledby={titleId}>{asList(children)}</nav>
        </div>
        {user && <div className="rb-sidebar__bottom">{user}</div>}
      </div>
    </aside>
  );
}

export interface SidebarUserProps {
  avatar?: ReactNode;
  name: ReactNode;
  email?: ReactNode;
  /** E.g. a ButtonIcon to log out. */
  actions?: ReactNode;
  /** @deprecated Use actions. Removed in 2.0.0. */
  action?: ReactNode;
}

export function SidebarUser({ avatar, name, email, actions, action }: SidebarUserProps) {
  const id = useId();
  return (
    <div className="rb-sidebar__user" role="group" aria-labelledby={id}>
      {avatar}
      <span className="rb-sidebar__user-text">
        <span id={id} className="rb-sidebar__user-name">{name}</span>
        {email && <span className="rb-sidebar__user-email">{email}</span>}
      </span>
      {actions ?? action}
    </div>
  );
}
