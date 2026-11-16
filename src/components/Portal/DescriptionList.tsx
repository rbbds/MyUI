import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { HeadingLevel } from '../../utils/useControlled';
import './Portal.css';

export interface DescriptionListProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  /** Buttons in the header, e.g. "Change". */
  actions?: ReactNode;
  /** @deprecated Use actions. Removed in 2.0.0. */
  action?: ReactNode;
  /** 2 by default: a page section below the h1. */
  headingLevel?: HeadingLevel;
  /** Without card border, e.g. inside a Card or Modal. */
  plain?: boolean;
  /** DescriptionItem elements. */
  children: ReactNode;
}

/** Data as label and value, e.g. personal details. Renders a <dl>. */
export function DescriptionList({ title, description, actions, action, headingLevel = 2, plain, className, children, ...rest }: DescriptionListProps) {
  const titleId = useId();
  const H = `h${headingLevel}` as 'h2';
  const act = actions ?? action;
  return (
    <section aria-labelledby={title ? titleId : undefined} className={cx('rb-dlist', plain && 'rb-dlist--plain', className)} {...rest}>
      {(title || act) && (
        <div className="rb-dlist__header">
          <div className="rb-dlist__heading">
            {title && <H id={titleId} className="rb-dlist__title">{title}</H>}
            {description && <p className="rb-dlist__description">{description}</p>}
          </div>
          {act}
        </div>
      )}
      <dl className="rb-dlist__items">{children}</dl>
    </section>
  );
}

export interface DescriptionItemProps {
  label: ReactNode;
  /** The value. Use line breaks (<br />) for addresses. Empty: show "Not filled in" rather than nothing. */
  children: ReactNode;
  /** Actions per row, e.g. <Button hierarchy="link" size="sm">Change<span className="rb-visually-hidden"> email address</span></Button>. */
  actions?: ReactNode;
  /** @deprecated Use actions. Removed in 2.0.0. */
  action?: ReactNode;
}

export function DescriptionItem({ label, children, actions, action }: DescriptionItemProps) {
  const act = actions ?? action;
  return (
    <div className="rb-dlist__item">
      <dt className="rb-dlist__label">{label}</dt>
      <dd className="rb-dlist__value">{children}</dd>
      {act && <dd className="rb-dlist__action">{act}</dd>}
    </div>
  );
}
