# 제출용 BFS 미션 6 — BFS OS 프론트엔드 MVP

스프린트 미션 5의 정적 랜딩([bfs-landing-sprint-mission5](https://github.com/rockid8choie-ai/bfs-landing-sprint-mission5))을
**React 기반의 동작하는 MVP**로 전환한 프로젝트입니다.
빌딩 시설 운영 서비스 **BFS OS**의 핵심 흐름(민원 접수 → 목록 조회 → 상세/상태 변경 → 완료)을
백엔드 없이 프론트엔드만으로 구현했습니다.

## 핵심 기능 (MVP 범위)

1. **작업 접수** — 제목/분류/위치/우선순위 입력, 유효성 검증(제목 5자 이상, 위치 필수)
2. **작업 목록 조회** — 상태 필터 칩, 검색, 정렬(최신순/긴급 우선), 건수 표시
3. **작업 상세 & 상태 변경** — 접수 → 배정 → 완료 단계 진행, 삭제
4. **로그인 흐름 시뮬레이션 (심화)** — localStorage 세션, 라우트 가드, 로그아웃

## 기술 스택 & 구현 방식

- **React 18 + Vite** — 컴포넌트 기반 화면 구성
- **React Router v6** — 랜딩 → 로그인 → 목록 → 접수/상세 → 완료 화면 전환, 404 처리
- **useState / useEffect / useMemo** — 폼 상태, 필터·정렬 파생 상태 관리
- **localStorage** — 데이터 저장(새로고침에도 유지), Promise + 지연으로 API처럼 감싸
  **로딩 스피너·에러·빈 화면(empty state)** UX까지 시뮬레이션
- **디자인 시스템** — 미션 5 랜딩의 토큰(Toss Blue, 흰 베이스 + 그레이 카드, radius 20px)을
  CSS 변수로 계승, Button/Field/Badge/EmptyState 등 재사용 컴포넌트화

## 사용자 흐름

```
랜딩(/) → 로그인(/login) → 작업 목록(/works)
              ↓                    ↓
        새 접수(/works/new) → 완료(/done) → 상세(/works/:id) → 상태 변경/삭제
```

## 실행

```bash
npm install
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드
```

## 폴더 구조

```
src/
├── main.jsx          # 진입점 (BrowserRouter)
├── App.jsx           # 라우트 정의 + 인증 가드
├── styles.css        # 디자인 시스템 (CSS 변수 토큰)
├── lib/
│   ├── storage.js    # localStorage CRUD + 목데이터 시드
│   └── auth.js       # 로그인 시뮬레이션
├── components/
│   ├── ui.jsx        # Button · Field · Badge · EmptyState · Spinner · Toast
│   └── TopBar.jsx
└── pages/
    ├── Landing.jsx · Login.jsx
    ├── WorkList.jsx · WorkNew.jsx · WorkDetail.jsx
    └── Done.jsx
```
