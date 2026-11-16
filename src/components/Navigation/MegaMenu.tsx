import { useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '../../utils/cx';
import './MegaMenu.css';

/* ---------- data ---------- */
export interface MegaMenuLinkItem {
  label: ReactNode;
  href: string;
  /** One short line below the label (desktop only). */
  description?: ReactNode;
  /** Icon, e.g. `<ChartColumn />` from lucide-react. Shown on desktop and in the mobile menu. */
  icon?: ReactNode;
  /** The current page: aria-current="page". */
  current?: boolean;
}
export interface MegaMenuColumn {
  heading: ReactNode;
  links: MegaMenuLinkItem[];
}
export interface MegaMenuData {
  /** 2 to 4 columns. */
  columns: MegaMenuColumn[];
  /** Optional block on the right, e.g. a `MegaMenuFeatured`. Desktop only. */
  featured?: ReactNode;
}

/* ---------- MegaMenuLink ---------- */
export interface MegaMenuLinkProps extends Omit<HTMLAttributes<HTMLAnchorElement>, 'children'>, MegaMenuLinkItem {}

/** Link in a Mega menu: icon, label and a one-line description. */
export function MegaMenuLink({ label, href, description, icon, current, className, ...rest }: MegaMenuLinkProps) {
  return (
    <a href={href} className={cx('rb-mega-link', className)} aria-current={current ? 'page' : undefined} {...rest}>
      {icon && <span className="rb-mega-link__icon" aria-hidden="true">{icon}</span>}
      <span className="rb-mega-link__text">
        <span className="rb-mega-link__title">{label}</span>
        {description && <span className="rb-mega-link__description">{description}</span>}
      </span>
    </a>
  );
}

/* ---------- MegaMenuFeatured ---------- */
export interface MegaMenuFeaturedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  /** Image or illustration. Decorative unless you give it an alt text. */
  media?: ReactNode;
  /** Usually a Button with hierarchy "link". */
  action?: ReactNode;
}
/** Highlighted block on the right of a Mega menu. */
export function MegaMenuFeatured({ title, media, action, children, className, ...rest }: MegaMenuFeaturedProps) {
  return (
    <div className={cx('rb-mega-menu__featured', className)} {...rest}>
      <div className="rb-mega-menu__featured-media">{media}</div>
      <p className="rb-mega-menu__featured-title">{title}</p>
      {children && <p className="rb-mega-menu__featured-text">{children}</p>}
      {action}
    </div>
  );
}

/* ---------- MegaMenu ---------- */
export interface MegaMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, MegaMenuData {}

/**
 * Panel with columns of links, below a Header nav item. Header renders it for links with a `menu`.
 * Use it on its own only for a custom header. It is a disclosure: plain links, no ARIA menu.
 */
export function MegaMenu({ columns, featured, className, ...rest }: MegaMenuProps) {
  const base = useId();
  return (
    <div className={cx('rb-mega-menu', className)} {...rest}>
      <div className="rb-mega-menu__columns">
        {columns.map((c, i) => (
          <div key={i} className="rb-mega-menu__column">
            <p id={`${base}-${i}`} className="rb-mega-menu__heading">{c.heading}</p>
            <ul className="rb-mega-menu__links" aria-labelledby={`${base}-${i}`}>
              {c.links.map((l, j) => <li key={j}><MegaMenuLink {...l} /></li>)}
            </ul>
          </div>
        ))}
      </div>
      {featured}
    </div>
  );
}

/* ---------- MobileNav ---------- */
export interface MobileNavItem {
  label: ReactNode;
  /** Link of the item. Leave out when the item only opens its subpages. */
  href?: string;
  current?: boolean;
  /** Subpages: the links of all columns, in order. */
  menu?: MegaMenuData;
}
export interface MobileNavProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: MobileNavItem[];
  /** Name of the navigation. */
  label: string;
}

const hasCurrent = (m?: MegaMenuData) => Boolean(m?.columns.some((c) => c.links.some((l) => l.current)));

/** Navigation for the mobile menu. Items with subpages expand in place (accordion). Header renders it in its Slideout. */
export function MobileNav({ items, label, className, ...rest }: MobileNavProps) {
  const base = useId();
  /* the section of the current page starts open */
  const [open, setOpen] = useState<number | null>(() => {
    const i = items.findIndex((it) => hasCurrent(it.menu));
    return i < 0 ? null : i;
  });
  return (
    <nav aria-label={label} className={cx('rb-mobile-nav', className)} {...rest}>
      <ul className="rb-mobile-nav__list">
        {items.map((it, i) => {
          const subId = `${base}-${i}`;
          const expanded = open === i;
          const links = it.menu?.columns.flatMap((c) => c.links) ?? [];
          return (
            <li key={i} className="rb-mobile-nav__entry">
              {it.menu ? (
                <>
                  <button
                    type="button"
                    className={cx('rb-mobile-nav__item', hasCurrent(it.menu) && 'is-current')}
                    aria-expanded={expanded}
                    aria-controls={subId}
                    onClick={() => setOpen(expanded ? null : i)}
                  >
                    <span className="rb-mobile-nav__label">{it.label}</span>
                    <ChevronDown aria-hidden="true" className="rb-mobile-nav__chevron" />
                  </button>
                  <ul id={subId} className="rb-mobile-nav__sub" hidden={!expanded}>
                    {links.map((l, j) => (
                      <li key={j}>
                        <a href={l.href} className="rb-mobile-nav__sublink" aria-current={l.current ? 'page' : undefined}>
                          {l.icon && <span className="rb-mobile-nav__icon" aria-hidden="true">{l.icon}</span>}
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <a href={it.href} className="rb-mobile-nav__item" aria-current={it.current ? 'page' : undefined}>
                  <span className="rb-mobile-nav__label">{it.label}</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
