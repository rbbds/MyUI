import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { Circle, CircleCheck } from 'lucide-react';
import { cx } from '../../utils/cx';
import { mergeLabels } from '../../utils/labels';
import type { HeadingLevel } from '../../utils/useControlled';
import { ProgressBar } from '../Display/Display';
import './Portal2.css';

export interface ChecklistProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  /** Number of done steps and total, for the progress bar and "2 of 5 steps done". */
  done: number;
  total: number;
  /** 2 by default: a page section below the h1. */
  headingLevel?: HeadingLevel;
  labels?: Partial<ChecklistLabels>;
  /** @deprecated Use labels.progress. Removed in 2.0.0. */
  progressLabel?: (done: number, total: number) => string;
  children: ReactNode;
}

export interface ChecklistLabels {
  /** Progress text, also the name of the progress bar. */
  progress: (done: number, total: number) => string;
}
export const DEFAULT_CHECKLIST_LABELS: ChecklistLabels = { progress: (d, t) => `${d} of ${t} steps done` };

/** Onboarding progress: title, progress and steps. Hide it when everything is done. */
export function Checklist({ title, done, total, labels, progressLabel, headingLevel = 2, className, children, ...rest }: ChecklistProps) {
  const l = mergeLabels(DEFAULT_CHECKLIST_LABELS, labels, { progress: progressLabel });
  const id = useId();
  const H = `h${headingLevel}` as 'h2';
  return (
    <section aria-labelledby={id} className={cx('rb-checklist', className)} {...rest}>
      <div className="rb-checklist__header">
        <H id={id} className="rb-checklist__title">{title}</H>
        <p className="rb-checklist__progress">{l.progress(done, total)}</p>
        <ProgressBar value={done} max={total} label={l.progress(done, total)} valuePosition="none" />
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
  actions?: ReactNode;
  labels?: Partial<ChecklistItemLabels>;
  /** @deprecated Use actions. Removed in 2.0.0. */
  action?: ReactNode;
  /** @deprecated Use labels.done. Removed in 2.0.0. */
  doneLabel?: string;
}
export interface ChecklistItemLabels {
  /** Screen reader text after a done step. */
  done: string;
}
export const DEFAULT_CHECKLIST_ITEM_LABELS: ChecklistItemLabels = { done: 'Done' };

export function ChecklistItem({ title, status, description, actions, action, labels, doneLabel }: ChecklistItemProps) {
  const l = mergeLabels(DEFAULT_CHECKLIST_ITEM_LABELS, labels, { done: doneLabel });
  return (
    <li className={cx('rb-checklist__item', `rb-checklist__item--${status}`)} aria-current={status === 'current' ? 'step' : undefined}>
      {status === 'done' ? <CircleCheck aria-hidden="true" className="rb-checklist__icon" /> : <Circle aria-hidden="true" className="rb-checklist__icon" />}
      <div className="rb-checklist__text">
        <p className="rb-checklist__item-title">{title}{status === 'done' && <span className="rb-visually-hidden">, {l.done}</span>}</p>
        {status === 'current' && description && <p className="rb-checklist__description">{description}</p>}
        {status === 'current' && (actions ?? action)}
      </div>
    </li>
  );
}
