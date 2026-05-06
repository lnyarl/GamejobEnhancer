/*
 * Runs in the page's main world via manifest content_scripts entry
 * (world: "MAIN", run_at: "document_start"). Patches window.alert before
 * any site script can grab a reference, then forwards the message via
 * postMessage to the isolated-world content script for toast rendering.
 *
 * Scoped to the listings page (`/Recruit/joblist*`) by URL gate so other
 * pages keep native alert behavior.
 *
 * confirm()/prompt() left untouched — their return values and blocking
 * semantics can't be replicated with an async toast.
 */

;(() => {
  const path = location.pathname.toLowerCase()
  if (!path.startsWith('/recruit/joblist')) return

  const w = window as unknown as Window & { __gjAlertPatched?: boolean; __gjAlertOriginal?: typeof alert }
  if (w.__gjAlertPatched) return
  w.__gjAlertPatched = true

  const orig = window.alert
  w.__gjAlertOriginal = orig

  window.alert = function (message?: unknown): void {
    try {
      window.postMessage(
        { source: 'gj-alert-intercept', message: String(message ?? '') },
        '*',
      )
    } catch {
      orig.call(window, String(message ?? ''))
    }
  }
})()
