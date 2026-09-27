import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { errorMessage } from "@/utils/errors";

/** What the last finished request returned, and which request it was. */
type Settled<T> = {
  depsKey: string;
  version: number;
  data: T | undefined;
  error: string | null;
};

/**
 * Load data from the API and keep it fresh.
 *
 *   const { data, error, loading, reload } = useApi(() => studentsApi.list(courseId), [courseId]);
 *
 * - `deps` works like useEffect's: change one and the request runs again.
 *   They must be plain values (ids, strings, booleans).
 * - While reloading, the previous data stays on screen. When the deps change
 *   (a different course, say), the old data is dropped at once.
 * - The data is fetched again whenever the screen comes back into focus, so a
 *   tab reflects changes made on another screen (e.g. attendance taken).
 * - Pass `null` as the loader to skip loading (e.g. no course selected yet).
 */
export function useApi<T>(load: (() => Promise<T>) | null, deps: unknown[]) {
  const [version, setVersion] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const depsKey = JSON.stringify(deps);

  useEffect(() => {
    if (!load) return;
    let active = true;

    load()
      .then((data) => active && setSettled({ depsKey, version, data, error: null }))
      .catch((error: unknown) =>
        active && setSettled((prev) => ({ depsKey, version, data: prev?.depsKey === depsKey ? prev.data : undefined, error: errorMessage(error) })),
      );

    return () => {
      active = false;
    };
    // `load` is a new function every render; depsKey and version say when to rerun.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  // Refetch when the screen regains focus, but not on the first focus —
  // the effect above has already loaded it.
  const hasFocused = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (hasFocused.current) reload();
      hasFocused.current = true;
    }, [reload]),
  );

  const current = load !== null && settled?.depsKey === depsKey ? settled : null;
  const loading = load !== null && (current === null || current.version !== version);

  return {
    data: current?.data,
    // A retry in flight shows as loading, not as the old error.
    error: loading ? null : (current?.error ?? null),
    loading,
    reload,
  };
}
