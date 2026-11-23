# ARTMO Client

지금 기분을 한 문장으로 쓰면 어울리는 명화를 카드로 만들어 주는 웹 서비스의 화면. React 19 · Vite · TypeScript.
API 서버는 [artmo-server](https://github.com/jyc-521/artmo-server).

## 로컬 실행

1. `.env.example`을 복사해 `.env.local`로 저장하고 값을 채운다. `VITE_*`는 브라우저에 보이는 공개 값만 넣는다.
   - `VITE_API_BASE_URL`: 서버 주소 (`/api`를 붙이지 않는다)
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase › Project Settings › API Keys
2. 실행

```bash
npm ci
npm run dev      # http://localhost:5173
```

## 화면

| 경로 | 화면 | 접근 |
| --- | --- | --- |
| `/` | 기분 문장 입력 · 힌트 | 공개 |
| `/result/:id` | 추천 결과 · 카드 저장·공유 · 링크 복사 | 공개 |
| `/artworks` | 갤러리 (전체·인기, 감정 태그 필터) | 공개 |
| `/artworks/:id` | 작품 상세 · 저장 | 공개 (저장은 로그인) |
| `/login` · `/register` | 이메일 · Google · 네이버 로그인 | 공개 |
| `/me` | 추천 기록 · 저장 작품 · 협찬 신청 · 내 정보 | 로그인 |
| `/sponsor` | 작품 협찬 신청 | 로그인 |
| `/admin` · `/admin/sponsorships` | 사용자·작품 관리 · 협찬 심사 | 관리자 |

## 검사

```bash
npm run typecheck
npm run lint
npm test         # OAuth 콜백
npm run build
node .agents/skills/client-page-feature/scripts/check-client-safety.mjs
```

## Vercel 배포

- New Project › 이 저장소 › Framework: Vite (자동)
- Environment Variables에 `.env.local`의 세 값 입력 (`VITE_API_BASE_URL`은 Render 서버 주소)
- 배포 후 Supabase › Authentication › URL Configuration에 Vercel 주소와 `https://<주소>/auth/callback` 추가
- 서버(Render)의 `CLIENT_URL`에도 Vercel 주소 추가
