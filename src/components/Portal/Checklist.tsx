import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { Circle, CircleCheck } from 'lucide-react';
import { cx } from '../../utils/cx';
import { ProgressBar } from '../Display/Display';
import './Portal2.css';

export interface ChecklistProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  /** Number of done steps and total, for the progress bar and "2 of 5 steps done". */
  done: number;
  total: number;
  progressLabel?: (done: number, total: number) => string;
  headingLevel?: 2 | 3;
  children: ReactNode;
}

/** Onboarding progress: title, progress and steps. Hide it when everything is done. */
export function Checklist({ title, done, total, progressLabel = (d, t) => `${d} of ${t} steps done`, headingLevel = 2, className, children, ...rest }: ChecklistProps) {
  const id = useId();
  const H = `h${headingLevel}` as 'h2';
  return (
    <section aria-labelledby={id} className={cx('rb-checklist', className)} {...rest}>
      <div className="rb-checklist__header">
        <H id={id} className="rb-checklist__title">{title}</H>
        <p className="rb-checklist__progress">{progressLabel(done, total)}</p>
        <ProgressBar value={done} max={total} label={progressLabel(done, total)} valuePosition="none" />
      </div>
      <ol className="rb-checklist__items">{children}</ol>
    </section>
  );
}

export interface ChecklistItemProps {
  title: ReactNode;
  status: 'done' | 'current' | 'open';
  /** Shown for the current step. */
  description?: ReactNode;
  /** Shown for the current step, e.g. <Button hierarchy="link" size="sm">Check now</Button>. */
  action?: ReactNode;
  doneLabel?: string;
}

export function ChecklistItem({ title, status, description, action, doneLabel = 'Done' }: ChecklistItemProps) {
  return (
    <li className={cx('rb-checklist__item', `rb-checklist__item--${status}`)} aria-current={status === 'current' ? 'step' : undefined}>
      {status === 'done' ? <CircleCheck aria-hidden="true" className="rb-checklist__icon" /> : <Circle aria-hidden="true" className="rb-checklist__icon" />}
      <div className="rb-checklist__text">
        <p className="rb-checklist__item-title">{title}{status === 'done' && <span className="rb-visually-hidden">, {doneLabel}</span>}</p>
        {status === 'current' && description && <p className="rb-checklist__description">{description}</p>}
        {status === 'current' && action}
      </div>
    </li>
  );
}
