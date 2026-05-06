import './company-detail.css'

const BUMP_FLAG = 'gjFontBumped'
const BUMP_AMOUNT = 2 // px — site is built around 13/16/22; user wants 15/18/24
const SKIP_SELECTOR = '#adMainLeft, #topWrapAd, .adbannerWrap, #gj-dev-badge'

export function transform(): void {
  bumpFontSizesPageWide()
}

function bumpFontSizesPageWide(): void {
  const root = document.body
  if (root.dataset[BUMP_FLAG] === '1') return
  root.dataset[BUMP_FLAG] = '1'

  const all = Array.from(root.querySelectorAll<HTMLElement>('*'))
  // Measure every element first so children read original (non-bumped)
  // inherited values, then apply in a second pass.
  const sizes = all.map((el) => parseFloat(getComputedStyle(el).fontSize) || 0)

  for (let i = 0; i < all.length; i++) {
    const el = all[i]
    if (el.closest(SKIP_SELECTOR)) continue
    const size = sizes[i]
    if (size > 0) {
      el.style.setProperty('font-size', `${size + BUMP_AMOUNT}px`, 'important')
    }
  }
}
