import { cloneElement, isValidElement, useId, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Portal2.css';

export interface SettingsSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** Save/Cancel for a group of fields. Toggles save immediately and need no actions. */
  actions?: ReactNode;
  headingLevel?: 2 | 3;
  /** SettingRow elements or form fields. */
  children: ReactNode;
}

/** Block on a settings page: title and explanation on the left, settings in a card on the right. */
export function SettingsSection({ title, description, actions, headingLevel = 2, className, children, ...rest }: SettingsSectionProps) {
  const id = useId();
  const H = `h${headingLevel}` as 'h2';
  return (
    <section aria-labelledby={id} className={cx('rb-settings', className)} {...rest}>
      <div className="rb-settings__intro">
        <H id={id} className="rb-settings__title">{title}</H>
        {description && <p className="rb-settings__description">{description}</p>}
      </div>
      <div className="rb-settings__card">
        <div className="rb-settings__rows">{children}</div>
        {actions && <div className="rb-settings__actions">{actions}</div>}
      </div>
    </section>
  );
}

export interface SettingRowProps {
  label: ReactNode;
  description?: ReactNode;
  /** Usually a <Toggle /> without label. It gets aria-labelledby and aria-describedby from the row. */
  control: ReactElement<Record<string, unknown>>;
}

export function SettingRow({ label, description, control }: SettingRowProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const descId = description ? `${id}-desc` : undefined;
  const c = isValidElement(control)
    ? cloneElement(control, { 'aria-labelledby': control.props['aria-labelledby'] ?? labelId, 'aria-describedby': control.props['aria-describedby'] ?? descId })
    : control;
  return (
    <div className="rb-setting">
      <div className="rb-setting__text">
        <p id={labelId} className="rb-setting__label">{label}</p>
        {description && <p id={descId} className="rb-setting__description">{description}</p>}
      </div>
      <div className="rb-setting__control">{c}</div>
    </div>
  );
}
