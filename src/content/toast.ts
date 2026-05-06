const ID = 'gj-toast'
let timer: number | undefined

export function showToast(message: string, durationMs = 2600): void {
  document.getElementById(ID)?.remove()
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }

  const el = document.createElement('div')
  el.id = ID
  el.textContent = message
  el.style.cssText = [
    'position:fixed',
    'top:50px',
    'left:12px',
    'z-index:2147483647',
    'padding:10px 16px',
    'background:#0e1117',
    'color:#f3f5f9',
    'border-radius:10px',
    'box-shadow:0 6px 20px rgba(0,0,0,0.18)',
    'font:500 13px/1.4 system-ui,"Pretendard","Apple SD Gothic Neo",sans-serif',
    'max-width:360px',
    'pointer-events:none',
    'opacity:0',
    'transition:opacity 180ms ease',
  ].join(';')

  const mount = (): void => {
    document.body?.appendChild(el)
    requestAnimationFrame(() => {
      el.style.opacity = '1'
    })
  }
  if (document.body) mount()
  else document.addEventListener('DOMContentLoaded', mount, { once: true })

  timer = window.setTimeout(() => {
    el.style.opacity = '0'
    setTimeout(() => el.remove(), 200)
    timer = undefined
  }, durationMs)
}
