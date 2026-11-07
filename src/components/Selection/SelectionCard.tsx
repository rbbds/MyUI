import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cx } from '../../utils/cx';
import './Selection.css';
import './SelectionCard.css';

export interface SelectionCardProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'title' | 'size'> {
  /** radio: one choice from a group (default); checkbox: multiple choices. */
  type?: 'radio' | 'checkbox';
  title: ReactNode;
  description?: ReactNode;
  /** Optional visual, usually a FeaturedIcon (size sm, color gray). */
  icon?: ReactNode;
  /** Right-aligned extra, e.g. a price ("Gratis", "€ 4,95") or a payment logo. */
  aside?: ReactNode;
}

/** Large clickable option. The whole card is the label of a native radio or checkbox. */
export const SelectionCard = forwardRef<HTMLInputElement, SelectionCardProps>(function SelectionCard(
  { type = 'radio', title, description, icon, aside, disabled, className, ...rest },
  ref,
) {
  const id = useId();
  return (
    <label className={cx('rb-selection-card', disabled && 'rb-selection-card--disabled', className)}>
      {icon && <span className="rb-selection-card__icon" aria-hidden="true">{icon}</span>}
      <span className="rb-selection-card__text">
        <span id={`${id}-t`} className="rb-selection-card__title">{title}</span>
        {description && <span id={`${id}-d`} className="rb-selection-card__description">{description}</span>}
      </span>
      {aside && <span className="rb-selection-card__aside">{aside}</span>}
      <span className={cx('rb-check', 'rb-check--sm', type === 'radio' && 'rb-check--radio', disabled && 'rb-check--disabled')}>
        <span className="rb-check__control">
          <input
            ref={ref}
            type={type}
            className="rb-check__input"
            disabled={disabled}
            aria-labelledby={`${id}-t`}
            aria-describedby={description ? `${id}-d` : undefined}
            {...rest}
          />
          {type === 'radio' ? (
            <span className="rb-check__dot" aria-hidden="true" />
          ) : (
            <Check className="rb-check__indicator rb-check__indicator--check" aria-hidden="true" strokeWidth={3} />
          )}
        </span>
      </span>
    </label>
  );
});

export interface SelectionCardGroupProps {
  /** Question or label for the group, rendered as <legend>. */
  legend: ReactNode;
  hideLegend?: boolean;
  /** Cards per row on wide screens. Always 1 column on small screens. */
  columns?: 1 | 2 | 3;
  children: ReactNode;
  className?: string;
}

export function SelectionCardGroup({ legend, hideLegend, columns = 1, children, className }: SelectionCardGroupProps) {
  return (
    <fieldset className={cx('rb-selection-card-group', `rb-selection-card-group--${columns}`, className)}>
      <legend className={cx('rb-selection-card-group__legend', hideLegend && 'rb-visually-hidden')}>{legend}</legend>
      <div className="rb-selection-card-group__items">{children}</div>
    </fieldset>
  );
}
