import type { Settings } from './settings'

const BASELINE_FONT_SIZE = 14

export function applySettings(settings: Settings, root: HTMLElement = document.documentElement): void {
  root.dataset.gjTheme = settings.theme
  root.style.setProperty('--gj-font-family', settings.fontFamily)
  root.style.setProperty('--gj-font-size', `${settings.fontSize}px`)
  root.style.setProperty('--gj-font-scale', String(settings.fontSize / BASELINE_FONT_SIZE))
}
