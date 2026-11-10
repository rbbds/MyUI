import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { Download, FileText } from 'lucide-react';
import { cx } from '../../utils/cx';
import { FeaturedIcon } from '../Display/Display';
import './Portal2.css';

export interface DocumentListProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  /** E.g. <Button hierarchy="link" size="sm">All documents</Button>. */
  action?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  /** DocumentItem elements. Paging is not part of the list: put Pagination or a "Load more" button below it. */
  children: ReactNode;
}

/** List of documents such as invoices, contracts and reports. */
export function DocumentList({ title, action, headingLevel = 2, className, children, ...rest }: DocumentListProps) {
  const id = useId();
  const H = `h${headingLevel}` as 'h2';
  return (
    <section aria-labelledby={title ? id : undefined} className={cx('rb-doclist', className)} {...rest}>
      {(title || action) && <div className="rb-doclist__header">{title && <H id={id} className="rb-doclist__title">{title}</H>}{action}</div>}
      <ul className="rb-doclist__items">{children}</ul>
    </section>
  );
}

export interface DocumentItemProps {
  title: string;
  /** Opens the document (e.g. a PDF in a new tab or a detail page). */
  href: string;
  /** Type, size and date, e.g. "PDF · 240 kB · 12 okt. 2026". */
  meta?: ReactNode;
  /** New document: dot and bold title. */
  unread?: boolean;
  icon?: ReactNode;
  /** Download link. Leave out when href already downloads. */
  downloadHref?: string;
  downloadLabel?: string;
  unreadLabel?: string;
}

export function DocumentItem({ title, href, meta, unread, icon, downloadHref, downloadLabel = `Download ${title}`, unreadLabel = 'New' }: DocumentItemProps) {
  return (
    <li className={cx('rb-doc', unread && 'rb-doc--unread')}>
      {icon ?? <FeaturedIcon size="sm" color="gray" icon={<FileText />} />}
      <div className="rb-doc__text">
        <a href={href} className="rb-doc__title">
          {title}
          {unread && <><span className="rb-doc__dot" aria-hidden="true" /><span className="rb-visually-hidden">, {unreadLabel}</span></>}
        </a>
        {meta && <p className="rb-doc__meta">{meta}</p>}
      </div>
      {downloadHref && (
        <a href={downloadHref} download className="rb-doc__download" aria-label={downloadLabel}>
          <Download aria-hidden="true" />
        </a>
      )}
    </li>
  );
}
