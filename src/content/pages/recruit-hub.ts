import './recruit-hub.css'

const FILTER_ID = 'gj-filter'
const ITEM_SELECTOR = '.giMenuCell ul > li, .giIcoBx ul > li'
const GROUP_UL_SELECTOR = '.giMenuCell ul, .giIcoBx ul'
const TITLE_SELECTOR = '.giDep1Tit'
const CELL_SELECTOR = '.giMenuCell, .giIcoBx'

export function transform(): void {
  injectFilter()
}

function injectFilter(): void {
  const content = document.getElementById('content')
  if (!content) return
  if (document.getElementById(FILTER_ID)) return

  const wrap = document.createElement('div')
  wrap.className = 'gj-filter-wrap'

  const input = document.createElement('input')
  input.id = FILTER_ID
  input.className = 'gj-filter'
  input.type = 'search'
  input.placeholder = '카테고리 검색…'
  input.autocomplete = 'off'
  input.spellcheck = false
  input.addEventListener('input', () => applyFilter(input.value.trim().toLowerCase()))

  wrap.appendChild(input)
  content.insertBefore(wrap, content.firstChild)
}

function applyFilter(query: string): void {
  const items = document.querySelectorAll<HTMLElement>(ITEM_SELECTOR)
  for (const li of items) {
    const text = (li.textContent ?? '').toLowerCase()
    li.style.display = !query || text.includes(query) ? '' : 'none'
  }

  for (const ul of document.querySelectorAll<HTMLElement>(GROUP_UL_SELECTOR)) {
    const anyVisible = Array.from(ul.children).some(
      (li) => (li as HTMLElement).style.display !== 'none',
    )
    ul.style.display = anyVisible ? '' : 'none'
  }

  for (const tit of document.querySelectorAll<HTMLElement>(TITLE_SELECTOR)) {
    const next = tit.nextElementSibling as HTMLElement | null
    const ulHidden = next?.tagName === 'UL' && next.style.display === 'none'
    tit.style.display = ulHidden ? 'none' : ''
  }

  for (const cell of document.querySelectorAll<HTMLElement>(CELL_SELECTOR)) {
    const anyVisible = Array.from(cell.children).some(
      (c) => (c as HTMLElement).style.display !== 'none',
    )
    cell.style.display = anyVisible ? '' : 'none'
  }
}
