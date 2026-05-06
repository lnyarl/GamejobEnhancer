import './list.css'
import { interceptAlerts } from '../alert-intercept'
import { showToast } from '../toast'

let wired = false

export function transform(): void {
  if (wired) return
  wired = true
  interceptAlerts((msg) => showToast(msg))
}
