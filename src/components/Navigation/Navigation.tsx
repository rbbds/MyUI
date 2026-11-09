import { useContext, createContext, useId, useRef, useState, type AnchorHTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight, House } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Button } from '../Button/Button';
import './Navigation.css';

/* ---------- Tabs ---------- */
export interface TabItem { id: string; label: ReactNode; icon?: ReactNode; count?: number; content: ReactNode }
export interface TabsProps {
  items: TabItem[];
  type?: 'underline' | 'pill';
  defaultValue?: string;
  value?: string;
  onChange?: (id: string) => void;
  'aria-label': string;
}
/** WAI-ARIA tabs with roving tabindex and arrow-key navigation. */
export function Tabs({ items, type = 'underline', defaultValue, value, onChange, ...rest }: TabsProps) {
  const [inner, setInner] = useState(defaultValue ?? items[0]?.id);
  const current = value ?? inner;
  const base = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const select = (id: string) => { setInner(id); onChange?.(id); };
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
    <div className="rb-tabs">
      <div role="tablist" aria-label={rest['aria-label']} className={cx('rb-tabs__list', `rb-tabs__list--${type}`)}>
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
}

/* ---------- Breadcrumbs ---------- */
export interface Crumb { label: string; href?: string }
export interface BreadcrumbsProps { items: Crumb[]; homeHref?: string; 'aria-label'?: string }
export function Breadcrumbs({ items, homeHref, ...rest }: BreadcrumbsProps) {
  const Sep = () => <span className="rb-breadcrumbs__sep" aria-hidden="true"><ChevronRight /></span>;
  return (
    <nav className="rb-breadcrumbs" aria-label={rest['aria-label'] ?? 'Kruimelpad'}>
      <ol>
        {homeHref && <li><a href={homeHref} className="rb-breadcrumbs__link" aria-label="Home"><House aria-hidden="true" /></a></li>}
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {(homeHref || i > 0) && <Sep />}
              {last || !c.href ? <span className="rb-breadcrumbs__link" aria-current={last ? 'page' : undefined}>{c.label}</span> : <a href={c.href} className="rb-breadcrumbs__link">{c.label}</a>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------- Pagination ---------- */
export interface PaginationProps { page: number; pageCount: number; onPageChange: (page: number) => void; previousLabel?: string; nextLabel?: string }
function range(page: number, count: number): Array<number | '…'> {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, '…', count];
  if (page >= count - 3) return [1, '…', count - 4, count - 3, count - 2, count - 1, count];
  return [1, '…', page - 1, page, page + 1, '…', count];
}
export function Pagination({ page, pageCount, onPageChange, previousLabel = 'Vorige', nextLabel = 'Volgende' }: PaginationProps) {
  return (
    <nav className="rb-pagination" aria-label="Paginering">
      <Button hierarchy="secondary" size="sm" iconLeading={<ArrowLeft aria-hidden />} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>{previousLabel}</Button>
      <ul className="rb-pagination__pages">
        {range(page, pageCount).map((p, i) => (
          <li key={i}>
            {p === '…' ? <span className="rb-pagination__ellipsis" aria-hidden="true">…</span> : (
              <button type="button" className="rb-pagination__page" aria-current={p === page ? 'page' : undefined} aria-label={`Pagina ${p}`} onClick={() => onPageChange(p)}>{p}</button>
            )}
          </li>
        ))}
      </ul>
      <span className="rb-pagination__compact">Pagina {page} van {pageCount}</span>
      <Button hierarchy="secondary" size="sm" iconTrailing={<ArrowRight aria-hidden />} disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>{nextLabel}</Button>
    </nav>
  );
}

/* ---------- Nav item ---------- */
/** Set by Sidebar (collapsed) and DualSidebar (rail): NavItems then show only their icon. */
export const NavCompactContext = createContext(false);

export interface NavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: ReactNode;
  active?: boolean;
  count?: number;
  /** Text for screen readers after the label when there is a count, e.g. "new". Default "new". */
  countLabel?: string;
}
export function NavItem({ icon, active, count, countLabel = 'new', className, children, ...rest }: NavItemProps) {
  const compact = useContext(NavCompactContext);
  if (compact) {
    return (
      <a className={cx('rb-nav-item', 'rb-nav-item--compact', className)} aria-current={active ? 'page' : undefined} {...rest}>
        {icon}
        <span className="rb-visually-hidden">{children}{count ? `, ${count} ${countLabel}` : ''}</span>
        {!!count && <span className="rb-nav-item__dot" aria-hidden="true" />}
        <span className="rb-nav-item__tip" aria-hidden="true">{children}</span>
      </a>
    );
  }
  return (
    <a className={cx('rb-nav-item', className)} aria-current={active ? 'page' : undefined} {...rest}>
      {icon}
      <span className="rb-nav-item__label">{children}</span>
      {count !== undefined && <span className="rb-nav-item__count">{count}</span>}
    </a>
  );
}
