import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import './Feedback.css';

/* ---------- Kbd ---------- */
/** Keyboard shortcut hint, e.g. ⌘K or Esc. Renders a native <kbd>. */
export function Kbd({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <kbd className={cx('rb-kbd', className)} {...rest} />;
}

/* ---------- Skeleton ---------- */
export interface SkeletonProps {
  /** text: line of text; circle: avatar; rect: media or card. */
  variant?: 'text' | 'circle' | 'rect';
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  /** Number of text lines. The last line is shorter. */
  lines?: number;
  className?: string;
}

/**
 * Placeholder shape while content loads. Always hidden from assistive technology:
 * put aria-busy="true" on the container that is loading and announce the result.
 */
export function Skeleton({ variant = 'text', width, height, lines = 1, className }: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <span className={cx('rb-skeleton-lines', className)} aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className="rb-skeleton rb-skeleton--text" style={{ width: i === lines - 1 ? '60%' : width }} />
        ))}
      </span>
    );
  }
  return <span className={cx('rb-skeleton', `rb-skeleton--${variant}`, className)} style={{ width, height }} aria-hidden="true" />;
}
