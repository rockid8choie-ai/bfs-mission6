# BFS OS — 미션 6 MVP + 미션 8 고도화 (프론트엔드)

스프린트 미션 5의 정적 랜딩([bfs-landing-sprint-mission5](https://github.com/rockid8choie-ai/bfs-landing-sprint-mission5))을
**React 기반의 동작하는 MVP**로 전환하고(미션 6),
미션 8에서 **실제 유저 기능(JWT 인증) + OpenAI 민원 자동 분류**로 고도화한 프로젝트입니다.
빌딩 시설 운영 서비스 **BFS OS**의 핵심 흐름: 민원 접수 → 목록 조회 → 상세/상태 변경 → 완료.

- 배포: https://bfs-mission6.vercel.app
- 백엔드(미션 7 서버 확장): [backend-route](https://github.com/rockid8choie-ai/backend-route) · https://backend-route.vercel.app

## 미션 8 고도화 — 무엇을, 왜

### 선택한 기능 ① 유저 기능 (회원가입/로그인)

**기존 MVP의 한계**: 미션 6의 로그인은 localStorage 시뮬레이션이라 누구나 이름만 넣으면
통과했고, 접수한 작업도 그 브라우저에만 남았습니다. 기기를 바꾸면 데이터가 사라지고,
여러 사용자를 구분할 수 없어 "내 민원"이라는 개념 자체가 성립하지 않았습니다.

**구현 범위 (MVP 최소)**:
- 이메일/비밀번호 회원가입·로그인 (백엔드에서 bcrypt 해시, JWT 7일 발급)
- 작업 데이터를 localStorage → 서버 DB(Supabase Postgres)로 이전
- **본인이 접수한 작업만** 조회/변경/삭제 가능 (서버에서 소유권 검증)
- 토큰 만료 시 세션 정리 후 로그인 화면으로 안내

**사용 시나리오**: 랜딩 → 회원가입(또는 로그인) → 작업 접수 → 다른 기기에서
같은 계정으로 로그인해도 같은 목록이 보인다.

### 선택한 기능 ② OpenAI API — 민원 자동 분류

**기존 MVP의 한계**: 민원을 접수하는 입주사 직원은 "이게 전기 문제인지 배관 문제인지",
"긴급인지 보통인지"를 판단하기 어렵습니다. 잘못 분류된 민원은 담당 기사 배정이 늦어집니다.

**구현 범위 (MVP 최소)**: 접수 화면에서 제목/설명 입력 후
**"🤖 AI로 분류·우선순위 추천받기"** 버튼 → 백엔드 `/ai/classify`가
OpenAI(gpt-4o-mini)에 분류를 요청 → 분류·우선순위가 자동 선택되고 한 줄 근거가 표시됩니다.
추천값은 제안일 뿐이라 사용자가 언제든 수정할 수 있고, **AI가 실패하거나 키가 없으면
안내 메시지와 함께 수동 입력으로 자연스럽게 폴백**합니다.

### UX 고려 (심화)
- 모든 API 호출에 로딩 상태(스피너/버튼 비활성), 서버가 내려준 에러 메시지 그대로 표시
- 빈 목록 empty state, 404 작업 없음 화면, 토큰 만료 시 재로그인 유도
- AI 버튼은 제목 5자 미만이면 요청 전에 인라인으로 안내

### 기술 선택 이유
- **JWT (세션 서버 없이)**: Vercel 서버리스 환경이라 서버 메모리 세션을 둘 수 없어
  무상태 JWT가 가장 단순. MVP 단계에서 리프레시 토큰은 의도적으로 생략(7일 만료로 대체).
- **gpt-4o-mini + JSON 응답 강제**: 분류는 소형 모델로 충분하고 저렴.
  `response_format: json_object`로 파싱 실패를 구조적으로 차단하고,
  허용 목록 밖 값은 서버에서 안전한 기본값으로 보정.
- **API 키는 전부 백엔드 환경 변수**: OpenAI 키·JWT 시크릿·DB URL은 클라이언트에
  일절 노출되지 않음. 프론트는 `VITE_API_URL`(공개 주소)만 사용.

## 핵심 기능

1. **작업 접수** — 제목/분류/위치/우선순위 입력, 유효성 검증(제목 5자 이상, 위치 필수)
   + **AI 분류·우선순위 추천** (미션 8)
2. **작업 목록 조회** — 상태 필터 칩, 검색, 정렬(최신순/긴급 우선), 건수 표시
3. **작업 상세 & 상태 변경** — 접수 → 배정 → 완료 단계 진행, 삭제
4. **회원가입/로그인** — JWT 인증, 라우트 가드, 본인 작업만 조회 (미션 8에서 시뮬레이션 → 실인증 전환)

## 기술 스택 & 구현 방식

- **React 18 + Vite** — 컴포넌트 기반 화면 구성
- **React Router v6** — 랜딩 → 로그인 → 목록 → 접수/상세 → 완료 화면 전환, 404 처리
- **useState / useEffect / useMemo** — 폼 상태, 필터·정렬 파생 상태 관리
- **백엔드 API 연동** — `src/lib/api.js` fetch 클라이언트(JWT 헤더, 에러 메시지 전달,
  401 시 세션 정리), 데이터는 서버 DB에 저장. 로딩 스피너·에러·빈 화면 UX 유지
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

기본 API 서버는 배포된 `https://backend-route.vercel.app`을 사용합니다.
로컬 백엔드를 쓰려면 `.env.local`에 `VITE_API_URL=http://localhost:4000`을 설정하세요.
(비밀 키는 전부 백엔드에만 있으며 프론트 환경 변수에는 공개 주소만 들어갑니다.)

## 폴더 구조

```
src/
├── main.jsx          # 진입점 (BrowserRouter)
├── App.jsx           # 라우트 정의 + 인증 가드
├── styles.css        # 디자인 시스템 (CSS 변수 토큰)
├── lib/
│   ├── api.js        # 백엔드 fetch 클라이언트 (JWT, 에러 처리, AI 분류 호출)
│   ├── storage.js    # 작업 CRUD — /works API 연동
│   └── auth.js       # 회원가입/로그인 — /auth API (JWT)
├── components/
│   ├── ui.jsx        # Button · Field · Badge · EmptyState · Spinner · Toast
│   └── TopBar.jsx
└── pages/
    ├── Landing.jsx · Login.jsx
    ├── WorkList.jsx · WorkNew.jsx · WorkDetail.jsx
    └── Done.jsx
```
