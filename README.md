# Gamejob Enhancer

게임잡(gamejob.co.kr)의 UI/UX를 현대화하는 Chrome 확장 프로그램.

## 설치

1. [Releases](https://github.com/lnyarl/GamejobEnhancer/releases) 페이지에서 최신 zip 다운로드
2. 압축 해제
3. `chrome://extensions` → 우상단 **개발자 모드 ON**
4. **"압축해제된 확장 프로그램 로드"** → 압축 푼 폴더 선택

## 개선 사항

### 전역 (모든 페이지)

- **폰트 크기 확대** — 사이트 기본 12~13px 본문이 작아 가독성이 떨어지던 문제. 모든 텍스트를 ×1.077 + 최소 14px로 비례 확대(광고 영역 제외).
- **흐린 회색 텍스트 보강** — 사이트의 `#888` 같은 흐린 회색 메타 텍스트를 진한 본문 색으로(light 테마, 페이지별 specific selector).
- **옵션 페이지** — 활성화 토글, 라이트/다크 테마, 5가지 한글 친화 폰트 패밀리.
- **kill switch** — 익스텐션 비활성화 시 사이트 원본 그대로 보임(데이터/CSS 잔재 최소화).

### 채용공고 리스트 (`/Recruit/joblist`)

- **Sword / Shield / Armor 채용관 접기** — 헤더 클릭으로 섹션 접기/펼치기. 상태는 `chrome.storage.sync`에 저장되어 다른 기기에서도 동기화.
- **정렬 버튼 강제 스크롤 차단** — 정렬 클릭 시 사이트의 `scrollTo(0, 0)`로 화면이 위로 튀는 현상 차단. 사용자가 직접 스크롤하면 즉시 lock 해제.
- **alert → 토스트** — "저장 완료" 등 네이티브 alert 대화상자를 좌상단 토스트로 변환. blocking dialog 사라짐.
- **테이블 행간/패딩 확장** — 공고 row 사이 숨 쉴 공간 추가.

### 채용 카테고리 허브 (`/Recruit/Main`)

- **카테고리 실시간 필터** — 본문 상단에 검색 입력창 주입. 직종 70+ 카테고리 즉시 필터링, 매칭 안 되는 셀/그룹은 자동 숨김.
- **좌측 사이드바 sticky** — 스크롤해도 카테고리 메뉴가 따라옴.

### 공고 상세 (`/Recruit/GI_Read/View?GI_No=*`)

- **사이드바 메타 보강** — 우측 sticky 사이드바에 본문에만 있던 모집분야/게임분야/대표게임/근무지역 추가. 결정에 필요한 정보가 한 컬럼에 모임.
- **섹션 미리보기 sub-nav** — 사이트 탭(모집요강/근무환경/접수안내/기업정보) 아래에 sub-nav 주입. 항목 클릭 시 **그 자리에서 popover로 섹션 내용 미리보기** — 강제 스크롤 없음(사용자 위치 그대로 유지).
- popover 안에서 사이트 원본 chip 색상(신분당선 빨강 등) 보존.
- 의미 없는 토글 버튼(`복리후생 더보기` 등) 자동 제거.
- 사이드바 침범 방지를 위해 popover 폭 970px 고정.

### 회사 상세 (`/Company/Detail?M=*`)

- 회사명 prominent 표시(크기 + 굵기 보강).
- 메타 정보의 흐린 회색 라벨을 본문 색으로 contrast 강화.
- 섹션 제목(기업 개요 / 연혁 / 인재상)에 underline 구분선.

### 이력서 (`/User/Resume/*`)

- **본문 hanging indent** — 자유 입력 본문(`message-content`)의 들여쓰기와 `-`/`*`/`+` bullet 마커를 인식. 줄이 wrap될 때 마커가 아니라 **텍스트 시작 지점에 정렬**(전형적인 마크다운 list 스타일).
- **편집 페이지 textarea resize 해제** — 사이트가 강제한 `resize: none`을 풀어 `Company_Text`/`skillText`/`.textarea`를 세로로 자유롭게 늘릴 수 있음. 기본 높이 220px.

## 설정

옵션 페이지(`chrome://extensions` → 카드의 "세부정보" → "확장 프로그램 옵션") 또는 dev 빌드의 좌상단 배지 클릭으로:

- 활성화 토글
- 테마: Light / Dark
- 폰트 패밀리: System / Pretendard / Inter + Noto Sans KR / Noto Serif KR / JetBrains Mono

## 개발

```powershell
npm install
npm run dev    # vite dev 서버 + dist/ 자동 갱신
npm run build  # production 빌드
```

새 페이지 모듈 추가 시:

1. `src/content/pages/<page-id>.ts` + `.css` 생성
2. `src/content/router.ts`의 `PageId`/`detectPage()`/`route()`에 케이스 추가
3. 페이지별 typography 변경은 `src/content/pages/*.css`에서. 글로벌 폰트 사이즈 강제 룰을 `base.css`에 박지 말 것 — 사이트의 의도된 px 위계를 평탄화함.

## 배포

`v*` 형식 태그 push 시 GitHub Actions가 자동으로:

1. manifest 버전을 태그와 동기화
2. `npm run build`
3. `dist/`를 zip으로 압축
4. GitHub Release 생성 + zip 첨부 + 이전 태그 이후 commit으로 자동 changelog

```powershell
git tag v0.1.1
git push origin v0.1.1
```
