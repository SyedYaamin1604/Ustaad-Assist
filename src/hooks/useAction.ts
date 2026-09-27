import { useCallback, useState } from "react";

import { showError } from "@/utils/errors";

/**
 * Run a mutation from a button, with a busy flag and an error alert.
 *
 *   const { busy, run } = useAction();
 *   <PrimaryButton disabled={busy} onPress={() => run(() => planApi.generate(id), "Could not build the plan")} />
 *
 * Resolves with the result, or undefined if it failed (the alert is already shown).
 */
export function useAction() {
  const [busy, setBusy] = useState(false);

  const run = useCallback(async <T,>(action: () => Promise<T>, errorTitle?: string): Promise<T | undefined> => {
    setBusy(true);
    try {
      return await action();
    } catch (error) {
      showError(error, errorTitle);
      return undefined;
    } finally {
      setBusy(false);
    }
  }, []);

  return { busy, run };
}
