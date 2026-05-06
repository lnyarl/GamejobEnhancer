import type { PageId } from './router'
import { getSettings, setSettings } from '../lib/storage'

const ID = 'gj-dev-badge'

export interface BadgeState {
  pageId: PageId
  enabled: boolean
}

export function mountDevBadge(state: BadgeState): void {
  if (document.getElementById(ID)) {
    updateDevBadge(state.enabled)
    return
  }

  const el = document.createElement('div')
  el.id = ID
  el.title = '클릭: Gamejob Enhancer 켜기/끄기'
  el.dataset.gjPageId = state.pageId
  paint(el, state)

  el.addEventListener('click', async () => {
    const current = await getSettings()
    await setSettings({ enabled: !current.enabled })
  })

  const attach = (): void => {
    document.body?.appendChild(el)
  }
  if (document.body) attach()
  else document.addEventListener('DOMContentLoaded', attach, { once: true })
}

export function updateDevBadge(enabled: boolean): void {
  const el = document.getElementById(ID)
  if (!el) return
  const pageId = (el.dataset.gjPageId ?? 'unknown') as PageId
  paint(el, { pageId, enabled })
}

function paint(el: HTMLElement, { pageId, enabled }: BadgeState): void {
  el.textContent = `GE · ${pageId} · ${enabled ? 'ON' : 'OFF'}`
  el.style.cssText = [
    'position:fixed',
    'top:12px',
    'left:12px',
    'z-index:2147483647',
    'padding:4px 10px',
    'border-radius:999px',
    `background:${enabled ? '#10b981' : '#374151'}`,
    'color:#fff',
    'font:600 11px/1.2 ui-monospace,"JetBrains Mono",Menlo,monospace',
    'letter-spacing:0.04em',
    'box-shadow:0 4px 12px rgba(0,0,0,0.25)',
    'cursor:pointer',
    'user-select:none',
    `opacity:${enabled ? '0.92' : '0.78'}`,
    'transition:background 120ms,opacity 120ms',
  ].join(';')
}
