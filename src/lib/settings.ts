export type ThemeName = 'light' | 'dark'

export interface Settings {
  enabled: boolean
  theme: ThemeName
  fontFamily: string
  fontSize: number
}

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  theme: 'light',
  fontFamily: 'system-ui, "Pretendard", "Apple SD Gothic Neo", sans-serif',
  fontSize: 14,
}

export const FONT_FAMILY_OPTIONS: { label: string; value: string }[] = [
  { label: 'System default', value: 'system-ui, "Pretendard", "Apple SD Gothic Neo", sans-serif' },
  { label: 'Pretendard', value: '"Pretendard", system-ui, sans-serif' },
  { label: 'Inter + Noto Sans KR', value: '"Inter", "Noto Sans KR", sans-serif' },
  { label: 'Serif (Noto Serif KR)', value: '"Noto Serif KR", serif' },
  { label: 'Mono (JetBrains Mono)', value: '"JetBrains Mono", "D2Coding", monospace' },
]

export const THEME_OPTIONS: { label: string; value: ThemeName }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]
