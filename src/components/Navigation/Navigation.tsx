import { forwardRef, useContext, createContext, useId, useRef, type AnchorHTMLAttributes, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { Link } from '../../utils/link';
import { ArrowLeft, ArrowRight, ChevronRight, House } from 'lucide-react';
import { cx } from '../../utils/cx';
import { mergeLabels } from '../../utils/labels';
import { useControlled, type AccessibleName } from '../../utils/useControlled';
import { Button } from '../Button/Button';
import './Navigation.css';

/* ---------- Tabs ---------- */
export interface TabItem { id: string; label: ReactNode; icon?: ReactNode; count?: number; content: ReactNode }
export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> &
  AccessibleName & {
    items: TabItem[];
    /** Look of the tab list. */
    variant?: 'underline' | 'pill';
    /** @deprecated Use variant. Removed in 2.0.0. */
    type?: 'underline' | 'pill';
    defaultValue?: string;
    value?: string;
    /** Called with the id of the chosen tab. */
    onValueChange?: (id: string) => void;
    /** @deprecated Use onValueChange. Removed in 2.0.0. */
    onChange?: (id: string) => void;
  };
/** WAI-ARIA tabs with roving tabindex and arrow-key navigation. Name the tab list with `label`. */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { items, variant, type, defaultValue, value, onValueChange, onChange, label, 'aria-label': ariaLabel, className, ...rest },
  ref,
) {
  const look = variant ?? type ?? 'underline';
  const [wanted, select] = useControlled(value, defaultValue ?? items[0]?.id, (id) => { if (id === undefined) return; onValueChange?.(id); onChange?.(id); });
  /* An unknown value falls back to the first tab, so the tab list always has one tab stop. */
  const current = items.some((t) => t.id === wanted) ? wanted : items[0]?.id;
  const base = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = items.length;
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % n;
    if (e.key === 'ArrowLeft') next = (i - 1 + n) % n;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = n - 1;
    if (next >= 0) { e.preventDefault(); refs.current[next]?.focus(); select(items[next].id); }
  };
  return (
    <div ref={ref} className={cx('rb-tabs', className)} {...rest}>
      <div role="tablist" aria-label={label ?? ariaLabel} className={cx('rb-tabs__list', `rb-tabs__list--${look}`)}>
        {items.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            type="button"
            id={`${base}-tab-${t.id}`}
            aria-selected={t.id === current}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={t.id === current ? 0 : -1}
            className="rb-tab"
            onClick={() => select(t.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.icon}{t.label}{t.count !== undefined && <span className="rb-tab__count">{t.count}</span>}
          </button>
        ))}
      </div>
      {items.map((t) => (
        <div key={t.id} role="tabpanel" id={`${base}-panel-${t.id}`} aria-labelledby={`${base}-tab-${t.id}`} hidden={t.id !== current} tabIndex={0} className="rb-tabs__panel">
          {t.content}
        </div>
      ))}
    </div>
  );
});

/* ---------- Breadcrumbs ---------- */
export interface Crumb { label: string; href?: string }
export interface BreadcrumbsLabels {
  /** Name of the navigation landmark. */
  label: string;
  /** Screen reader name for the home link. */
  home: string;
  /** Text of the back link when `back.label` is not set. */
  back: string;
}
export const DEFAULT_BREADCRUMBS_LABELS: BreadcrumbsLabels = { label: 'Breadcrumb', home: 'Home', back: 'Back' };
export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: Crumb[];
  homeHref?: string;
  /** Back link before the trail, for example to the previous overview. */
  back?: { href: string; label?: string };
  /** Name of the navigation landmark. Default "Breadcrumb". */
  label?: string;
  labels?: Partial<BreadcrumbsLabels>;
  /** @deprecated Use labels.home. Removed in 2.0.0. */
  homeLabel?: string;
  /** @deprecated Use labels.back. Removed in 2.0.0. */
  backLabel?: string;
}
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, homeHref, back, label, labels, homeLabel, backLabel, 'aria-label': ariaLabel, className, ...rest },
  ref,
) {
  const l = mergeLabels(DEFAULT_BREADCRUMBS_LABELS, labels, { home: homeLabel, back: backLabel, label: label ?? ariaLabel });
  const Sep = () => <span className="rb-breadcrumbs__sep" aria-hidden="true"><ChevronRight /></span>;
  return (
    <nav ref={ref} className={cx('rb-breadcrumbs', className)} aria-label={l.label} {...rest}>
      {back && <Link href={back.href} className="rb-breadcrumbs__link rb-breadcrumbs__back"><ArrowLeft aria-hidden="true" />{back.label ?? l.back}</Link>}
      <ol>
        {homeHref && <li><Link href={homeHref} className="rb-breadcrumbs__link" aria-label={l.home}><House aria-hidden="true" /></Link></li>}
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {(homeHref || i > 0) && <Sep />}
              {last || !c.href ? <span className="rb-breadcrumbs__link" aria-current={last ? 'page' : undefined}>{c.label}</span> : <Link href={c.href} className="rb-breadcrumbs__link">{c.label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

/* ---------- Pagination ---------- */
export interface PaginationLabels {
  /** Name of the navigation landmark. */
  label: string;
  previous: string;
  next: string;
  /** Text on small screens, where the page numbers are hidden. */
  pageStatus: (page: number, pageCount: number) => string;
  /** Screen reader name per page button. */
  page: (page: number) => string;
}
export const DEFAULT_PAGINATION_LABELS: PaginationLabels = { label: 'Pagination', previous: 'Previous', next: 'Next', pageStatus: (p, c) => `Page ${p} of ${c}`, page: (p) => `Page ${p}` };
export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Name of the navigation landmark. Default "Pagination". */
  label?: string;
  labels?: Partial<PaginationLabels>;
  /** @deprecated Use labels.previous. Removed in 2.0.0. */
  previousLabel?: string;
  /** @deprecated Use labels.next. Removed in 2.0.0. */
  nextLabel?: string;
  /** @deprecated Use labels.pageStatus. Removed in 2.0.0. */
  pageStatus?: (page: number, pageCount: number) => string;
  /** @deprecated Use labels.page. Removed in 2.0.0. */
  pageLabel?: (page: number) => string;
}
function range(page: number, count: number): Array<number | '…'> {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, '…', count];
  if (page >= count - 3) return [1, '…', count - 4, count - 3, count - 2, count - 1, count];
  return [1, '…', page - 1, page, page + 1, '…', count];
}
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page, pageCount, onPageChange, label, labels, previousLabel, nextLabel, pageStatus, pageLabel, 'aria-label': ariaLabel, className, ...rest },
  ref,
) {
  const l = mergeLabels(DEFAULT_PAGINATION_LABELS, labels, { label: label ?? ariaLabel, previous: previousLabel, next: nextLabel, pageStatus, page: pageLabel });
  return (
    <nav ref={ref} className={cx('rb-pagination', className)} aria-label={l.label} {...rest}>
      <Button hierarchy="secondary" size="sm" iconLeading={<ArrowLeft aria-hidden />} aria-disabled={page <= 1 || undefined} onClick={() => { if (page > 1) onPageChange(page - 1); }}>{l.previous}</Button>
      <ul className="rb-pagination__pages">
        {range(page, pageCount).map((p, i) => (
          <li key={i}>
            {p === '…' ? <span className="rb-pagination__ellipsis" aria-hidden="true">…</span> : (
              <button type="button" className="rb-pagination__page" aria-current={p === page ? 'page' : undefined} aria-label={l.page(p)} onClick={() => onPageChange(p)}>{p}</button>
            )}
          </li>
        ))}
      </ul>
      <span className="rb-pagination__compact">{l.pageStatus(page, pageCount)}</span>
      <Button hierarchy="secondary" size="sm" iconTrailing={<ArrowRight aria-hidden />} aria-disabled={page >= pageCount || undefined} onClick={() => { if (page < pageCount) onPageChange(page + 1); }}>{l.next}</Button>
    </nav>
  );
});

/* ---------- Nav item ---------- */
/** Set by Sidebar (collapsed) and DualSidebar (rail): NavItems then show only their icon. */
export const NavCompactContext = createContext(false);

export interface NavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: ReactNode;
  active?: boolean;
  count?: number;
  /** Text for screen readers after the count, e.g. "new". Default "new". */
  countLabel?: string;
}
export function NavItem({ icon, active, count, countLabel = 'new', className, children, ...rest }: NavItemProps) {
  const compact = useContext(NavCompactContext);
  if (compact) {
    return (
      <Link className={cx('rb-nav-item', 'rb-nav-item--compact', className)} aria-current={active ? 'page' : undefined} {...rest}>
        {icon}
        <span className="rb-visually-hidden">{children}{count ? `, ${count} ${countLabel}` : ''}</span>
        {!!count && <span className="rb-nav-item__dot" aria-hidden="true" />}
        <span className="rb-nav-item__tip" aria-hidden="true">{children}</span>
      </Link>
    );
  }
  return (
    <Link className={cx('rb-nav-item', className)} aria-current={active ? 'page' : undefined} {...rest}>
      {icon}
      <span className="rb-nav-item__label">{children}</span>
      {count !== undefined && <span className="rb-nav-item__count">{count}<span className="rb-visually-hidden"> {countLabel}</span></span>}
    </Link>
  );
}
