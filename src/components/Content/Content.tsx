import { forwardRef, useEffect, useId, useRef, useState, type DragEvent, type HTMLAttributes, type InputHTMLAttributes, type ReactNode, type ThHTMLAttributes } from 'react';
import { Link } from '../../utils/link';
import { ArrowDown, ArrowUp, ChevronsUpDown, CircleAlert, CircleCheck, CloudUpload, File as FileIcon, Minus, Plus, Trash2 } from 'lucide-react';
import { cx } from '../../utils/cx';
import { useLabels } from '../../utils/locale';
import { useControlled, type HeadingLevel } from '../../utils/useControlled';
import { ButtonIcon } from '../Button/Button';
import { FeaturedIcon, ProgressBar } from '../Display/Display';
import './Content.css';

/* ---------- Table ---------- */
export interface TableCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  badge?: ReactNode;
  /** Primary action on the right, e.g. "Add team member". Leave out when the PageHeader already has it. */
  actions?: ReactNode;
  /** TableToolbar and TableBulkActions, shown between the header and the table. */
  toolbar?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  /** Texts. `region` names the scroll area of a wide table when there is no `title`. */
  labels?: Partial<TableCardLabels>;
  children: ReactNode;
}
export interface TableCardLabels { region: string }
export const DEFAULT_TABLE_CARD_LABELS: TableCardLabels = { region: 'Table' };
/** Bordered container for a table with an optional header. Put a <Table> inside. */
export function TableCard({ title, badge, actions, toolbar, headingLevel = 3, labels, className, children, ...rest }: TableCardProps) {
  const H = `h${headingLevel}` as 'h3';
  const titleId = useId();
  const l = useLabels('tableCard', DEFAULT_TABLE_CARD_LABELS, labels);
  // Only a table that is wider than its card is a tab stop: otherwise Tab would land on an area with nothing to scroll.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setScrollable(el.scrollWidth > el.clientWidth + 1);
    check();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(check);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, []);
  return (
    <div className={cx('rb-table-wrap', className)} {...rest}>
      {(title || actions) && <div className="rb-table-wrap__header">{title && <H id={titleId} className="rb-table-wrap__title">{title}</H>}{badge}{actions && <div className="rb-table-wrap__actions">{actions}</div>}</div>}
      {toolbar}
      {/* M11: a scroll area that scrolls is focusable, so keyboard users can scroll a wide table. Named after the title, or labels.region. */}
      <div
        ref={scrollRef}
        className="rb-table-scroll"
        tabIndex={scrollable ? 0 : undefined}
        role={title || scrollable ? 'region' : undefined}
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title && scrollable ? l.region : undefined}
      >{children}</div>
    </div>
  );
}
export function Table({ className, ...rest }: HTMLAttributes<HTMLTableElement>) {
  return <table className={cx('rb-table', className)} {...rest} />;
}
export interface SortableHeaderProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sort?: 'ascending' | 'descending' | 'none';
  onSort?: () => void;
}
/** Column header with optional sort button. Sets aria-sort on the th. */
export function TableHeader({ sort, onSort, children, scope = 'col', ...rest }: SortableHeaderProps) {
  if (!onSort) return <th scope={scope} {...rest}>{children}</th>;
  const Icon = sort === 'ascending' ? ArrowUp : sort === 'descending' ? ArrowDown : ChevronsUpDown;
  return (
    <th scope={scope} aria-sort={sort ?? 'none'} {...rest}>
      <button type="button" className="rb-table__sort" onClick={onSort}>{children}<Icon aria-hidden="true" /></button>
    </th>
  );
}
export function PersonCell({ avatar, name, secondary }: { avatar?: ReactNode; name: ReactNode; secondary?: ReactNode }) {
  return (
    <div className="rb-cell-person">
      {avatar}
      <div><div className="rb-cell-person__primary">{name}</div>{secondary && <div className="rb-cell-person__secondary">{secondary}</div>}</div>
    </div>
  );
}

/* ---------- Card ---------- */
export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  media?: ReactNode;
  meta?: ReactNode;
  title: ReactNode;
  /** Makes the whole card clickable via the title link (single tab stop). */
  href?: string;
  description?: ReactNode;
  /** Buttons or links at the bottom. They stay clickable when the card has an href. */
  actions?: ReactNode;
  /** @deprecated Use actions. Removed in 2.0.0. */
  action?: ReactNode;
  elevated?: boolean;
  /** Level of the title. Default 3. */
  headingLevel?: HeadingLevel;
}
export function Card({ media, meta, title, href, description, actions, action, elevated, headingLevel = 3, className, children, ...rest }: CardProps) {
  const H = `h${headingLevel}` as 'h3';
  const act = actions ?? action;
  return (
    <article className={cx('rb-card', elevated && 'rb-card--elevated', href && 'rb-card--link', className)} {...rest}>
      {media}
      <div className="rb-card__body">
        <div className="rb-card__text">
          {meta && <p className="rb-card__meta">{meta}</p>}
          <H className="rb-card__title">{href ? <Link href={href}>{title}</Link> : title}</H>
          {description && <p className="rb-card__description">{description}</p>}
        </div>
        {children && <div className="rb-card__content">{children}</div>}
        {act && (href ? <div className="rb-card__actions">{act}</div> : act)}
      </div>
    </article>
  );
}

/* ---------- Accordion ---------- */
export interface AccordionItem { id: string; title: ReactNode; content: ReactNode }
export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  items: AccordionItem[];
  allowMultiple?: boolean;
  /** Ids of the open items. Leave out to let the accordion keep its own state. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (open: string[]) => void;
  /** @deprecated Use defaultValue. Removed in 2.0.0. */
  defaultOpen?: string[];
  /** Level of the item headings. Default 3. */
  headingLevel?: HeadingLevel;
}
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion({ items, allowMultiple = true, value, defaultValue, onValueChange, defaultOpen, headingLevel = 3, className, ...rest }, ref) {
  const [open, setOpen] = useControlled(value, defaultValue ?? defaultOpen ?? [], onValueChange);
  const base = useId();
  const H = `h${headingLevel}` as 'h3';
  const toggle = (id: string) => setOpen(open.includes(id) ? open.filter((x) => x !== id) : allowMultiple ? [...open, id] : [id]);
  return (
    <div ref={ref} className={cx('rb-accordion', className)} {...rest}>
      {items.map((it) => {
        const isOpen = open.includes(it.id);
        return (
          <div key={it.id} className="rb-accordion__item">
            <H className="rb-accordion__heading">
              <button type="button" className="rb-accordion__trigger" aria-expanded={isOpen} aria-controls={`${base}-${it.id}`} id={`${base}-${it.id}-btn`} onClick={() => toggle(it.id)}>
                <span>{it.title}</span>{isOpen ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
              </button>
            </H>
            <div id={`${base}-${it.id}`} role={items.length <= 6 ? 'region' : undefined} aria-labelledby={`${base}-${it.id}-btn`} hidden={!isOpen} className="rb-accordion__panel">{it.content}</div>
          </div>
        );
      })}
    </div>
  );
});

/* ---------- Empty state ---------- */
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Level of the title. Default 3. */
  headingLevel?: HeadingLevel;
}
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState({ icon, title, description, actions, headingLevel = 3, className, ...rest }, ref) {
  const H = `h${headingLevel}` as 'h3';
  return (
    <div ref={ref} className={cx('rb-empty', className)} {...rest}>
      {icon}
      <div className="rb-empty__text">
        <H className="rb-empty__title">{title}</H>
        {description && <p className="rb-empty__description">{description}</p>}
      </div>
      {actions && <div className="rb-empty__actions">{actions}</div>}
    </div>
  );
});

/* ---------- File upload ---------- */
export interface FileUploadLabels {
  /** Link-like text, also the name of the file input. */
  action: string;
  drop: string;
}
export const DEFAULT_FILE_UPLOAD_LABELS: FileUploadLabels = { action: 'Click to upload', drop: 'or drag a file here' };
export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  onFiles: (files: File[]) => void;
  hint?: ReactNode;
  labels?: Partial<FileUploadLabels>;
  /** @deprecated Use labels.action. Removed in 2.0.0. */
  actionLabel?: string;
  /** @deprecated Use labels.drop. Removed in 2.0.0. */
  dropLabel?: string;
}
/** Drop zone backed by a real file input: click, keyboard and drag-and-drop. */
export function FileUpload({ onFiles, hint, labels, actionLabel, dropLabel, disabled, className, ...rest }: FileUploadProps) {
  const l = useLabels('fileUpload', DEFAULT_FILE_UPLOAD_LABELS, labels, { action: actionLabel, drop: dropLabel });
  const [active, setActive] = useState(false);
  const hintId = useId();
  const onDrop = (e: DragEvent) => { e.preventDefault(); setActive(false); if (!disabled) onFiles(Array.from(e.dataTransfer.files)); };
  return (
    <div
      className={cx('rb-upload', active && 'rb-upload--active', disabled && 'rb-upload--disabled', className)}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setActive(true); }}
      onDragLeave={() => setActive(false)}
      onDrop={onDrop}
    >
      <input type="file" className="rb-upload__input" disabled={disabled} aria-label={l.action} aria-describedby={hint ? hintId : undefined} onChange={(e) => onFiles(Array.from(e.target.files ?? []))} {...rest} />
      <span data-size="md" className="rb-button rb-button--icon-only rb-button--secondary rb-button--md rb-upload__icon" aria-hidden="true"><CloudUpload /></span>
      <div className="rb-upload__body">
        <p className="rb-upload__text"><span className="rb-upload__action">{l.action}</span> {l.drop}</p>
        {hint && <p id={hintId} className="rb-upload__hint">{hint}</p>}
      </div>
    </div>
  );
}

export interface FileUploadItemLabels {
  failed: string; uploading: (name: string) => string; uploaded: string; remove: (name: string) => string;
  /** Read out when the upload is done. */
  uploadedFile: (name: string) => string;
  /** Read out when the upload fails. */
  failedFile: (name: string) => string;
}
export const DEFAULT_FILE_UPLOAD_ITEM_LABELS: FileUploadItemLabels = {
  failed: 'Upload failed. Try again.', uploading: (name) => `Upload ${name}`, uploaded: 'Uploaded', remove: (name) => `Remove ${name}`,
  uploadedFile: (name) => `${name} uploaded`, failedFile: (name) => `${name}: upload failed`,
};
export interface FileUploadItemProps { name: string; size?: string; progress?: number; status?: 'uploading' | 'complete' | 'error'; error?: ReactNode; onRemove?: () => void; labels?: Partial<FileUploadItemLabels> }
export function FileUploadItem({ name, size, progress = 0, status = 'uploading', error, onRemove, labels }: FileUploadItemProps) {
  const l = useLabels('fileUploadItem', DEFAULT_FILE_UPLOAD_ITEM_LABELS, labels);
  const isErr = status === 'error';
  return (
    <div className={cx('rb-file', isErr && 'rb-file--error')}>
      {/* L6: only the result is read out, not every step of the progress bar */}
      <span className="rb-visually-hidden" role="status">{status === 'complete' ? l.uploadedFile(name) : isErr ? l.failedFile(name) : ''}</span>
      <FeaturedIcon color={isErr ? 'error' : 'brand'} size="md" icon={isErr ? <CircleAlert /> : <FileIcon />} />
      <div className="rb-file__content">
        <p className="rb-file__name">{name}</p>
        <p className="rb-file__meta">{isErr ? error ?? l.failed : size}</p>
        {!isErr && <ProgressBar label={l.uploading(name)} value={status === 'complete' ? 100 : progress} />}
      </div>
      {status === 'complete' ? <span className="rb-file__done" role="img" aria-label={l.uploaded}><CircleCheck aria-hidden="true" /></span> : onRemove && <ButtonIcon hierarchy="tertiary" size="sm" icon={<Trash2 aria-hidden />} aria-label={l.remove(name)} onClick={onRemove} />}
    </div>
  );
}
