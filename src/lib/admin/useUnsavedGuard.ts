import { useBlocker } from "@tanstack/react-router";

/**
 * Warns before leaving an editor with unsaved changes — both in-app navigation
 * and closing the tab. Drafts live only in this browser, so an accidental back
 * button is the one way an editor can lose real work.
 */
export function useUnsavedGuard(dirty: boolean): void {
  useBlocker({
    disabled: !dirty,
    enableBeforeUnload: () => dirty,
    shouldBlockFn: () =>
      !window.confirm("You have changes that have not been saved. Leave this page anyway?"),
  });
}
