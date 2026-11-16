import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { Download, FileText } from 'lucide-react';
import { cx } from '../../utils/cx';
import { mergeLabels } from '../../utils/labels';
import type { HeadingLevel } from '../../utils/useControlled';
import { FeaturedIcon } from '../Display/Display';
import './Portal2.css';

export interface DocumentListProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  /** E.g. <Button hierarchy="link" size="sm">All documents</Button>. */
  actions?: ReactNode;
  /** @deprecated Use actions. Removed in 2.0.0. */
  action?: ReactNode;
  /** 2 by default: a page section below the h1. */
  headingLevel?: HeadingLevel;
  /** DocumentItem elements. Paging is not part of the list: put Pagination or a "Load more" button below it. */
  children: ReactNode;
}

/** List of documents such as invoices, contracts and reports. */
export function DocumentList({ title, actions, action, headingLevel = 2, className, children, ...rest }: DocumentListProps) {
  const id = useId();
  const H = `h${headingLevel}` as 'h2';
  const act = actions ?? action;
  return (
    <section aria-labelledby={title ? id : undefined} className={cx('rb-doclist', className)} {...rest}>
      {(title || act) && <div className="rb-doclist__header">{title && <H id={id} className="rb-doclist__title">{title}</H>}{act}</div>}
      <ul className="rb-doclist__items">{children}</ul>
    </section>
  );
}

export interface DocumentItemProps {
  title: string;
  /** Opens the document (e.g. a PDF in a new tab or a detail page). */
  href: string;
  /** Type, size and date, e.g. "PDF · 240 kB · Oct 12, 2026". */
  meta?: ReactNode;
  /** New document: dot and bold title. */
  unread?: boolean;
  icon?: ReactNode;
  /** Download link. Leave out when href already downloads. */
  downloadHref?: string;
  labels?: Partial<DocumentItemLabels>;
  /** @deprecated Use labels.download. Removed in 2.0.0. */
  downloadLabel?: string;
  /** @deprecated Use labels.unread. Removed in 2.0.0. */
  unreadLabel?: string;
}
export interface DocumentItemLabels {
  /** Name of the download link. */
  download: (title: string) => string;
  /** Screen reader text for a new document. */
  unread: string;
}
export const DEFAULT_DOCUMENT_ITEM_LABELS: DocumentItemLabels = { download: (title) => `Download ${title}`, unread: 'New' };

export function DocumentItem({ title, href, meta, unread, icon, downloadHref, labels, downloadLabel, unreadLabel }: DocumentItemProps) {
  const l = mergeLabels(DEFAULT_DOCUMENT_ITEM_LABELS, labels, { download: downloadLabel === undefined ? undefined : () => downloadLabel, unread: unreadLabel });
  return (
    <li className={cx('rb-doc', unread && 'rb-doc--unread')}>
      {icon ?? <FeaturedIcon size="sm" color="gray" icon={<FileText />} />}
      <div className="rb-doc__text">
        <a href={href} className="rb-doc__title">
          {title}
          {unread && <><span className="rb-doc__dot" aria-hidden="true" /><span className="rb-visually-hidden">, {l.unread}</span></>}
        </a>
        {meta && <p className="rb-doc__meta">{meta}</p>}
      </div>
      {downloadHref && (
        <a href={downloadHref} download data-size="sm" className="rb-button rb-button--icon-only rb-button--tertiary rb-button--sm rb-doc__download" aria-label={l.download(title)}>
          <Download aria-hidden="true" />
        </a>
      )}
    </li>
  );
}
