import type { ReactElement } from 'react';
import * as Flags from 'country-flag-icons/react/3x2';
import { cx } from '../utils/cx';
import './Flag.css';

export type FlagSize = 'sm' | 'md' | 'lg' | 'xl';

export interface FlagProps {
  /** ISO 3166-1 alpha-2 code, e.g. "NL". Case-insensitive. Also accepts "EU" and "UN". */
  code: string;
  size?: FlagSize;
  /** Accessible name. Leave empty when the flag sits next to the country name (decorative). */
  title?: string;
  className?: string;
}

type FlagComponent = (p: { title?: string; className?: string }) => ReactElement;
const set = Flags as unknown as Record<string, FlagComponent>;

/** True when a flag exists for this code. */
export const hasFlagFor = (code: string) => Boolean(set[code.toUpperCase()]);
/** All supported codes (ISO 3166-1 alpha-2 plus a few extras such as EU). */
export const flagCodes = Object.keys(set).filter((k) => /^[A-Z]{2}$/.test(k)).sort();

/** Country flag, 3:2, from country-flag-icons (MIT). Unknown codes render a neutral placeholder. */
export function Flag({ code, size = 'md', title, className }: FlagProps) {
  const Svg = set[code.toUpperCase()];
  return (
    <span className={cx('rb-flag', `rb-flag--${size}`, className)} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {Svg ? <Svg /> : <span className="rb-flag__placeholder" />}
    </span>
  );
}
