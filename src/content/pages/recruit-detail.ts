import './recruit-detail.css'

const AUGMENT_FLAG = 'gjAugmented'
const SIDEBAR_SELECTOR = 'article.content__recruit-data'
const BODY_META_SELECTOR = 'article.recruit-data'
const SUBNAV_CLASS = 'gj-subnav'

/** Body-meta labels worth surfacing in the sticky sidebar. */
const SIDEBAR_BODY_KEYS = ['모집분야', '게임분야', '대표게임']

/** Section title keywords whose corresponding sub-nav entry should be hidden
 *  (e.g. "㈜… 에서 진행중인 채용 정보 확인해 보세요!" — promo, not main content). */
const SUBNAV_LABEL_BLOCK = ['진행중인 채용', '진행 중인 채용']

/** Toggle-button text strings to strip from popover content (cloneNode loses
 *  their handlers anyway; the popover already shows the full content). */
const POPOVER_TOGGLE_TEXT = ['더보기', '더 보기', '접어두기', '접기']

export function transform(): void {
  augmentSidebarMeta()
  injectSubNavWithPeek()
}

/* ------------------------------------------------------------------ */
/* Sidebar augmentation                                               */
/* ------------------------------------------------------------------ */

function augmentSidebarMeta(): void {
  const sidebar = document.querySelector<HTMLElement>(SIDEBAR_SELECTOR)
  if (!sidebar) return
  if (sidebar.dataset[AUGMENT_FLAG] === '1') return
  sidebar.dataset[AUGMENT_FLAG] = '1'

  const insertBefore = sidebar.querySelector<HTMLElement>('.recruit-data-buttons')

  const extras: { label: string; value: string }[] = []
  for (const key of SIDEBAR_BODY_KEYS) {
    const v = readBodyMetaValue(key)
    if (v) extras.push({ label: key, value: v })
  }
  const region = readSubSectionBody('근무지역')
  if (region) extras.push({ label: '근무지역', value: region })

  for (const { label, value } of extras) {
    const dl = buildMetaItem(label, value)
    if (insertBefore) sidebar.insertBefore(dl, insertBefore)
    else sidebar.appendChild(dl)
  }
}

function readBodyMetaValue(label: string): string | null {
  for (const dt of document.querySelectorAll<HTMLElement>(
    `${BODY_META_SELECTOR} dt.recruit-data-title`,
  )) {
    if (dt.textContent?.trim() === label) {
      const v = dt.nextElementSibling?.textContent?.trim().replace(/\s+/g, ' ')
      return v || null
    }
  }
  return null
}

function readSubSectionBody(title: string): string | null {
  for (const sec of document.querySelectorAll<HTMLElement>('div.job-sub-section')) {
    const titleEl = sec.querySelector<HTMLElement>('.job-sub-section__title')
    if (!titleEl) continue
    const label = (titleEl.textContent ?? '').trim().split('\n')[0].trim()
    if (label !== title) continue
    const body = sec.querySelector<HTMLElement>('.job-sub-section__body')
    const v = body?.textContent?.trim().replace(/\s+/g, ' ')
    return v || null
  }
  return null
}

/** Copy the site's computed chip styling (subway lines etc.) onto cloned
 *  elements as inline style, so the popover preserves brand colors that
 *  depend on parent-context selectors. */
function replicateChipStyles(originalRoot: Element, clonedRoot: Element): void {
  const selector = '[class*="chip-subwayline"]'
  const origs = originalRoot.querySelectorAll(selector)
  const clones = clonedRoot.querySelectorAll<HTMLElement>(selector)
  const props = [
    'background-color',
    'color',
    'border',
    'border-radius',
    'padding',
    'margin',
    'font-size',
    'font-weight',
    'line-height',
    'display',
  ]
  const len = Math.min(origs.length, clones.length)
  for (let i = 0; i < len; i++) {
    const cs = getComputedStyle(origs[i])
    const clone = clones[i]
    for (const p of props) {
      clone.style.setProperty(p, cs.getPropertyValue(p))
    }
  }
}

function stripToggleButtons(root: HTMLElement): void {
  for (const el of root.querySelectorAll<HTMLElement>('button, a')) {
    const text = (el.textContent ?? '').trim()
    if (text.length > 12) continue
    if (POPOVER_TOGGLE_TEXT.some((kw) => text.includes(kw))) {
      el.remove()
    }
  }
}

function buildMetaItem(label: string, value: string): HTMLDListElement {
  const dl = document.createElement('dl')
  dl.className = 'recruit-data-item flex align-item gj-extra-meta'

  const dt = document.createElement('dt')
  dt.className = 'recruit-data-title'
  dt.textContent = label

  const dd = document.createElement('dd')
  dd.className = 'recruit-data-text'
  dd.textContent = value

  dl.appendChild(dt)
  dl.appendChild(dd)
  return dl
}

/* ------------------------------------------------------------------ */
/* Sub-nav with peek popover (no forced scroll)                       */
/* ------------------------------------------------------------------ */

function injectSubNavWithPeek(): void {
  if (document.querySelector(`.${SUBNAV_CLASS}`)) return

  const sections = Array.from(document.querySelectorAll<HTMLElement>('div.job-sub-section'))
  const items: { label: string; section: HTMLElement }[] = []
  for (const sec of sections) {
    const titleEl = sec.querySelector<HTMLElement>('.job-sub-section__title')
    if (!titleEl) continue
    const label = (titleEl.textContent ?? '').trim().split('\n')[0].trim()
    if (!label) continue
    if (SUBNAV_LABEL_BLOCK.some((kw) => label.includes(kw))) continue
    items.push({ label, section: sec })
  }
  if (items.length === 0) return

  const tabHead = document.querySelector<HTMLElement>('.view-detail-head')
  if (!tabHead?.parentElement) return

  const nav = document.createElement('nav')
  nav.className = SUBNAV_CLASS
  nav.setAttribute('aria-label', '본문 섹션')

  const inner = document.createElement('div')
  inner.className = 'gj-subnav__inner'
  nav.appendChild(inner)

  const popover = document.createElement('div')
  popover.className = 'gj-subnav-popover'
  popover.setAttribute('role', 'dialog')
  nav.appendChild(popover)

  let activeButton: HTMLButtonElement | null = null

  const close = (): void => {
    popover.classList.remove('is-open')
    activeButton?.classList.remove('is-active')
    activeButton = null
    popover.replaceChildren()
  }

  const positionPopover = (): void => {
    const innerRect = inner.getBoundingClientRect()
    popover.style.left = `${innerRect.left}px`
    popover.style.width = '970px'
  }

  const openItem = (
    btn: HTMLButtonElement,
    item: { label: string; section: HTMLElement },
  ): void => {
    activeButton?.classList.remove('is-active')
    btn.classList.add('is-active')
    activeButton = btn

    popover.replaceChildren()

    const closeBtn = document.createElement('button')
    closeBtn.type = 'button'
    closeBtn.className = 'gj-subnav-popover__close'
    closeBtn.setAttribute('aria-label', '닫기')
    closeBtn.textContent = '×'
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      close()
    })

    const title = document.createElement('div')
    title.className = 'gj-subnav-popover__title'
    title.textContent = item.label

    const content = document.createElement('div')
    content.className = 'gj-subnav-popover__content'
    const body = item.section.querySelector<HTMLElement>('.job-sub-section__body')
    if (body) content.appendChild(body.cloneNode(true))
    else content.textContent = item.section.textContent ?? ''
    stripToggleButtons(content)
    replicateChipStyles(item.section, content)

    popover.appendChild(closeBtn)
    popover.appendChild(title)
    popover.appendChild(content)
    positionPopover()
    popover.classList.add('is-open')
  }

  window.addEventListener('resize', () => {
    if (popover.classList.contains('is-open')) positionPopover()
  })

  for (const item of items) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'gj-subnav__item'
    btn.textContent = item.label
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (activeButton === btn) {
        close()
      } else {
        openItem(btn, item)
      }
    })
    inner.appendChild(btn)
  }

  document.addEventListener('click', (e) => {
    const t = e.target
    if (t instanceof Node && !nav.contains(t)) close()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
  })

  tabHead.appendChild(nav)
}
