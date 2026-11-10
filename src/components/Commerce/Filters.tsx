import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Button } from '../Button/Button';
import { Checkbox } from '../Selection/Checkbox';
import { Tag } from '../Display/Display';
import './Commerce.css';

/* ---------- Filter group ---------- */
export interface FilterOption { value: string; label: string; count?: number; disabled?: boolean }
export interface FilterGroupProps {
  title: string;
  options?: FilterOption[];
  /** Selected values (checkbox list). */
  value?: string[];
  onChange?: (value: string[]) => void;
  /** Show this many options; the rest behind "Show more". */
  limit?: number;
  defaultOpen?: boolean;
  /** Heading level of the title. Default 3 (under an h2 such as "Filters"). */
  headingLevel?: 2 | 3 | 4;
  /** Custom content instead of the checkbox list, e.g. a RangeSlider. */
  children?: ReactNode;
  className?: string;
}

/** Collapsible filter section with a checkbox list (or custom content). Stack several in a filter panel. */
export function FilterGroup({ title, options = [], value = [], onChange, limit = 6, defaultOpen = true, headingLevel = 3, children, className }: FilterGroupProps) {
  const H = `h${headingLevel}` as 'h3';
  const [open, setOpen] = useState(defaultOpen);
  const [all, setAll] = useState(false);
  const id = useId();
  const shown = all ? options : options.slice(0, limit);
  const toggle = (v: string) => onChange?.(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <div className={cx('rb-filter', className)}>
      <H className="rb-filter__heading">
        <button type="button" className="rb-filter__trigger" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          <span>{title}{value.length > 0 && <span className="rb-filter__selected"> ({value.length})</span>}</span>
          <ChevronDown aria-hidden="true" className={cx(open && 'is-open')} />
        </button>
      </H>
      <div id={id} className="rb-filter__panel" hidden={!open}>
        {children ?? (
          <fieldset className="rb-filter__list">
            <legend className="rb-visually-hidden">{title}</legend>
            {shown.map((o) => (
              <Checkbox
                key={o.value}
                checked={value.includes(o.value)}
                disabled={o.disabled}
                onChange={() => toggle(o.value)}
                label={<span className="rb-filter__option">{o.label}{o.count !== undefined && <span className="rb-filter__count">{o.count}</span>}</span>}
              />
            ))}
            {options.length > limit && (
              <Button hierarchy="link" size="sm" onClick={() => setAll(!all)}>{all ? 'Show less' : `Show all ${options.length}`}</Button>
            )}
          </fieldset>
        )}
      </div>
    </div>
  );
}

/* ---------- Active filters ---------- */
export interface ActiveFilter { id: string; label: string }
export interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (id: string) => void;
  onClear?: () => void;
  /** Result count, announced politely when it changes. */
  resultCount?: number;
  className?: string;
}

/** Chosen filters as removable Tags, with "Clear all" and the number of results. */
export function ActiveFilters({ filters, onRemove, onClear, resultCount, className }: ActiveFiltersProps) {
  return (
    <div className={cx('rb-active-filters', className)}>
      {resultCount !== undefined && <p className="rb-active-filters__count" role="status">{resultCount} {resultCount === 1 ? 'product' : 'products'}</p>}
      {filters.length > 0 && (
        <ul className="rb-active-filters__list" aria-label="Active filters">
          {filters.map((f) => <li key={f.id}><Tag onRemove={() => onRemove(f.id)} removeLabel={`Remove filter ${f.label}`}>{f.label}</Tag></li>)}
          {onClear && <li><Button hierarchy="link" size="sm" onClick={onClear}>Clear all</Button></li>}
        </ul>
      )}
    </div>
  );
}
