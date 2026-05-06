import './list.css'
import { interceptAlerts } from '../alert-intercept'
import { showToast } from '../toast'

const COLLAPSIBLE_FLAG = 'gjCollapsible'
const BOOTH_SELECTOR =
  'article.boothList.swordWrap, article.boothList.shieldWrap, article.boothList.armorWrap'
const SORT_BUTTON_SELECTOR = 'span.btnSort > button'
const SCROLL_LOCK_MS = 5000
const BOOTH_STORAGE_KEY = 'boothCollapsed'

type BoothId = 'sword' | 'shield' | 'armor'
type BoothState = Partial<Record<BoothId, boolean>>

let alertWired = false
let sortDelegateWired = false

export function transform(): void {
  if (!alertWired) {
    alertWired = true
    interceptAlerts((msg) => showToast(msg))
  }
  makeBoothsCollapsible()
  if (!sortDelegateWired) {
    sortDelegateWired = true
    document.addEventListener('click', onPossibleSortClick, true)
  }
}

function getBoothId(booth: Element): BoothId | null {
  if (booth.classList.contains('swordWrap')) return 'sword'
  if (booth.classList.contains('shieldWrap')) return 'shield'
  if (booth.classList.contains('armorWrap')) return 'armor'
  return null
}

async function getBoothState(): Promise<BoothState> {
  const raw = await chrome.storage.sync.get(BOOTH_STORAGE_KEY)
  return (raw[BOOTH_STORAGE_KEY] as BoothState) ?? {}
}

async function setBoothCollapsedState(id: BoothId, collapsed: boolean): Promise<void> {
  const current = await getBoothState()
  await chrome.storage.sync.set({
    [BOOTH_STORAGE_KEY]: { ...current, [id]: collapsed },
  })
}

function makeBoothsCollapsible(): void {
  void getBoothState().then((state) => {
    const booths = document.querySelectorAll<HTMLElement>(BOOTH_SELECTOR)
    for (const booth of booths) {
      if (booth.dataset[COLLAPSIBLE_FLAG] === '1') continue
      const header = booth.querySelector<HTMLElement>('h3.boothTit')
      if (!header) continue
      booth.dataset[COLLAPSIBLE_FLAG] = '1'

      const id = getBoothId(booth)
      if (id && state[id]) booth.classList.add('gj-collapsed')

      header.classList.add('gj-collapse-toggle')
      const arrow = document.createElement('span')
      arrow.className = 'gj-collapse-arrow'
      arrow.setAttribute('aria-hidden', 'true')
      arrow.textContent = '▼'
      header.appendChild(arrow)

      header.addEventListener('click', () => {
        const collapsed = booth.classList.toggle('gj-collapsed')
        if (id) void setBoothCollapsedState(id, collapsed)
      })
    }
  })
}

function onPossibleSortClick(event: Event): void {
  const target = event.target
  if (!(target instanceof Element)) return
  if (!target.closest(SORT_BUTTON_SELECTOR)) return
  lockScrollPosition()
}

function lockScrollPosition(): void {
  const startY = window.scrollY
  const startTime = Date.now()
  let released = false

  const release = (): void => {
    released = true
    window.removeEventListener('wheel', release)
    window.removeEventListener('touchstart', release)
    window.removeEventListener('keydown', release)
  }

  window.addEventListener('wheel', release, { once: true, passive: true })
  window.addEventListener('touchstart', release, { once: true, passive: true })
  window.addEventListener('keydown', release, { once: true })

  const tick = (): void => {
    if (released) return
    if (Date.now() - startTime > SCROLL_LOCK_MS) {
      release()
      return
    }
    if (Math.abs(window.scrollY - startY) > 5) {
      window.scrollTo({ top: startY, behavior: 'auto' })
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
