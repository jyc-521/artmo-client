# ARTMO Client Guidelines

ARTMO(Art + Emotion)의 React 클라이언트. 기분 문장 입력 → 명화 카드 → SNS 공유. 기능 범위·화면 목록·권한표는 `docs/PRD.md`, 디자인 기준은 `docs/design.md`가 기준이며 이 파일에 복사하지 않는다.

## Map & Checks (npm only · Node 24.x)
- Stack: React 19, Vite 7, TypeScript 5.9(ESM), React Router(`HashRouter`), TanStack React Query, Axios, Emotion, react-hook-form, react-toastify, `@supabase/supabase-js`, `html-to-image`. 배포 Vercel. API는 별도 저장소 `artmo-server`(Render).
- `src/App.tsx`: `/auth/callback` 처리를 `HashRouter`보다 먼저, `QueryClientProvider` → `AuthProvider` → `HashRouter` 순서.
- Code: `src/pages/`, `src/components/`, `src/services/`(`http.ts`, 도메인 API, `share.ts`), `src/contexts/AuthContext.tsx`, `src/config/supabase.ts`, `src/styles/`.
- Verify:
  - TypeScript 변경: `npm run typecheck`
  - 린트: `npm exec -- eslint <changed-files>` · 설정 변경 시 `npm run lint`
  - OAuth 콜백·카드 생성 변경: `npm test`
  - Vite 설정·배포 경로 변경: `npm run build`

## Core Invariants
- OAuth: 외부 인증은 해시 없는 `/auth/callback`으로 돌아온다. `vercel.json` 전체 경로 재작성, `flowType: 'pkce'`, `detectSessionInUrl: window.location.pathname !== '/auth/callback'`, `AuthCallbackHandler`의 `useRef` 1회 교환 방지를 유지.
- 인증 상태: SDK `session`만으로 로그인을 판단하지 않고 `GET /api/auth/me` 결과로 정한다. 로그아웃·계정 전환 시 `queryClient.clear()`.
- `ProtectedRoute`·`AdminRoute`는 화면 안내용. 실제 권한은 서버의 401·403이 강제한다.
- API: `VITE_API_BASE_URL`에 `/api`를 붙이지 않는다. 공개 요청 `publicApi`, 로그인 요청 `authApi`(Bearer 자동 첨부), `withCredentials: false`. 추천은 로그인 상태면 `authApi`로 보내 기록을 남긴다.
- 응답 형식: 작품·추천·협찬 `{ data }`, 사용자·프로필 `{ success: true, data }`, 삭제 `204`. `400`은 입력란 아래, `429`는 "잠시 후 다시 시도" 토스트, `5xx`는 일반 오류 토스트.
- 감정 입력: 서버가 `needsMoreDetail: true`와 힌트를 주면 결과 화면으로 가지 않고 입력란 아래에 힌트를 보여준다. 대기 중에는 버튼을 비활성화해 중복 요청을 막는다.
- 출력: 사용자 문장·AI 해석·협찬 설명은 JSX 텍스트로만 출력하고 `dangerouslySetInnerHTML`은 쓰지 않는다. 작품 이미지에는 `alt`(제목·작가)와 로드 실패 대체 이미지.
- 카드 공유: 1080×1920 PNG(`html-to-image`). `navigator.canShare({ files })`면 기기 공유, 아니면 다운로드. 저장·공유 시 `POST /api/recommendations/:id/share`로 기록.
- 협찬 신청 폼: 필수 동의(카드 사용·SNS 공유)와 선택 동의(굿즈)를 나누고, 필수 미체크 시 제출 비활성화, 선택은 기본 해제. 문구는 PRD 7.

## Secrets
- `VITE_*`에는 공개 값만 둔다: `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.
- `GEMINI_API_KEY`, `SUPABASE_SECRET_KEY`, `NAVER_CLIENT_SECRET`은 클라이언트 코드·테스트·`.env.example`에 넣지 않는다. Gemini는 반드시 서버를 거친다.
- 기분 문장은 `localStorage`나 URL 파라미터에 저장하지 않는다. 공유 링크는 추천 ID만 담는다.
- `.env`, `.env.*`(`.env.example` 제외)는 읽지도, 출력하지도, 복사하지도 않는다. 변수 이름은 `.env.example`에서 확인한다. 실수로 키 값을 봤다면 바로 사용자에게 알린다.
- 위 규칙은 도구 설정으로도 강제한다: `.claude/settings.json`(권한 + PreToolUse 훅), `.geminiignore`. `.gitignore`에 `.env*`(`.env.example` 제외)를 유지한다.

## Detailed References (필요할 때만 읽기)
- 제품 명세·화면 목록·권한표: `docs/PRD.md`
- 색·글꼴·카드 구성: `docs/design.md`
- 스킬 (해당 작업을 마치기 전에 실행): 페이지·라우트·API 연동·폼 추가나 수정 → `client-page-feature`
