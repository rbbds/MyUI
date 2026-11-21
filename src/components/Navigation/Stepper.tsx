import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Link } from '../../utils/link';
import { Check } from 'lucide-react';
import { cx } from '../../utils/cx';
import { useLabels } from '../../utils/locale';
import './Stepper.css';

export interface StepItem {
  title: ReactNode;
  description?: ReactNode;
  /** Link back to a completed step. Only used for completed steps. */
  href?: string;
}

export interface StepperLabels {
  /** Name of the navigation. */
  label: string;
  /** Screen reader text per status. */
  complete: string;
  current: string;
  upcoming: string;
}
export const DEFAULT_STEPPER_LABELS: StepperLabels = { label: 'Progress', complete: 'completed', current: 'current step', upcoming: 'to do' };

export interface StepperProps extends HTMLAttributes<HTMLElement> {
  steps: StepItem[];
  /** Index (0-based) of the current step. Steps before it are complete. */
  current: number;
  /**
   * Horizontal switches to compact below 600px.
   * Compact shows short titles above a bar per step. Keep titles to one or two words.
   */
  orientation?: 'horizontal' | 'vertical' | 'compact';
  /** Name of the navigation. Default "Progress". */
  label?: string;
  labels?: Partial<StepperLabels>;
  /** @deprecated Use labels.complete, labels.current and labels.upcoming. Removed in 2.0.0. */
  statusLabels?: { complete: string; current: string; upcoming: string };
}

/** Progress through a multi-step flow. Renders <nav> with an ordered list. */
export const Stepper = forwardRef<HTMLElement, StepperProps>(function Stepper({ steps, current, orientation = 'horizontal', label, labels, statusLabels, 'aria-label': ariaLabel, className, ...rest }, ref) {
  const l = useLabels('stepper', DEFAULT_STEPPER_LABELS, labels, { ...statusLabels, label: label ?? ariaLabel });
  return (
    <nav ref={ref} aria-label={l.label} className={className} {...rest}>
      <ol className={cx('rb-stepper', `rb-stepper--${orientation}`)}>
        {steps.map((s, i) => {
          const status = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const title = status === 'complete' && s.href ? <Link href={s.href} className="rb-step__link">{s.title}</Link> : s.title;
          return (
            <li key={i} className={cx('rb-step', `rb-step--${status}`)} aria-current={status === 'current' ? 'step' : undefined}>
              <span className="rb-step__track" aria-hidden="true">
                <span className="rb-step__indicator">{status === 'complete' ? <Check strokeWidth={3} /> : i + 1}</span>
                <span className="rb-step__connector" />
              </span>
              <span className="rb-step__text">
                <span className="rb-step__title"><span className="rb-step__number" aria-hidden="true">{i + 1}. </span>{title}<span className="rb-visually-hidden">, {l[status]}</span></span>
                {s.description && <span className="rb-step__description">{s.description}</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
