/*
 * Listens (in the isolated world) for alert messages forwarded by
 * `alert-patch-main.ts` and hands them to the supplied handler so the
 * page can render them as toasts.
 */

const MSG_SOURCE = 'gj-alert-intercept'

let initialized = false

export function interceptAlerts(handler: (message: string) => void): void {
  if (initialized) return
  initialized = true

  window.addEventListener('message', (event) => {
    if (event.source !== window) return
    const data = event.data as { source?: string; message?: string } | undefined
    if (data?.source !== MSG_SOURCE || typeof data.message !== 'string') return
    handler(data.message)
  })
}
