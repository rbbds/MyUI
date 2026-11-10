import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { cx } from '../../utils/cx';
import './Portal.css';

export type MetricTrend = 'up' | 'down' | 'neutral';

export interface MetricCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** What is measured, e.g. "Total revenue". */
  label: ReactNode;
  /** The number, already formatted, e.g. "€ 24.580". */
  value: ReactNode;
  /** Change versus the previous period, including the sign, e.g. "+12.4%". */
  delta?: ReactNode;
  /** Colour and arrow of the delta. Up is not always good (costs): pick what the change means. */
  trend?: MetricTrend;
  /** Context of the delta, e.g. "vs last month". */
  meta?: ReactNode;
  /** Usually <FeaturedIcon size="sm" icon={…} />. */
  icon?: ReactNode;
  /** Menu button, e.g. a DropdownMenu trigger. */
  menu?: ReactNode;
  /** Link or button at the bottom, e.g. <Button hierarchy="link" size="sm">View details</Button>. */
  footer?: ReactNode;
  /** Screen reader words for the trend. */
  trendLabels?: Record<MetricTrend, string>;
}

const ICON = { up: ArrowUp, down: ArrowDown, neutral: Minus };
const TREND_LABELS: Record<MetricTrend, string> = { up: 'Up', down: 'Down', neutral: 'No change' };

/** KPI tile: label, value and the change versus the previous period. */
export function MetricCard({ label, value, delta, trend = 'neutral', meta, icon, menu, footer, trendLabels = TREND_LABELS, className, ...rest }: MetricCardProps) {
  const labelId = useId();
  const Icon = ICON[trend];
  return (
    <div role="group" aria-labelledby={labelId} className={cx('rb-metric', className)} {...rest}>
      <div className="rb-metric__header">
        {icon}
        <p id={labelId} className="rb-metric__label">{label}</p>
        {menu && <div className="rb-metric__menu">{menu}</div>}
      </div>
      <p className="rb-metric__value">{value}</p>
      {(delta || meta) && (
        <p className="rb-metric__delta">
          {delta && (
            <span className={cx('rb-metric__trend', `rb-metric__trend--${trend}`)}>
              <Icon aria-hidden="true" />
              <span className="rb-visually-hidden">{trendLabels[trend]}: </span>
              {delta}
            </span>
          )}
          {meta && <span className="rb-metric__meta">{meta}</span>}
        </p>
      )}
      {footer && <div className="rb-metric__footer">{footer}</div>}
    </div>
  );
}
