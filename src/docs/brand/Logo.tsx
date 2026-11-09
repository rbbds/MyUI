import type { HTMLAttributes } from 'react';
import './Logo.css';

export interface LogoProps extends HTMLAttributes<HTMLSpanElement> {
  /** large: mark + wordmark + tagline. small: mark only. Same as the Size property of _Logo in Figma. */
  size?: 'large' | 'small';
  /** Tagline under the wordmark (large only). */
  tagline?: string;
  /** Accessible name. The visual parts are hidden from screen readers. */
  label?: string;
}

/** The mark: brand-solid square with two eyes. Follows the active brand and radius tokens. */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg className={`myui-logo__mark ${className}`} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect className="myui-logo__bg" width="32" height="32" />
      <circle className="myui-logo__eye" cx="9.5" cy="13" r="6.5" />
      <circle className="myui-logo__pupil" cx="8" cy="11.5" r="3" />
      <circle className="myui-logo__eye" cx="22.5" cy="13" r="6.5" />
      <circle className="myui-logo__pupil" cx="21" cy="11.5" r="3" />
    </svg>
  );
}

/** MyUI logo for docs and Storybook. Not part of the library export: it is MyUI's own brand. */
export function Logo({ size = 'large', tagline = 'Eyes on every detail', label = 'MyUI', className = '', ...rest }: LogoProps) {
  return (
    <span role="img" aria-label={label} className={`myui-logo myui-logo--${size} sb-unstyled ${className}`} {...rest}>
      <span className="myui-logo__row">
        <LogoMark />
        {size === 'large' && <span className="myui-logo__wordmark" aria-hidden="true">MyUI</span>}
      </span>
      {size === 'large' && tagline && <span className="myui-logo__tagline" aria-hidden="true">{tagline}</span>}
    </span>
  );
}
