import { transform as transformMain } from './pages/main'
import { transform as transformList } from './pages/list'
import { transform as transformResume } from './pages/resume'
import { transform as transformRecruitHub } from './pages/recruit-hub'
import { transform as transformRecruitDetail } from './pages/recruit-detail'
import { transform as transformCompanyDetail } from './pages/company-detail'

export type PageId =
  | 'main'
  | 'list'
  | 'resume'
  | 'recruit-hub'
  | 'recruit-detail'
  | 'company-detail'
  | 'unknown'

export function detectPage(url: URL): PageId {
  const path = url.pathname.toLowerCase()
  if (path === '/' || path.startsWith('/main/')) return 'main'
  if (path === '/recruit/main') return 'recruit-hub'
  if (path.startsWith('/recruit/gi_read/')) return 'recruit-detail'
  if (path.startsWith('/company/detail')) return 'company-detail'
  if (path.startsWith('/recruit/joblist') || path.startsWith('/list_gi/') || path.startsWith('/list_')) return 'list'
  if (path.startsWith('/user/resume/')) return 'resume'
  return 'unknown'
}

export function route(): PageId {
  const page = detectPage(new URL(location.href))
  document.body.dataset.gjPage = page
  switch (page) {
    case 'main':
      transformMain()
      break
    case 'list':
      transformList()
      break
    case 'resume':
      transformResume()
      break
    case 'recruit-hub':
      transformRecruitHub()
      break
    case 'recruit-detail':
      transformRecruitDetail()
      break
    case 'company-detail':
      transformCompanyDetail()
      break
    case 'unknown':
      break
  }
  return page
}
