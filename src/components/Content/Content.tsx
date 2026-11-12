import { useId, useState, type DragEvent, type HTMLAttributes, type InputHTMLAttributes, type ReactNode, type ThHTMLAttributes } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown, CircleAlert, CircleCheck, CloudUpload, File as FileIcon, Minus, Plus, Trash2 } from 'lucide-react';
import { cx } from '../../utils/cx';
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
  children: ReactNode;
}
/** Bordered container for a table with an optional header. Put a <Table> inside. */
export function TableCard({ title, badge, actions, toolbar, headingLevel = 3, className, children, ...rest }: TableCardProps) {
  const H = `h${headingLevel}` as 'h3';
  return (
    <div className={cx('rb-table-wrap', className)} {...rest}>
      {(title || actions) && <div className="rb-table-wrap__header">{title && <H className="rb-table-wrap__title">{title}</H>}{badge}{actions && <div className="rb-table-wrap__actions">{actions}</div>}</div>}
      {toolbar}
      <div className="rb-table-scroll">{children}</div>
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
  action?: ReactNode;
  elevated?: boolean;
}
export function Card({ media, meta, title, href, description, action, elevated, className, children, ...rest }: CardProps) {
  return (
    <article className={cx('rb-card', elevated && 'rb-card--elevated', href && 'rb-card--link', className)} {...rest}>
      {media}
      <div className="rb-card__body">
        <div className="rb-card__text">
          {meta && <p className="rb-card__meta">{meta}</p>}
          <h3 className="rb-card__title">{href ? <a href={href}>{title}</a> : title}</h3>
          {description && <p className="rb-card__description">{description}</p>}
        </div>
        {children}
        {!href && action}
      </div>
    </article>
  );
}

/* ---------- Accordion ---------- */
export interface AccordionItem { id: string; title: ReactNode; content: ReactNode }
export interface AccordionProps { items: AccordionItem[]; allowMultiple?: boolean; defaultOpen?: string[]; headingLevel?: 2 | 3 | 4 }
export function Accordion({ items, allowMultiple = true, defaultOpen = [], headingLevel = 3 }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const base = useId();
  const H = `h${headingLevel}` as 'h3';
  const toggle = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : allowMultiple ? [...o, id] : [id]));
  return (
    <div className="rb-accordion">
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
}

/* ---------- Empty state ---------- */
export interface EmptyStateProps { icon?: ReactNode; title: ReactNode; description?: ReactNode; actions?: ReactNode }
export function EmptyState({ icon, title, description, actions }: EmptyStateProps) {
  return (
    <div className="rb-empty">
      {icon}
      <div className="rb-empty__text">
        <h3 className="rb-empty__title">{title}</h3>
        {description && <p className="rb-empty__description">{description}</p>}
      </div>
      {actions && <div className="rb-empty__actions">{actions}</div>}
    </div>
  );
}

/* ---------- File upload ---------- */
export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  onFiles: (files: File[]) => void;
  hint?: ReactNode;
  actionLabel?: string;
  dropLabel?: string;
}
/** Drop zone backed by a real file input: click, keyboard and drag-and-drop. */
export function FileUpload({ onFiles, hint, actionLabel = 'Click to upload', dropLabel = 'or drag a file here', disabled, className, ...rest }: FileUploadProps) {
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
      <input type="file" className="rb-upload__input" disabled={disabled} aria-label={actionLabel} aria-describedby={hint ? hintId : undefined} onChange={(e) => onFiles(Array.from(e.target.files ?? []))} {...rest} />
      <span className="rb-upload__icon" aria-hidden="true"><CloudUpload /></span>
      <p className="rb-upload__text"><span className="rb-upload__action">{actionLabel}</span> {dropLabel}</p>
      {hint && <p id={hintId} className="rb-upload__hint">{hint}</p>}
    </div>
  );
}

export interface FileUploadItemProps { name: string; size?: string; progress?: number; status?: 'uploading' | 'complete' | 'error'; error?: ReactNode; onRemove?: () => void }
export function FileUploadItem({ name, size, progress = 0, status = 'uploading', error, onRemove }: FileUploadItemProps) {
  const isErr = status === 'error';
  return (
    <div className={cx('rb-file', isErr && 'rb-file--error')} aria-live="polite">
      <FeaturedIcon color={isErr ? 'error' : 'brand'} size="md" icon={isErr ? <CircleAlert /> : <FileIcon />} />
      <div className="rb-file__content">
        <p className="rb-file__name">{name}</p>
        <p className="rb-file__meta">{isErr ? error ?? 'Upload failed. Try again.' : size}</p>
        {!isErr && <ProgressBar label={`Upload ${name}`} value={status === 'complete' ? 100 : progress} />}
      </div>
      {status === 'complete' ? <span className="rb-file__done" role="img" aria-label="Uploaded"><CircleCheck aria-hidden="true" /></span> : onRemove && <ButtonIcon hierarchy="tertiary" size="sm" icon={<Trash2 aria-hidden />} aria-label={`Remove ${name}`} onClick={onRemove} />}
    </div>
  );
}
