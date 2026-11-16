/**
 * Merges the texts of a component (PR 5 pattern, PR 7a): defaults, then `labels`, then the older single
 * text props that are deprecated but still work. Only defined values override.
 */
export function mergeLabels<T extends object>(defaults: T, labels?: Partial<T>, legacy?: Partial<T>): T {
  const out = { ...defaults } as T;
  for (const source of [labels, legacy]) {
    if (!source) continue;
    for (const key of Object.keys(source) as Array<keyof T>) {
      if (source[key] !== undefined) out[key] = source[key] as T[keyof T];
    }
  }
  return out;
}
