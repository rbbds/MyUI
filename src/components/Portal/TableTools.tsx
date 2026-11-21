import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useLabels } from '../../utils/locale';
import { Button } from '../Button/Button';
import { Skeleton } from '../Display/Feedback';
import './Portal.css';

export interface TableToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Left: search and filters. */
  children?: ReactNode;
  /** Right: columns, export. Not the "add" action: that goes in the TableCard header or PageHeader. */
  end?: ReactNode;
}

/** Bar above a table with search, filters, columns and export. Stays visible while rows are selected. */
export function TableToolbar({ children, end, className, ...rest }: TableToolbarProps) {
  return (
    <div className={cx('rb-table-toolbar', className)} {...rest}>
      <div className="rb-table-toolbar__start">{children}</div>
      {end && <div className="rb-table-toolbar__end">{end}</div>}
    </div>
  );
}

export interface TableBulkActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of selected rows. The bar is hidden at 0. */
  count: number;
  onClear: () => void;
  /** Actions for the selection, e.g. Export and a destructive Delete. */
  actions?: ReactNode;
  labels?: Partial<TableBulkActionsLabels>;
  /** @deprecated Use labels.count. Removed in 2.0.0. */
  countLabel?: (count: number) => string;
  /** @deprecated Use labels.clear. Removed in 2.0.0. */
  clearLabel?: string;
}
export interface TableBulkActionsLabels {
  count: (count: number) => string;
  clear: string;
}
export const DEFAULT_TABLE_BULK_ACTIONS_LABELS: TableBulkActionsLabels = { count: (n) => `${n} selected`, clear: 'Clear selection' };

/**
 * Selection bar below the TableToolbar. Clear the selection when search or filters change,
 * so no one acts on rows they cannot see.
 */
export function TableBulkActions({ count, onClear, actions, labels, countLabel, clearLabel, className, ...rest }: TableBulkActionsProps) {
  const l = useLabels('tableBulkActions', DEFAULT_TABLE_BULK_ACTIONS_LABELS, labels, { count: countLabel, clear: clearLabel });
  /* M11: the live region is always there, so the first change ("1 selected") is read out too */
  const status = <p className="rb-visually-hidden" role="status">{count > 0 ? l.count(count) : ''}</p>;
  if (count < 1) return status;
  return (
    <>
      {status}
      <div className={cx('rb-table-bulk', className)} {...rest}>
        <p className="rb-table-bulk__count" aria-hidden="true">{l.count(count)}</p>
        <Button hierarchy="link" size="sm" onClick={onClear}>{l.clear}</Button>
        {actions && <div className="rb-table-bulk__actions">{actions}</div>}
      </div>
    </>
  );
}

/** Skeleton rows while the data loads. Put inside <tbody> and set aria-busy on the table. */
export function TableSkeletonRows({ rows = 4, columns }: { rows?: number; columns: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, r) => (
        <tr key={r} className="rb-table__skeleton" aria-hidden="true">
          {Array.from({ length: columns }, (_, c) => <td key={c}><Skeleton width={c === columns - 1 ? 48 : '70%'} /></td>)}
        </tr>
      ))}
    </>
  );
}

/** Full-width row for an EmptyState inside <tbody>. */
export function TableEmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return <tr className="rb-table__empty"><td colSpan={colSpan}>{children}</td></tr>;
}
