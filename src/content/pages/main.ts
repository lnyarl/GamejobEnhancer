import { pinFontSize } from '../../lib/font-bump'
import './main.css'

export function transform(): void {
  // Page-wide font bump runs from content/index.ts before route().
  // The "join" widget under mainSec_01 has a tight fixed-width layout that
  // breaks when the bump pushes its 12px text up — re-pin it.
  pinFontSize('.mainSec_01 .join > ul', 12)
}
