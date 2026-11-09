import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Portal.css';

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** Usually <Breadcrumbs items={…} />. */
  breadcrumbs?: ReactNode;
  /** Buttons on the right. One Primary per page. */
  actions?: ReactNode;
  /** Usually <Tabs … />, shown below the title. */
  tabs?: ReactNode;
  /** Line below the header. Off when tabs are used (tabs have their own line). */
  divider?: boolean;
  /** 1 by default: one h1 per page. */
  headingLevel?: 1 | 2;
}

/** Top of a page in a portal or dashboard: breadcrumbs, h1, description, actions and optional tabs. */
export function PageHeader({ title, description, breadcrumbs, actions, tabs, divider = !tabs, headingLevel = 1, className, ...rest }: PageHeaderProps) {
  const H = `h${headingLevel}` as 'h1' | 'h2';
  return (
    <header className={cx('rb-page-header', divider && 'rb-page-header--divider', className)} {...rest}>
      {breadcrumbs}
      <div className="rb-page-header__row">
        <div className="rb-page-header__text">
          <H className="rb-page-header__title">{title}</H>
          {description && <p className="rb-page-header__description">{description}</p>}
        </div>
        {actions && <div className="rb-page-header__actions">{actions}</div>}
      </div>
      {tabs}
    </header>
  );
}
