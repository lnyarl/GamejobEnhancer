import '../styles/base.css'
import { getSettings, onSettingsChange } from '../lib/storage'
import { applySettings } from '../lib/theme'
import { detectPage, route } from './router'
import { mountDevBadge, updateDevBadge } from './dev-badge'
import { bumpFontSizesPageWide } from '../lib/font-bump'

async function init(): Promise<void> {
  const settings = await getSettings()
  applySettings(settings)

  let mounted = false

  const mount = (): void => {
    if (mounted) return
    bumpFontSizesPageWide()
    route()
    mounted = true
  }

  const unmount = (): void => {
    if (!mounted) return
    if (document.body) delete document.body.dataset.gjPage
    mounted = false
  }

  const whenBodyReady = (cb: () => void): void => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', cb, { once: true })
    } else {
      cb()
    }
  }

  // Dev badge: stays visible regardless of enabled state so the toggle is always reachable.
  if (__GJ_DEV__) {
    whenBodyReady(() =>
      mountDevBadge({
        pageId: detectPage(new URL(location.href)),
        enabled: settings.enabled,
      }),
    )
  }

  onSettingsChange((s) => {
    applySettings(s)
    if (s.enabled && !mounted) whenBodyReady(mount)
    else if (!s.enabled && mounted) unmount()
    if (__GJ_DEV__) updateDevBadge(s.enabled)
  })

  if (settings.enabled) whenBodyReady(mount)
}

void init()
