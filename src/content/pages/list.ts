import './list.css'
import { interceptAlerts } from '../alert-intercept'
import { showToast } from '../toast'

const COLLAPSIBLE_FLAG = 'gjCollapsible'
const BOOTH_SELECTOR =
  'article.boothList.swordWrap, article.boothList.shieldWrap, article.boothList.armorWrap'

let alertWired = false

export function transform(): void {
  if (!alertWired) {
    alertWired = true
    interceptAlerts((msg) => showToast(msg))
  }
  makeBoothsCollapsible()
}

function makeBoothsCollapsible(): void {
  const booths = document.querySelectorAll<HTMLElement>(BOOTH_SELECTOR)
  for (const booth of booths) {
    if (booth.dataset[COLLAPSIBLE_FLAG] === '1') continue
    const header = booth.querySelector<HTMLElement>('h3.boothTit')
    if (!header) continue
    booth.dataset[COLLAPSIBLE_FLAG] = '1'

    header.classList.add('gj-collapse-toggle')
    const arrow = document.createElement('span')
    arrow.className = 'gj-collapse-arrow'
    arrow.setAttribute('aria-hidden', 'true')
    arrow.textContent = '▼'
    header.appendChild(arrow)

    header.addEventListener('click', () => {
      booth.classList.toggle('gj-collapsed')
    })
  }
}
