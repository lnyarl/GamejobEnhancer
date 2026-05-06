const BUMP_FLAG = 'gjFontBumped'
const SKIP_SELECTOR = '#adMainLeft, #topWrapAd, .adbannerWrap, #gj-dev-badge'

const DEFAULT_SCALE = 1.077 // 14 / 13
const DEFAULT_MIN_PX = 14

/**
 * Scale every element's computed font-size on the page, applied as inline
 * `!important`. Two-pass measurement so children don't read already-bumped
 * parent values via inherit.
 *
 * Default mapping (scale 1.077, min 14px):
 *   12 -> 14 (clamped)
 *   13 -> 14 (clamped)
 *   14 -> 15.08
 *   16 -> 17.23
 *   22 -> 23.69
 *
 * Skips ad areas (we don't restyle banner contents) and our own dev-badge.
 * Idempotent per body element.
 */
export function bumpFontSizesPageWide(
  scale: number = DEFAULT_SCALE,
  minPx: number = DEFAULT_MIN_PX,
): void {
  const root = document.body
  if (root.dataset[BUMP_FLAG] === '1') return
  root.dataset[BUMP_FLAG] = '1'

  const all = Array.from(root.querySelectorAll<HTMLElement>('*'))
  const sizes = all.map((el) => parseFloat(getComputedStyle(el).fontSize) || 0)

  for (let i = 0; i < all.length; i++) {
    const el = all[i]
    if (el.closest(SKIP_SELECTOR)) continue
    const size = sizes[i]
    if (size > 0) {
      const newSize = Math.max(size * scale, minPx)
      el.style.setProperty('font-size', `${newSize}px`, 'important')
    }
  }
}
