import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Portal.css';

export interface DescriptionListProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  /** Button in the header, e.g. "Wijzigen". */
  action?: ReactNode;
  /** 2 by default (below the page h1). */
  headingLevel?: 2 | 3 | 4;
  /** Without card border, e.g. inside a Card or Modal. */
  plain?: boolean;
  /** DescriptionItem elements. */
  children: ReactNode;
}

/** Data as label and value, e.g. personal details. Renders a <dl>. */
export function DescriptionList({ title, description, action, headingLevel = 2, plain, className, children, ...rest }: DescriptionListProps) {
  const titleId = useId();
  const H = `h${headingLevel}` as 'h2';
  return (
    <section aria-labelledby={title ? titleId : undefined} className={cx('rb-dlist', plain && 'rb-dlist--plain', className)} {...rest}>
      {(title || action) && (
        <div className="rb-dlist__header">
          <div className="rb-dlist__heading">
            {title && <H id={titleId} className="rb-dlist__title">{title}</H>}
            {description && <p className="rb-dlist__description">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <dl className="rb-dlist__items">{children}</dl>
    </section>
  );
}

export interface DescriptionItemProps {
  label: ReactNode;
  /** The value. Use line breaks (<br />) for addresses. Empty: show "Niet ingevuld" rather than nothing. */
  children: ReactNode;
  /** Action per row, e.g. <Button hierarchy="link" size="sm">Wijzigen<span className="rb-visually-hidden"> e-mailadres</span></Button>. */
  action?: ReactNode;
}

export function DescriptionItem({ label, children, action }: DescriptionItemProps) {
  return (
    <div className="rb-dlist__item">
      <dt className="rb-dlist__label">{label}</dt>
      <dd className="rb-dlist__value">{children}</dd>
      {action && <dd className="rb-dlist__action">{action}</dd>}
    </div>
  );
}
