import '../styles/base.css'
import './options.css'
import {
  DEFAULT_SETTINGS,
  FONT_FAMILY_OPTIONS,
  type Settings,
} from '../lib/settings'
import { getSettings, setSettings, onSettingsChange } from '../lib/storage'
import { applySettings } from '../lib/theme'

function $<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (!el) throw new Error(`Missing element: ${selector}`)
  return el
}

function fillSelect(
  el: HTMLSelectElement,
  options: readonly { label: string; value: string }[],
): void {
  for (const opt of options) {
    const o = document.createElement('option')
    o.value = opt.value
    o.textContent = opt.label
    el.appendChild(o)
  }
}

async function main(): Promise<void> {
  const enabledEl = $<HTMLInputElement>('#enabled')
  const fontFamilyEl = $<HTMLSelectElement>('#fontFamily')
  const resetEl = $<HTMLButtonElement>('#reset')

  fillSelect(fontFamilyEl, FONT_FAMILY_OPTIONS)

  function reflect(s: Settings): void {
    enabledEl.checked = s.enabled
    fontFamilyEl.value = s.fontFamily
    applySettings(s)
  }

  reflect(await getSettings())

  enabledEl.addEventListener('change', () => {
    void setSettings({ enabled: enabledEl.checked })
  })
  fontFamilyEl.addEventListener('change', () => {
    void setSettings({ fontFamily: fontFamilyEl.value })
  })

  resetEl.addEventListener('click', async () => {
    await chrome.storage.sync.remove('settings')
    reflect(DEFAULT_SETTINGS)
  })

  onSettingsChange(reflect)
}

void main()
