import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cx } from '../../utils/cx';
import './Stepper.css';

export interface StepItem {
  title: ReactNode;
  description?: ReactNode;
  /** Link back to a completed step. Only used for completed steps. */
  href?: string;
}

export interface StepperProps {
  steps: StepItem[];
  /** Index (0-based) of the current step. Steps before it are complete. */
  current: number;
  /**
   * Horizontal switches to compact below 600px.
   * Compact shows short titles above a bar per step. Keep titles to one or two words.
   */
  orientation?: 'horizontal' | 'vertical' | 'compact';
  'aria-label'?: string;
  /** Screen reader text per status. */
  statusLabels?: { complete: string; current: string; upcoming: string };
  className?: string;
}

const DEFAULT_LABELS = { complete: 'completed', current: 'current step', upcoming: 'to do' };

/** Progress through a multi-step flow. Renders <nav> with an ordered list. */
export function Stepper({ steps, current, orientation = 'horizontal', statusLabels = DEFAULT_LABELS, className, ...rest }: StepperProps) {
  return (
    <nav aria-label={rest['aria-label'] ?? 'Progress'} className={className}>
      <ol className={cx('rb-stepper', `rb-stepper--${orientation}`)}>
        {steps.map((s, i) => {
          const status = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const title = status === 'complete' && s.href ? <a href={s.href} className="rb-step__link">{s.title}</a> : s.title;
          return (
            <li key={i} className={cx('rb-step', `rb-step--${status}`)} aria-current={status === 'current' ? 'step' : undefined}>
              <span className="rb-step__track" aria-hidden="true">
                <span className="rb-step__indicator">{status === 'complete' ? <Check strokeWidth={3} /> : i + 1}</span>
                <span className="rb-step__connector" />
              </span>
              <span className="rb-step__text">
                <span className="rb-step__title"><span className="rb-step__number" aria-hidden="true">{i + 1}. </span>{title}<span className="rb-visually-hidden">, {statusLabels[status]}</span></span>
                {s.description && <span className="rb-step__description">{s.description}</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
