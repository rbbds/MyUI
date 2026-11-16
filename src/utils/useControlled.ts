import { useCallback, useRef, useState } from 'react';

/**
 * One rule for controlled and uncontrolled props (PR 7a, M19).
 * Controlled when `value` is not undefined (null counts as a value). Otherwise the component keeps its own
 * state, starting at `defaultValue`. `setValue` updates the own state (when uncontrolled) and calls `onChange`.
 */
export function useControlled<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void): [T, (next: T) => void] {
  const controlled = value !== undefined;
  const [own, setOwn] = useState<T>(defaultValue);
  const current = controlled ? (value as T) : own;
  const changeRef = useRef(onChange);
  changeRef.current = onChange;
  const setValue = useCallback(
    (next: T) => {
      if (!controlled) setOwn(next);
      changeRef.current?.(next);
    },
    [controlled],
  );
  return [current, setValue];
}

/** Heading level for a component title. Page titles (PageHeader) use 1 or 2. */
export type HeadingLevel = 2 | 3 | 4;

/** The accessible name of a component: `label` (preferred) or a plain `aria-label`. One of the two is required. */
export type AccessibleName = { label: string; 'aria-label'?: string } | { label?: undefined; 'aria-label': string };
