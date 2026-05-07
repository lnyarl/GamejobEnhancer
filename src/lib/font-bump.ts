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

/**
 * Force a subtree to a fixed font-size, surviving the page-wide bump and any
 * late DOM insertions. Page modules call this from their transform() to fix
 * areas where the bump's 14px floor breaks the site's tight fixed-width layout.
 *
 * Why MutationObserver: parts of the site (e.g., main page widgets) populate
 * their list items after DOMContentLoaded. The bump runs once at mount and
 * misses those late children, but they then *inherit* font-size from an
 * already-bumped ancestor. Re-applying inline `!important` on every mutation
 * keeps the pin authoritative.
 */
export function pinFontSize(selector: string, sizePx: number): void {
  const apply = (root: HTMLElement): void => {
    root.style.setProperty('font-size', `${sizePx}px`, 'important')
    for (const child of root.querySelectorAll<HTMLElement>('*')) {
      child.style.setProperty('font-size', `${sizePx}px`, 'important')
    }
  }

  const watch = (root: HTMLElement): void => {
    apply(root)
    new MutationObserver(() => apply(root)).observe(root, {
      childList: true,
      subtree: true,
    })
  }

  const initial = document.querySelectorAll<HTMLElement>(selector)
  if (initial.length > 0) {
    for (const root of initial) watch(root)
    return
  }

  // Selector not in DOM yet — wait for it to appear, then attach the subtree watcher.
  const bodyObs = new MutationObserver(() => {
    const found = document.querySelectorAll<HTMLElement>(selector)
    if (found.length === 0) return
    for (const root of found) watch(root)
    bodyObs.disconnect()
  })
  bodyObs.observe(document.body, { childList: true, subtree: true })
}
