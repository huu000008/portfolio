# 🚀 포트폴리오 프로젝트

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.x-3FCF8E?style=flat-square&logo=supabase)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.71-FF4154?style=flat-square&logo=react-query)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss)

> **✨ 최신 웹 개발 스택으로 구현한 포트폴리오 사이트! App Router 기반 Next.js 15 + React 19 조합에 Tailwind CSS v4.1, Supabase 백엔드까지 완벽 조화. 타입 안전성은 기본, 사용자 경험은 최고!**

## 💯 하이라이트

- **서버 컴포넌트 & SSR** - Next.js 15 App Router로 빠른 페이지 로딩
- **풀스택 타입 안전성** - TS + Zod로 프론트엔드부터 백엔드까지 안전하게
- **모바일 퍼스트 디자인** - Tailwind CSS v4.1로 모든 기기에서 완벽한 경험
- **최적화된 데이터 흐름** - React Query + Server Actions로 상태 관리 끝판왕
- **간편한 인증 시스템** - Supabase Auth로 로그인/회원가입 한방에 해결
- **최신 리액트 패턴** - React 19의 새 기능과 훅스로 깔끔한 코드 구현

## 🛠️ 기술 스택

### 프론트엔드

- **프레임워크**: Next.js 15 (App Router) + React 19
- **UI 컴포넌트**: Radix UI + 커스텀 UI
- **스타일링**: Tailwind CSS v4.1 + SCSS
- **상태 관리**: Zustand (클라이언트) + TanStack Query v5 (서버)
- **폼 관리**: React Hook Form + Zod

### 백엔드

- **DB & 인증**: Supabase
- **서버 로직**: Next.js Server Actions
- **배포**: Vercel

### 개발 도구

- **언어**: TypeScript
- **린팅/포맷팅**: ESLint + Prettier
- **패키지 관리**: npm

## 🏃‍♂️ 시작하기

```bash
# 저장소 클론
git clone <repository-url>
cd <repository-name>

# 환경 변수 설정
cp .env.example .env.local
# 필수 환경변수:
# NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
# NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

## 📂 프로젝트 구조

```
/src
 ├── app/                # Next.js App Router
 │   ├── actions/        # Server Actions
 │   ├── auth/           # 인증 페이지
 │   ├── projects/       # 프로젝트 관련 페이지
 │   ├── layout.tsx      # 루트 레이아웃
 │   └── page.tsx        # 메인 페이지
 │
 ├── components/         # UI 컴포넌트
 ├── contexts/           # React Context
 ├── features/           # 도메인별 기능
 ├── hooks/              # 커스텀 훅
 ├── lib/                # 외부 서비스 연동
 ├── stores/             # Zustand 스토어
 ├── styles/             # 글로벌 스타일
 ├── types/              # 타입 정의
 └── utils/              # 유틸리티 함수
```

## 👨‍💻 Tailwind CSS v4.1 설정

최신 Tailwind CSS v4.1 세팅 방법:

1. **설치**:

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

2. **PostCSS 설정** (postcss.config.mjs):

```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
export default config;
```

3. **CSS 설정** (src/styles/tailwind.css):

```css
@import 'tailwindcss';
```

> 💡 v4에서는 @tailwind 대신 @import 사용!

## 🔐 인증 시스템

### 주요 기능

- 이메일/비밀번호 회원가입 & 로그인
- 전역 인증 상태 관리 (AuthContext)
- 권한 기반 UI 렌더링

### 구현 방식

- **클라이언트**: AuthContext + useAuth 훅
- **서버**: Server Actions + requireAuth 미들웨어

## ⚡ 성능 최적화

- 서버 컴포넌트로 클라이언트 JS 최소화
- Next.js Image 컴포넌트로 이미지 최적화
- React.lazy + 동적 임포트로 코드 분할
- TanStack Query 캐싱으로 네트워크 요청 최소화
- Vercel Edge Network로 글로벌 CDN 활용

## 💁‍♀️ 개발 팁

- `/auth/signup`에서 테스트 계정 생성
- `/debug` 페이지로 인증 상태 디버깅
- 코드 변경 시 `npm run lint`로 린팅 체크
- UI 컴포넌트는 독립적으로 테스트 가능하게 설계

## 🔄 기여하기

1. 저장소 포크 & 클론
2. 기능 브랜치 생성: `git checkout -b feature/새기능`
3. 변경사항 커밋: `git commit -m '멋진 기능 추가'`
4. 브랜치 푸시: `git push origin feature/새기능`
5. PR 제출하고 리뷰 받기!

## 📄 라이선스

[MIT](./LICENSE)

---

**🔗 라이브 데모**: [포트폴리오 사이트 (Vercel)](https://my-project-vercel-url.vercel.app)

_궁금한 점이나 피드백 있으면 이슈 남겨주세요! 언제든 환영합니다_ 👋
