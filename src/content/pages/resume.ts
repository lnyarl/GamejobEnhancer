import './resume.css'

const FLAG = 'gjPreformatted'
const INDENT_UNIT = 4

interface ParsedLine {
  level: number
  marker: string | null
  content: string
}

export function transform(): void {
  const spans = document.querySelectorAll<HTMLElement>('span.message-content')
  for (const span of spans) {
    if (span.dataset[FLAG] === '1') continue
    rebuild(span)
    span.dataset[FLAG] = '1'
  }
}

function rebuild(span: HTMLElement): void {
  const segments = splitOnBr(span)
  span.replaceChildren(...segments.map(parseLine).map(renderLine))
}

function splitOnBr(span: HTMLElement): string[] {
  const segments: string[] = []
  let buffer = ''
  for (const node of Array.from(span.childNodes)) {
    if (node.nodeName === 'BR') {
      segments.push(buffer)
      buffer = ''
    } else {
      buffer += node.textContent ?? ''
    }
  }
  segments.push(buffer)
  return segments.map((s) => s.replace(/^\s*\n\s*/, '').replace(/\s*\n\s*$/, ''))
}

function parseLine(text: string): ParsedLine {
  let i = 0
  let indent = 0
  while (i < text.length) {
    const ch = text[i]
    if (ch === ' ') indent += 1
    else if (ch === '\t') indent += INDENT_UNIT
    else break
    i++
  }
  const rest = text.slice(i)
  const level = Math.floor(indent / INDENT_UNIT)
  const m = rest.match(/^([-*+])\s+([\s\S]*)$/)
  if (m) return { level, marker: m[1], content: m[2] }
  return { level, marker: null, content: rest }
}

function renderLine(line: ParsedLine): HTMLElement {
  const row = document.createElement('div')
  row.className = 'gj-line'
  row.style.setProperty('--gj-indent-level', String(line.level))

  if (line.marker !== null) {
    const marker = document.createElement('span')
    marker.className = 'gj-line__marker'
    marker.textContent = line.marker
    row.appendChild(marker)
  }

  const content = document.createElement('span')
  content.className = 'gj-line__content'
  content.textContent = line.content
  row.appendChild(content)

  return row
}
