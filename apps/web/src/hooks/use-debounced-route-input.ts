import { useRouter } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { debounce } from '@/utils/debounce';

/**
 * The most recent value handed to the router, paired with the local edit that
 * produced it. TanStack Router supersedes older pending search navigations, so
 * the hook only needs to remember the latest commit rather than keep a queue.
 */
type PendingCommit = {
  /** The normalized string sent to `onCommit`. */
  value: string;
  /** The local edit revision at the time the commit was dispatched. */
  revision: number;
};

interface UseDebouncedRouteInputOptions<Name extends string> {
  /** Identifies the route value when several inputs share one commit callback. */
  name: Name;
  /** The current value from route search state; `undefined` is normalized to an empty string. */
  value: string | undefined;
  /** Persists a settled input value to the router or another URL-state owner. */
  onCommit: (name: Name, value: string) => void | Promise<void>;
  /** Time without edits before committing. Defaults to 300 ms. */
  delay?: number;
}

/**
 * Creates immediate controlled-input state backed by a debounced route value.
 *
 * Local edits are displayed synchronously, while `onCommit` runs only after
 * the debounce delay. The hook distinguishes an acknowledgement of its own
 * commit from a genuinely external URL change, ensuring that an async router
 * transition cannot overwrite characters typed after that transition began.
 * Pending work is also canceled as soon as pathname navigation starts, because
 * the current route may remain mounted while the destination is loading.
 *
 * This hook must be rendered within a TanStack Router provider.
 *
 * @example
 * const [category, setCategory] = useDebouncedRouteInput({
 *   name: 'category',
 *   value: search.category,
 *   onCommit: updateSearch,
 * });
 *
 * return <Input value={category} onChange={(event) => setCategory(event.target.value)} />;
 */
export function useDebouncedRouteInput<Name extends string>({
  name,
  value: externalValue,
  onCommit,
  delay = 300,
}: UseDebouncedRouteInputOptions<Name>): readonly [string, (value: string) => void] {
  const router = useRouter();
  const normalizedValue = externalValue ?? '';
  const [value, setValue] = useState(normalizedValue);

  // Incremented synchronously for every local edit so URL acknowledgements can
  // determine whether the user has typed again since a commit was dispatched.
  const revisionRef = useRef(0);
  const pendingCommitRef = useRef<PendingCommit | null>(null);

  const debouncedCommit = useMemo(
    () =>
      debounce((nextValue: string) => {
        pendingCommitRef.current = {
          value: nextValue,
          revision: revisionRef.current,
        };
        void onCommit(name, nextValue);
      }, delay),
    [delay, name, onCommit],
  );

  useEffect(() => {
    // An external value matching the latest commit acknowledges our own router
    // update. Any other value came from outside this input, such as Back/Forward.
    const pendingCommit = pendingCommitRef.current;
    pendingCommitRef.current = null;

    if (pendingCommit?.value === normalizedValue) {
      // A newer revision may already have another debounce scheduled. Preserve
      // its visible value and timer instead of reverting to this acknowledgement.
      if (pendingCommit.revision !== revisionRef.current) {
        return;
      }
    }

    // No newer local edit exists, so the URL is now the authoritative value.
    debouncedCommit.cancel();
    setValue(normalizedValue);
  }, [debouncedCommit, normalizedValue]);

  const cancel = useCallback(() => {
    // Clearing both pieces prevents a canceled commit from being mistaken for a
    // future URL acknowledgement if this route remains mounted.
    debouncedCommit.cancel();
    pendingCommitRef.current = null;
  }, [debouncedCommit]);

  useEffect(() => {
    const unsubscribe = router.subscribe('onBeforeNavigate', ({ pathChanged }) => {
      if (pathChanged) {
        // This route can remain mounted while the destination's loaders run.
        cancel();
      }
    });

    return () => {
      unsubscribe();
      cancel();
    };
  }, [cancel, router]);

  const setInputValue = useCallback(
    (nextValue: string) => {
      revisionRef.current += 1;
      setValue(nextValue);

      // Returning to the current URL needs no navigation unless another commit
      // is already resolving and would otherwise replace that URL value.
      if (nextValue === normalizedValue && pendingCommitRef.current === null) {
        debouncedCommit.cancel();
        return;
      }

      debouncedCommit(nextValue);
    },
    [debouncedCommit, normalizedValue],
  );

  return [value, setInputValue] as const;
}
