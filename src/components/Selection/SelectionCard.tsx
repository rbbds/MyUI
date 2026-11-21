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
  /** Right-aligned extra, e.g. a price ("Free", "€4.95") or a payment logo. */
  aside?: ReactNode;
  /** Slot next to the title, usually a Badge ("Recommended"). Text and images only: it is part of the label. */
  badge?: ReactNode;
  /** Slot for a line below the description: short facts, or the reason why the option is disabled. Stays readable when disabled. Text and images only. */
  meta?: ReactNode;
  /** Slot for free content below the option, inside the card but outside the label: an Alert, extra fields, links, buttons. */
  children?: ReactNode;
}

/** Large clickable option. The option is the label of a native radio or checkbox. */
export const SelectionCard = forwardRef<HTMLInputElement, SelectionCardProps>(function SelectionCard(
  { type = 'radio', title, description, icon, aside, badge, meta, children, disabled, className, ...rest },
  ref,
) {
  const id = useId();
  const describedBy = cx(rest['aria-describedby'], badge ? `${id}-b` : undefined, description ? `${id}-d` : undefined, meta ? `${id}-m` : undefined) || undefined;
  const titleNode = <span id={`${id}-t`} className="rb-selection-card__title">{title}</span>;
  const option = (
    <>
      {icon && <span className="rb-selection-card__icon" aria-hidden="true">{icon}</span>}
      <span className="rb-selection-card__text">
        {badge ? <span className="rb-selection-card__heading">{titleNode}<span id={`${id}-b`} className="rb-selection-card__badge">{badge}</span></span> : titleNode}
        {description && <span id={`${id}-d`} className="rb-selection-card__description">{description}</span>}
        {meta && <span id={`${id}-m`} className="rb-selection-card__meta">{meta}</span>}
      </span>
      {aside && <span className="rb-selection-card__aside">{aside}</span>}
      <span data-size="sm" className={cx('rb-check', 'rb-check--sm', type === 'radio' && 'rb-check--radio', disabled && 'rb-check--disabled')}>
        <span className="rb-check__control">
          <input
            ref={ref}
            type={type}
            className="rb-check__input"
            disabled={disabled}
            aria-labelledby={`${id}-t`}
            {...rest}
            aria-describedby={describedBy}
          />
          {type === 'radio' ? (
            <span className="rb-check__dot" aria-hidden="true" />
          ) : (
            <Check className="rb-check__indicator rb-check__indicator--check" aria-hidden="true" strokeWidth={3} />
          )}
        </span>
      </span>
    </>
  );
  const classes = cx('rb-selection-card', disabled && 'rb-selection-card--disabled', className);
  // Without content the card itself is the label, as before. With content the label is the top part,
  // so buttons and links in the content do not sit inside a label.
  // Pass null or false as children to keep the slot open while it is empty: the option then does not remount when content appears.
  if (children === undefined) return <label className={classes}>{option}</label>;
  return (
    <div className={cx(classes, 'rb-selection-card--has-content')}>
      <label className="rb-selection-card__main">{option}</label>
      <div className="rb-selection-card__content">{children}</div>
    </div>
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
