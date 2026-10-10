import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True on Apple platforms, so shortcuts can show ⌘ instead of Ctrl. */
export function useIsMac() {
  return useSyncExternalStore(
    subscribe,
    () => /Mac|iPhone|iPad/i.test(navigator.platform),
    () => true,
  );
}
