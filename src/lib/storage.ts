import { DEFAULT_SETTINGS, type Settings } from './settings'

const KEY = 'settings'

export async function getSettings(): Promise<Settings> {
  const raw = await chrome.storage.sync.get(KEY)
  return { ...DEFAULT_SETTINGS, ...((raw[KEY] as Partial<Settings>) ?? {}) }
}

export async function setSettings(patch: Partial<Settings>): Promise<void> {
  const current = await getSettings()
  await chrome.storage.sync.set({ [KEY]: { ...current, ...patch } })
}

export function onSettingsChange(cb: (settings: Settings) => void): () => void {
  const handler = (
    changes: { [k: string]: chrome.storage.StorageChange },
    area: chrome.storage.AreaName,
  ): void => {
    if (area !== 'sync' || !(KEY in changes)) return
    void getSettings().then(cb)
  }
  chrome.storage.onChanged.addListener(handler)
  return () => chrome.storage.onChanged.removeListener(handler)
}
