import '../styles/base.css'
import './options.css'
import {
  DEFAULT_SETTINGS,
  FONT_FAMILY_OPTIONS,
  THEME_OPTIONS,
  type Settings,
  type ThemeName,
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
  const themeEl = $<HTMLSelectElement>('#theme')
  const fontFamilyEl = $<HTMLSelectElement>('#fontFamily')
  const fontSizeEl = $<HTMLInputElement>('#fontSize')
  const fontSizeValueEl = $<HTMLSpanElement>('#fontSizeValue')
  const resetEl = $<HTMLButtonElement>('#reset')

  fillSelect(themeEl, THEME_OPTIONS)
  fillSelect(fontFamilyEl, FONT_FAMILY_OPTIONS)

  function reflect(s: Settings): void {
    enabledEl.checked = s.enabled
    themeEl.value = s.theme
    fontFamilyEl.value = s.fontFamily
    fontSizeEl.value = String(s.fontSize)
    fontSizeValueEl.textContent = `${s.fontSize}px`
    applySettings(s)
  }

  reflect(await getSettings())

  enabledEl.addEventListener('change', () => {
    void setSettings({ enabled: enabledEl.checked })
  })
  themeEl.addEventListener('change', () => {
    void setSettings({ theme: themeEl.value as ThemeName })
  })
  fontFamilyEl.addEventListener('change', () => {
    void setSettings({ fontFamily: fontFamilyEl.value })
  })
  fontSizeEl.addEventListener('input', () => {
    const v = Number(fontSizeEl.value)
    fontSizeValueEl.textContent = `${v}px`
    void setSettings({ fontSize: v })
  })

  resetEl.addEventListener('click', async () => {
    await chrome.storage.sync.remove('settings')
    reflect(DEFAULT_SETTINGS)
  })

  onSettingsChange(reflect)
}

void main()
