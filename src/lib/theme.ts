import type { Settings } from './settings'

export function applySettings(settings: Settings, root: HTMLElement = document.documentElement): void {
  root.dataset.gjTheme = settings.theme
  root.style.setProperty('--gj-font-family', settings.fontFamily)
}
