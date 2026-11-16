import type { Ref, RefCallback } from 'react';

/** One ref callback that fills several refs, e.g. a forwarded ref and an internal one. */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    for (const r of refs) {
      if (typeof r === 'function') r(node);
      else if (r) (r as { current: T | null }).current = node;
    }
  };
}
